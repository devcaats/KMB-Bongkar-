import AppLayout from "@/Layouts/AppLayout";
import { Head } from "@inertiajs/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import Badge from "@/Components/ui/badge/Badge";

const getCsrfToken = () =>
    document.querySelector('meta[name="csrf-token"]')?.getAttribute("content") ?? "";

const requestJson = async (url, options = {}) => {
    const response = await fetch(url, {
        credentials: "same-origin",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "X-CSRF-TOKEN": getCsrfToken(),
            "X-Requested-With": "XMLHttpRequest",
            ...(options.headers ?? {}),
        },
        ...options,
    });

    const payload = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(payload.message || "Request ke bot WA gagal.");
    }

    return payload;
};

const ConfigRow = ({ label, enabled }) => (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-gray-200 px-3 py-2 dark:border-gray-800">
        <span className="text-sm font-medium text-gray-600 dark:text-gray-300">{label}</span>
        <Badge color={enabled ? "success" : "light"}>{enabled ? "Aktif" : "Belum"}</Badge>
    </div>
);

const StatusPanel = ({ status, loading, realtime }) => {
    const connected = Boolean(status?.connected);

    return (
        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold uppercase text-brand-500">Status Koneksi</p>
                    <h2 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                        {loading ? "Memeriksa..." : status?.label || "Belum diketahui"}
                    </h2>
                </div>
                <Badge color={connected ? "success" : "warning"}>
                    {connected ? "Online" : "Perlu Scan"}
                </Badge>
            </div>

            <div className="mt-3 flex items-center gap-2 text-xs font-medium text-gray-500 dark:text-gray-400">
                <span className={`h-2 w-2 rounded-full ${realtime ? "bg-success-500" : "bg-warning-500"}`} />
                {realtime ? "Realtime aktif" : "Realtime reconnecting"}
            </div>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div>
                    <p className="text-xs font-semibold uppercase text-gray-400">Nomor WA</p>
                    <p className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">
                        {status?.phone || "-"}
                    </p>
                </div>
                <div>
                    <p className="text-xs font-semibold uppercase text-gray-400">Nama Perangkat</p>
                    <p className="mt-1 text-sm font-medium text-gray-800 dark:text-gray-200">
                        {status?.name || "-"}
                    </p>
                </div>
            </div>

            {status?.error && (
                <div className="mt-4 rounded-lg bg-error-50 px-3 py-2 text-xs font-medium text-error-700 dark:bg-error-500/10 dark:text-error-400">
                    {status.error}
                </div>
            )}
        </div>
    );
};

const QrPanel = ({ qrImage, qrText, loading, error, connected, onRefresh }) => (
    <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="text-sm font-semibold uppercase text-brand-500">Scan Barcode</p>
                <h2 className="mt-2 text-xl font-bold text-gray-900 dark:text-white">
                    WhatsApp Bot Login
                </h2>
            </div>
            <button
                type="button"
                onClick={onRefresh}
                disabled={loading}
                className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
            >
                <svg className="h-4 w-4" viewBox="0 0 20 20" fill="none">
                    <path
                        d="M16.25 8.75A6.25 6.25 0 105.4 13l-1.65 1.65M3.75 13v4h4"
                        stroke="currentColor"
                        strokeWidth="1.7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
                {loading ? "Memuat..." : "Refresh QR"}
            </button>
        </div>

        <div className="mt-6 flex min-h-[320px] items-center justify-center rounded-lg border border-dashed border-gray-200 bg-gray-50 p-5 dark:border-gray-800 dark:bg-gray-950">
            {connected ? (
                <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-success-100 text-success-600 dark:bg-success-500/20 dark:text-success-400">
                        <svg className="h-7 w-7" viewBox="0 0 24 24" fill="none">
                            <path
                                d="M5 13l4 4L19 7"
                                stroke="currentColor"
                                strokeWidth="2.4"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                    </div>
                    <p className="mt-3 text-sm font-semibold text-gray-800 dark:text-gray-100">
                        WhatsApp bot sudah terhubung.
                    </p>
                </div>
            ) : loading ? (
                <div className="text-center">
                    <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-brand-100 border-t-brand-500" />
                    <p className="mt-3 text-sm font-medium text-gray-500 dark:text-gray-400">
                        Mengambil QR dari service bot...
                    </p>
                </div>
            ) : qrImage ? (
                <img
                    src={qrImage}
                    alt="Barcode scan WhatsApp bot"
                    className="h-auto w-full max-w-[280px] rounded-lg bg-white p-3 shadow-sm"
                />
            ) : qrText ? (
                <div className="w-full max-w-xl text-center">
                    <p className="text-sm font-semibold text-warning-700 dark:text-orange-300">
                        Endpoint bot mengirim kode QR mentah, bukan gambar barcode.
                    </p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Ubah endpoint QR bot agar mengirim PNG, SVG, data:image, atau field JSON image/qrImage.
                    </p>
                    <textarea
                        readOnly
                        value={qrText}
                        className="mt-4 h-24 w-full rounded-lg border border-gray-200 bg-white p-3 text-xs text-gray-600 dark:border-gray-800 dark:bg-gray-900 dark:text-gray-300"
                    />
                </div>
            ) : (
                <div className="max-w-md text-center">
                    <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                        QR belum tersedia.
                    </p>
                    <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                        Pastikan endpoint QR bot sudah aktif, lalu tekan Refresh QR.
                    </p>
                    {error && (
                        <p className="mt-3 rounded-lg bg-error-50 px-3 py-2 text-xs font-medium text-error-700 dark:bg-error-500/10 dark:text-error-400">
                            {error}
                        </p>
                    )}
                </div>
            )}
        </div>

        <div className="mt-4 rounded-lg bg-blue-light-50 px-4 py-3 text-sm text-blue-light-700 dark:bg-blue-light-500/10 dark:text-blue-light-300">
            Buka WhatsApp di HP, pilih Perangkat tertaut, lalu scan barcode yang muncul di atas.
        </div>
    </div>
);

