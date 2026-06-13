import express from "express";
import makeWASocket, {
    DisconnectReason,
    fetchLatestBaileysVersion,
    useMultiFileAuthState,
} from "@whiskeysockets/baileys";
import QRCode from "qrcode";
import pino from "pino";
import { existsSync, readFileSync } from "node:fs";

const app = express();

const loadEnvFile = (path = ".env") => {
    if (!existsSync(path)) {
        return;
    }

    const lines = readFileSync(path, "utf8").split(/\r?\n/);

    for (const line of lines) {
        const trimmed = line.trim();

        if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
            continue;
        }

        const index = trimmed.indexOf("=");
        const key = trimmed.slice(0, index).trim();
        let value = trimmed.slice(index + 1).trim();

        if (
            (value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))
        ) {
            value = value.slice(1, -1);
        }

        if (!process.env[key]) {
            process.env[key] = value;
        }
    }
};

loadEnvFile();

// Railway sets PORT automatically; fall back to WHATSAPP_BOT_PORT for local dev.
const port = Number(process.env.PORT || process.env.WHATSAPP_BOT_PORT || 3025);
const authDir = process.env.WHATSAPP_AUTH_DIR || "storage/whatsapp-session";
const apiToken = process.env.WHATSAPP_BOT_TOKEN || "";

let socket = null;
let currentQr = null;
let qrImage = null;
let connected = false;
let botUser = null;
let starting = null;
let connectionState = "starting";
let lastError = null;
let updatedAt = new Date().toISOString();
const eventClients = new Set();

app.use((request, response, next) => {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    response.header("Access-Control-Allow-Methods", "GET,POST,OPTIONS");

    if (request.method === "OPTIONS") {
        response.sendStatus(204);
        return;
    }

    next();
});
app.use(express.json({ limit: "1mb" }));

const logger = pino({ level: process.env.WHATSAPP_BOT_LOG_LEVEL || "silent" });

const requireToken = (request, response, next) => {
    if (!apiToken) {
        next();
        return;
    }

    const header = request.get("authorization") || "";
    const token = header.startsWith("Bearer ") ? header.slice(7) : "";

    if (token !== apiToken) {
        response.status(401).json({ ok: false, message: "Token bot WA tidak valid." });
        return;
    }

    next();
};

const normalizeNumber = (number) => {
    const raw = String(number || "").trim();

    if (!raw) {
        return "";
    }

    let cleaned = raw.replace(/[^\d+]/g, "");

    if (cleaned.startsWith("+")) {
        cleaned = cleaned.slice(1);
    }

    if (cleaned.startsWith("0")) {
        cleaned = `62${cleaned.slice(1)}`;
    }

    return cleaned;
};

const toJid = (number) => {
    const normalized = normalizeNumber(number);
    return normalized ? `${normalized}@s.whatsapp.net` : "";
};

const statusPayload = () => ({
    ok: true,
    connected,
    status: connected ? "connected" : currentQr ? "qr" : connectionState,
    label: connected ? "Terhubung" : currentQr ? "Menunggu Scan QR" : statusLabel(connectionState),
    phone: botUser?.id ? botUser.id.split(":")[0] : null,
    name: botUser?.name || null,
    error: lastError,
    updatedAt,
});

const statusLabel = (state) => {
    if (state === "open" || state === "connected") return "Terhubung";
    if (state === "qr") return "Menunggu Scan QR";
    if (state === "connecting") return "Menghubungkan";
    if (state === "close") return "Terputus";
    if (state === "logged_out") return "Logout";
    return "Menyiapkan Bot";
};

const eventPayload = () => ({
    status: statusPayload(),
    qrImage,
    qrText: currentQr,
});

const broadcast = () => {
    const payload = JSON.stringify(eventPayload());

    for (const client of eventClients) {
        client.write(`event: status\n`);
        client.write(`data: ${payload}\n\n`);
    }
};

const setState = (state, error = null) => {
    connectionState = state;
    lastError = error;
    updatedAt = new Date().toISOString();
    broadcast();
};

