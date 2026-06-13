# KMB Bongkar — WhatsApp Bot Service

Service Node.js untuk bot WhatsApp menggunakan Baileys.

## Deploy ke Railway

### Langkah 1 — Push folder wa-bot ke GitHub

Folder `wa-bot/` perlu jadi repo GitHub tersendiri (atau gunakan monorepo dengan Root Directory).

**Opsi A: Repo tersendiri (lebih simpel)**
```bash
cd wa-bot
git init
git add .
git commit -m "init wa-bot"
git remote add origin https://github.com/username/kmb-wa-bot.git
git push -u origin main
```

**Opsi B: Dari repo utama (monorepo)**
Di Railway, set **Root Directory** ke `wa-bot` saat setup service.

---

### Langkah 2 — Buat project di Railway

1. Buka [railway.app](https://railway.app) → **New Project**
2. Pilih **Deploy from GitHub repo**
3. Pilih repo yang sudah di-push
4. Jika pakai Opsi B (monorepo): klik service → **Settings** → **Root Directory** → isi `wa-bot`

---

### Langkah 3 — Set environment variables di Railway

Di Railway → service → **Variables**, tambahkan:

| Variable | Value |
|---|---|
| `WHATSAPP_BOT_TOKEN` | string acak panjang (misal: `abc123xyz789`) |
| `WHATSAPP_AUTH_DIR` | `storage/whatsapp-session` |
| `WHATSAPP_BOT_LOG_LEVEL` | `silent` |

> `PORT` otomatis diset Railway, tidak perlu ditambahkan.

---

### Langkah 4 — Tambah Persistent Storage (WAJIB)

Session WhatsApp harus persist agar tidak logout setiap deploy.

1. Di Railway → service → **Volumes**
2. Klik **Add Volume**
3. Mount path: `/app/storage/whatsapp-session`

---

### Langkah 5 — Update .env di cPanel (Laravel)

Setelah Railway deploy, ambil URL service (contoh: `https://kmb-wa-bot.up.railway.app`).

Update `.env` Laravel di cPanel:
```env
WHATSAPP_BOT_BASE_URL=https://kmb-wa-bot.up.railway.app
WHATSAPP_BOT_TOKEN=token_yang_sama_dengan_di_railway
WHATSAPP_BOT_URL=https://kmb-wa-bot.up.railway.app/send
```

---

### CORS untuk SSE (halaman WA Bot)

Bot sudah mengizinkan CORS dari semua origin. Untuk membatasi hanya domain Laravel:

Di `server.js`, ubah:
```js
response.header("Access-Control-Allow-Origin", "*");
```
Menjadi:
```js
response.header("Access-Control-Allow-Origin", "https://domain-laravel-anda.com");
```

---

## Jalankan lokal

```bash
npm install
node server.js
```