export default function WhatsappBotIndex({ botConfig }) {
    const [status, setStatus] = useState(null);
    const [qrImage, setQrImage] = useState(null);
    const [qrText, setQrText] = useState(null);
    const [statusError, setStatusError] = useState("");
    const [qrError, setQrError] = useState("");
    const [statusLoading, setStatusLoading] = useState(true);
    const [qrLoading, setQrLoading] = useState(false);
    const [actionLoading, setActionLoading] = useState("");
    const [notice, setNotice] = useState(null);
    const [realtimeConnected, setRealtimeConnected] = useState(false);

    const isConfigured = useMemo(
        () => botConfig?.hasQrUrl || botConfig?.hasStatusUrl || botConfig?.hasBaseUrl,
        [botConfig],
    );

    const loadStatus = useCallback(async () => {
        if (!botConfig?.hasStatusUrl) {
            setStatusLoading(false);
            setStatusError("Endpoint status bot belum dikonfigurasi.");
            return;
        }

        setStatusLoading(true);
        try {
            const payload = await requestJson(route("wa-bot.status"));
            setStatus(payload.status);
            setStatusError("");
        } catch (error) {
            setStatusError(error.message);
        } finally {
            setStatusLoading(false);
        }
    }, [botConfig]);

    const loadQr = useCallback(async () => {
        if (!botConfig?.hasQrUrl) {
            setQrError("Endpoint QR bot belum dikonfigurasi.");
            return;
        }

        setQrLoading(true);
        try {
            const payload = await requestJson(route("wa-bot.qr"));
            setQrImage(payload.qrImage ?? null);
            setQrText(payload.qrText ?? null);
            setQrError("");
        } catch (error) {
            setQrImage(null);
            setQrText(null);
            setQrError(error.message);
        } finally {
            setQrLoading(false);
        }
    }, [botConfig]);

    const runAction = async (action, url, successMessage) => {
        setActionLoading(action);
        setNotice(null);

        try {
            await requestJson(url, { method: "POST", body: "{}" });
            setNotice({ type: "success", message: successMessage });
            await loadStatus();
            await loadQr();
        } catch (error) {
            setNotice({ type: "error", message: error.message });
        } finally {
            setActionLoading("");
        }
    };

    useEffect(() => {
        loadStatus();
        loadQr();
    }, [loadStatus, loadQr]);

    useEffect(() => {
        if (typeof EventSource === "undefined") {
            return undefined;
        }

        // eventsUrl is the bot service's native SSE endpoint (direct, no PHP proxy).
        // This avoids blocking php artisan serve (single-threaded).
        const sseUrl = botConfig?.eventsUrl;

        if (!sseUrl) {
            return undefined;
        }

        let source = null;
        let retryTimer = null;

        const connect = () => {
            // Bot service allows CORS (Access-Control-Allow-Origin: *)
            source = new EventSource(sseUrl);

            source.addEventListener("open", () => {
                setRealtimeConnected(true);
            });

            source.addEventListener("error", () => {
                setRealtimeConnected(false);
                source.close();
                // Reconnect after 3 s
                retryTimer = window.setTimeout(connect, 3000);
            });

            source.addEventListener("status", (event) => {
                try {
                    const payload = JSON.parse(event.data || "{}");

                    if (payload.status) {
                        setStatus(payload.status);
                        setStatusLoading(false);
                        setStatusError("");
                    }

                    if (payload.status?.connected) {
                        setQrImage(null);
                        setQrText(null);
                        setQrLoading(false);
                        setQrError("");
                        return;
                    }

                    if (payload.qrImage) {
                        setQrImage(payload.qrImage);
                        setQrText(null);
                        setQrLoading(false);
                        setQrError("");
                        return;
                    }

                    if (payload.qrText) {
                        setQrImage(null);
                        setQrText(payload.qrText);
                        setQrLoading(false);
                    }
                } catch {
                    // Malformed JSON — ignore.
                }
            });
        };

        connect();

        return () => {
            window.clearTimeout(retryTimer);
            source?.close();
            setRealtimeConnected(false);
        };
    }, [botConfig?.eventsUrl]);

    useEffect(() => {
        // When realtime SSE is active, poll as slow safety-net (30 s).
        // When SSE is not connected, poll aggressively (3 s).
        const interval = realtimeConnected ? 30_000 : 3_000;

        const timer = window.setInterval(() => {
            loadStatus();
            if (!status?.connected) {
                loadQr();
            }
        }, interval);

        return () => window.clearInterval(timer);
    }, [loadStatus, loadQr, realtimeConnected, status?.connected]);

    return (
        <AppLayout>
            <Head title="Koneksi WA Bot" />

            <div className="space-y-6">
                <div className="flex flex-col gap-4 border-b border-gray-200 pb-5 dark:border-gray-800 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase text-brand-500">Admin WhatsApp Bot</p>
                        <h1 className="mt-2 text-2xl font-bold text-gray-900 dark:text-white">
                            Koneksi WA Bot
                        </h1>
                        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                            Scan barcode WhatsApp langsung dari web untuk menghubungkan perangkat bot.
                        </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                        <button
                            type="button"
                            onClick={() => runAction("restart", route("wa-bot.restart"), "Session bot diminta restart.")}
                            disabled={!botConfig?.hasRestartUrl || actionLoading !== ""}
                            className="inline-flex items-center justify-center gap-2 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-800 dark:text-gray-200 dark:hover:bg-gray-800"
                        >
                            {actionLoading === "restart" ? "Memproses..." : "Restart Session"}
                        </button>
                        <button
                            type="button"
                            onClick={() => runAction("logout", route("wa-bot.logout"), "Perangkat WA bot berhasil diminta logout.")}
                            disabled={!botConfig?.hasLogoutUrl || actionLoading !== ""}
                            className="inline-flex items-center justify-center gap-2 rounded-lg bg-error-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-error-700 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {actionLoading === "logout" ? "Memproses..." : "Logout Perangkat"}
                        </button>
                    </div>
                </div>

                {!isConfigured && (
                    <div className="rounded-lg border border-warning-200 bg-warning-50 px-4 py-3 text-sm text-warning-700 dark:border-warning-800 dark:bg-warning-500/10 dark:text-orange-300">
                        Endpoint scan bot belum dikonfigurasi. Isi WHATSAPP_BOT_BASE_URL atau endpoint QR/status di file .env.
                    </div>
                )}

                {notice && (
                    <div
                        className={`rounded-lg border px-4 py-3 text-sm font-medium ${
                            notice.type === "success"
                                ? "border-success-200 bg-success-50 text-success-700 dark:border-success-800 dark:bg-success-500/10 dark:text-success-400"
                                : "border-error-200 bg-error-50 text-error-700 dark:border-error-800 dark:bg-error-500/10 dark:text-error-400"
                        }`}
                    >
                        {notice.message}
                    </div>
                )}

                <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
                    <QrPanel
                        qrImage={qrImage}
                        qrText={qrText}
                        loading={qrLoading}
                        error={qrError}
                        connected={Boolean(status?.connected)}
                        onRefresh={loadQr}
                    />

                    <div className="space-y-6">
                        <StatusPanel
                            status={status}
                            loading={statusLoading}
                            realtime={realtimeConnected}
                        />

                        {(statusError || qrError) && (
                            <div className="rounded-lg border border-error-200 bg-error-50 px-4 py-3 text-sm text-error-700 dark:border-error-800 dark:bg-error-500/10 dark:text-error-400">
                                {statusError || qrError}
                            </div>
                        )}

                        <div className="rounded-lg border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900">
                            <p className="text-sm font-semibold uppercase text-brand-500">Konfigurasi</p>
                            <div className="mt-4 space-y-2">
                                <ConfigRow label="Base URL" enabled={botConfig?.hasBaseUrl} />
                                <ConfigRow label="QR Endpoint" enabled={botConfig?.hasQrUrl} />
                                <ConfigRow label="Status Endpoint" enabled={botConfig?.hasStatusUrl} />
                                <ConfigRow label="Restart Endpoint" enabled={botConfig?.hasRestartUrl} />
                                <ConfigRow label="Logout Endpoint" enabled={botConfig?.hasLogoutUrl} />
                                <ConfigRow label="Send Message Endpoint" enabled={botConfig?.hasSendUrl} />
                                <ConfigRow label="Realtime Stream" enabled={Boolean(botConfig?.eventsUrl)} />
                            </div>

                            <div className="mt-4 rounded-lg bg-gray-50 p-3 text-xs leading-5 text-gray-600 dark:bg-gray-950 dark:text-gray-400">
                                Jika memakai WHATSAPP_BOT_BASE_URL, sistem otomatis membaca /qr, /status, /restart, dan /logout.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