const startSocket = async ({ force = false } = {}) => {
    if (socket && !force) {
        return socket;
    }

    if (starting) {
        return starting;
    }

    starting = (async () => {
        const { state, saveCreds } = await useMultiFileAuthState(authDir);
        const { version } = await fetchLatestBaileysVersion();

        socket = makeWASocket({
            auth: state,
            version,
            logger,
            printQRInTerminal: false,
            browser: ["KMB Bongkar", "Chrome", "1.0.0"],
        });

        setState("connecting");
        socket.ev.on("creds.update", saveCreds);
        socket.ev.on("connection.update", async (update) => {
            const { connection, lastDisconnect, qr } = update;
            const statusCode = lastDisconnect?.error?.output?.statusCode;

            console.log(
                `[wa-bot] state=${connection || connectionState} qr=${Boolean(qr)} code=${statusCode || "-"}`,
            );

            if (qr) {
                currentQr = qr;
                try {
                    qrImage = await QRCode.toDataURL(qr);
                } catch {
                    qrImage = null;
                }
                setState("qr");
            }

            if (connection === "connecting") {
                connected = false;
                setState("connecting");
            }

            if (connection === "open") {
                connected = true;
                currentQr = null;
                qrImage = null;
                botUser = socket.user || null;
                setState("connected");
            }

            if (connection === "close") {
                connected = false;
                botUser = null;
                socket = null;

                const shouldReconnect = statusCode !== DisconnectReason.loggedOut;
                const errorMessage = lastDisconnect?.error?.message || null;

                setState(shouldReconnect ? "close" : "logged_out", errorMessage);

                if (shouldReconnect) {
                    starting = null;
                    setTimeout(() => {
                        startSocket().catch((error) => console.error("WA reconnect failed:", error));
                    }, 1500);
                } else {
                    // Logged out — clear session so next connect shows fresh QR
                    const { rm } = await import("node:fs/promises");
                    await rm(authDir, { recursive: true, force: true }).catch(() => {});
                    starting = null;
                    currentQr = null;
                    qrImage = null;
                    setTimeout(() => {
                        startSocket().catch((error) => console.error("WA fresh start failed:", error));
                    }, 1000);
                }            }
        });
    })().finally(() => {
        starting = null;
    });

    return starting;
};

app.get("/status", requireToken, async (_request, response) => {
    await startSocket();
    response.json(statusPayload());
});

app.get("/events", requireToken, async (request, response) => {
    response.writeHead(200, {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
        "X-Accel-Buffering": "no",
    });

    eventClients.add(response);
    response.write(`event: status\n`);
    response.write(`data: ${JSON.stringify(eventPayload())}\n\n`);

    request.on("close", () => {
        eventClients.delete(response);
    });

    await startSocket();
});

app.get("/qr", requireToken, async (_request, response) => {
    await startSocket();

    response.json({
        ok: true,
        qr: currentQr,
        qrImage,
        connected,
    });
});

app.post("/send", requireToken, async (request, response) => {
    await startSocket();

    if (!connected || !socket) {
        response.status(422).json({
            ok: false,
            message: "Bot WA belum terhubung. Buka menu WA Bot lalu scan QR.",
        });
        return;
    }

    const number = request.body.number || request.body.phone || request.body.to;
    const message = request.body.message || request.body.text;
    const jid = toJid(number);

    if (!jid || !message) {
        response.status(422).json({
            ok: false,
            message: "Nomor tujuan dan pesan wajib diisi.",
        });
        return;
    }

    await socket.sendMessage(jid, { text: String(message) });

    response.json({
        ok: true,
        message: "Pesan berhasil dikirim.",
        number: normalizeNumber(number),
    });
});

app.post("/restart", requireToken, async (_request, response) => {
    socket?.end?.();
    socket = null;
    connected = false;
    botUser = null;
    currentQr = null;
    qrImage = null;
    setState("restarting");

    await startSocket({ force: true });

    response.json({ ok: true, message: "Bot WA direstart." });
});

app.post("/logout", requireToken, async (_request, response) => {
    try {
        if (socket) {
            await socket.logout().catch(() => {});
        }
    } catch {
        // Ignore logout errors
    }

    socket = null;
    connected = false;
    botUser = null;
    currentQr = null;
    qrImage = null;

    // Remove stored session so a fresh QR is generated on next connect
    const { rm } = await import("node:fs/promises");
    await rm(authDir, { recursive: true, force: true }).catch(() => {});

    setState("logged_out");

    // Start fresh — will produce a new QR
    setTimeout(() => {
        startSocket({ force: true }).catch((e) => console.error("WA restart after logout failed:", e));
    }, 500);

    response.json({ ok: true, message: "Bot WA logout. Scan QR lagi untuk login." });
});

app.get("/", (_request, response) => {
    response.json(statusPayload());
});

app.listen(port, "0.0.0.0", () => {
    console.log(`WA bot service listening on http://0.0.0.0:${port}`);
    startSocket().catch((error) => console.error("WA bot failed to start:", error));
});
