<?php

namespace App\Http\Controllers;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class WhatsappBotController extends Controller
{
    public function index(): Response
    {
        $this->authorizeAdmin();

        // For SSE, point directly to the bot service's /events endpoint.
        // This avoids blocking PHP's single-threaded built-in server.
        // The bot already has CORS headers (Access-Control-Allow-Origin: *).
        $botEventsUrl = $this->endpoint('events');

        return Inertia::render('WhatsappBot/Index', [
            'botConfig' => [
                'hasBaseUrl'    => filled(config('services.whatsapp_bot.base_url')),
                'hasQrUrl'      => filled($this->endpoint('qr')),
                'hasStatusUrl'  => filled($this->endpoint('status')),
                'hasRestartUrl' => filled($this->endpoint('restart')),
                'hasLogoutUrl'  => filled($this->endpoint('logout')),
                'hasSendUrl'    => filled(config('services.whatsapp_bot.url')),
                // Direct URL to bot SSE stream (browser connects directly, no PHP proxy needed)
                'eventsUrl'     => $botEventsUrl,
                'recipient'     => config('services.whatsapp_bot.recipient'),
            ],
        ]);
    }

    public function status(): JsonResponse
    {
        $this->authorizeAdmin();

        $result = $this->botRequest('get', $this->endpoint('status'));

        if (!$result['ok']) {
            return response()->json($result, 422);
        }

        return response()->json([
            'ok' => true,
            'status' => $this->normalizeStatus($result['data']),
            'raw' => $result['data'],
        ]);
    }

    public function qr(): JsonResponse
    {
        $this->authorizeAdmin();

        $result = $this->botRequest('get', $this->endpoint('qr'));

        if (!$result['ok']) {
            return response()->json($result, 422);
        }

        return response()->json([
            'ok' => true,
            ...$this->normalizeQr($result),
        ]);
    }

    public function restart(Request $request): JsonResponse
    {
        $this->authorizeAdmin();

        $result = $this->botRequest('post', $this->endpoint('restart'));

        return response()->json($result, $result['ok'] ? 200 : 422);
    }

    public function logout(): JsonResponse
    {
        $this->authorizeAdmin();

        $result = $this->botRequest('post', $this->endpoint('logout'));

        return response()->json($result, $result['ok'] ? 200 : 422);
    }

    /**
     * SSE proxy: forwards the bot's event stream (or polls status+QR and
     * synthesises SSE events when the bot has no native /events endpoint).
     *
     * NOTE: On PHP built-in server (php artisan serve) this endpoint will
     * block other requests because the server is single-threaded. Use
     * Apache/nginx in production. On development the frontend falls back
     * to polling automatically when SSE is not available.
     */
    public function events(): StreamedResponse
    {
        $this->authorizeAdmin();

        $eventsEndpoint = $this->endpoint('events');
        $statusEndpoint = $this->endpoint('status');
        $qrEndpoint     = $this->endpoint('qr');

        return response()->stream(function () use ($eventsEndpoint, $statusEndpoint, $qrEndpoint) {
            // Disable PHP execution time limit for this long-running SSE stream.
            set_time_limit(0);

            // Disable output buffering so the browser receives data immediately.
            while (ob_get_level()) {
                ob_end_clean();
            }

            // If the bot exposes a native SSE /events endpoint, proxy it.
            if (filled($eventsEndpoint)) {
                $this->proxyEventStream($eventsEndpoint);
                return;
            }

            // Otherwise synthesise SSE events by polling status + QR.
            $this->pollingSseLoop($statusEndpoint, $qrEndpoint);
        }, 200, [
            'Content-Type'      => 'text/event-stream',
            'Cache-Control'     => 'no-cache, no-store',
            'X-Accel-Buffering' => 'no',
            'Connection'        => 'keep-alive',
        ]);
    }

    /**
     * Proxy a native SSE stream from the bot service to the browser.
     */
    private function proxyEventStream(string $url): void
    {
        $token = config('services.whatsapp_bot.token');

        $headers = ['Accept' => 'text/event-stream'];
        if (filled($token)) {
            $headers['Authorization'] = 'Bearer ' . $token;
        }

        $context = stream_context_create(['http' => [
            'method'  => 'GET',
            'header'  => collect($headers)
                ->map(fn ($v, $k) => "$k: $v")
                ->implode("\r\n"),
            'timeout' => 60,
        ]]);

        $stream = @fopen($url, 'r', false, $context);

        if (!$stream) {
            echo "event: error\ndata: {\"message\":\"Tidak dapat membuka stream dari bot service.\"}\n\n";
            flush();
            return;
        }

        $deadline = time() + 55; // close just before nginx/LB timeout

        while (!feof($stream) && time() < $deadline && !connection_aborted()) {
            $line = fgets($stream, 4096);
            if ($line !== false) {
                echo $line;
                flush();
            }
        }

        fclose($stream);
    }

    /**
     * Synthesise SSE by polling status + QR endpoints every ~2 s.
     */
    private function pollingSseLoop(?string $statusEndpoint, ?string $qrEndpoint): void
    {
        $deadline     = time() + 55;
        $lastQrHash   = null;
        $wasConnected = null;

        while (time() < $deadline && !connection_aborted()) {
            $payload = [];

            // --- Status ---
            if (filled($statusEndpoint)) {
                $statusResult = $this->botRequest('get', $statusEndpoint);
                if ($statusResult['ok']) {
                    $normalized = $this->normalizeStatus($statusResult['data']);
                    $payload['status'] = $normalized;

                    $connected = $normalized['connected'];

                    // Send QR when just disconnected or on first check.
                    if (filled($qrEndpoint) && (!$connected || $wasConnected === null)) {
                        $qrResult = $this->botRequest('get', $qrEndpoint);
                        if ($qrResult['ok']) {
                            $qrData  = $this->normalizeQr($qrResult);
                            $qrHash  = md5(($qrData['qrImage'] ?? '') . ($qrData['qrText'] ?? ''));

                            if ($qrHash !== $lastQrHash) {
                                $lastQrHash = $qrHash;
                                $payload    = array_merge($payload, $qrData);
                            }
                        }
                    }

                    $wasConnected = $connected;
                }
            }

            if (!empty($payload)) {
                echo "event: status\n";
                echo 'data: ' . json_encode($payload) . "\n\n";
                flush();
            } else {
                // Heartbeat to keep the connection alive.
                echo ": ping\n\n";
                flush();
            }

            sleep(2);
        }
    }

    private function authorizeAdmin(): void
    {
        abort_unless(auth()->user()?->role === 'admin', 403);
    }

    private function endpoint(string $name): ?string
    {
        $configured = config("services.whatsapp_bot.{$name}_url");

        if (filled($configured)) {
            return $configured;
        }

        $baseUrl = config('services.whatsapp_bot.base_url');

        if (blank($baseUrl)) {
            return null;
        }

        return rtrim($baseUrl, '/') . '/' . $name;
    }

    private function botRequest(string $method, ?string $url): array
    {
        if (blank($url)) {
            return [
                'ok' => false,
                'message' => 'Endpoint bot WA belum dikonfigurasi untuk fitur ini.',
            ];
        }

        $request = Http::timeout(15)->accept('*/*');
        $token = config('services.whatsapp_bot.token');

        if (filled($token)) {
            $request = $request->withToken($token);
        }

        try {
            $response = $request->{$method}($url);
        } catch (ConnectionException $exception) {
            return [
                'ok' => false,
                'message' => 'Gagal menghubungi service bot WA: ' . $exception->getMessage(),
            ];
        }

        if ($response->failed()) {
            return [
                'ok' => false,
                'message' => 'Service bot WA menolak request. Status HTTP: ' . $response->status(),
            ];
        }

        $contentType = $response->header('content-type', '');
        $body = $response->body();
        $data = str_contains($contentType, 'application/json')
            ? $response->json()
            : $body;

        return [
            'ok' => true,
            'message' => 'ok',
            'data' => $data,
            'contentType' => $contentType,
            'body' => $body,
        ];
    }

    private function normalizeStatus(mixed $data): array
    {
        $payload = is_array($data) ? $data : [];
        $status = strtolower((string) data_get($payload, 'status', data_get($payload, 'state', 'unknown')));
        $connected = (bool) (
            data_get($payload, 'connected')
            ?? data_get($payload, 'isConnected')
            ?? in_array($status, ['connected', 'ready', 'authenticated', 'open'], true)
        );

        return [
            'connected' => $connected,
            'label' => $connected ? 'Terhubung' : ($status !== 'unknown' ? ucfirst($status) : 'Belum terhubung'),
            'phone' => data_get($payload, 'phone') ?? data_get($payload, 'number') ?? data_get($payload, 'user.id'),
            'name' => data_get($payload, 'name') ?? data_get($payload, 'user.name'),
            'error' => data_get($payload, 'error'),
            'updatedAt' => data_get($payload, 'updatedAt'),
        ];
    }

    private function normalizeQr(array $result): array
    {
        $contentType = strtolower($result['contentType'] ?? '');
        $body        = (string) ($result['body'] ?? '');

        // Bot responded with a raw image (PNG/JPEG/SVG as binary).
        if (str_starts_with($contentType, 'image/')) {
            return [
                'qrImage' => 'data:' . $contentType . ';base64,' . base64_encode($body),
                'qrText'  => null,
            ];
        }

        $data = $result['data'];

        if (is_array($data)) {
            // Try common JSON image fields first.
            $imageFields = [
                'qrImage', 'qr_image', 'image', 'data.image',
                'qr_code_image', 'qrcode_image', 'qrCodeImage',
                'base64', 'data.base64',
            ];
            foreach ($imageFields as $field) {
                $imageValue = data_get($data, $field);
                if (is_string($imageValue) && $this->looksLikeImage($imageValue)) {
                    return ['qrImage' => $this->normalizeImageValue($imageValue), 'qrText' => null];
                }
            }

            // Try common QR text / data-URL fields.
            $qrFields = [
                'qr', 'qrcode', 'qrCode', 'qr_code', 'data.qr',
                'message', 'data', 'value',
            ];
            foreach ($qrFields as $field) {
                $value = data_get($data, $field);
                if (!is_string($value)) {
                    continue;
                }
                if ($this->looksLikeImage($value)) {
                    return ['qrImage' => $this->normalizeImageValue($value), 'qrText' => null];
                }
                if (filled($value)) {
                    return ['qrImage' => null, 'qrText' => $value];
                }
            }

            return ['qrImage' => null, 'qrText' => null];
        }

        // Plain string body (data-URL, base64, SVG, or raw QR text).
        $trimmed = trim($body);
        if (filled($trimmed)) {
            if ($this->looksLikeImage($trimmed)) {
                return ['qrImage' => $this->normalizeImageValue($trimmed), 'qrText' => null];
            }
            return ['qrImage' => null, 'qrText' => $trimmed];
        }

        return ['qrImage' => null, 'qrText' => null];
    }

    private function looksLikeImage(string $value): bool
    {
        return str_starts_with($value, 'data:image/')
            || str_starts_with($value, 'http://')
            || str_starts_with($value, 'https://')
            || str_starts_with($value, '<svg')
            || str_starts_with($value, 'iVBOR')   // PNG base64
            || str_starts_with($value, '/9j/')    // JPEG base64
            || str_starts_with($value, 'R0lGOD')  // GIF base64
            || str_starts_with($value, 'PHN2Zy');  // <svg> base64
    }

    private function normalizeImageValue(string $value): string
    {
        if (str_starts_with($value, 'data:image/') || str_starts_with($value, 'http')) {
            return $value;
        }

        if (str_starts_with($value, '<svg')) {
            return 'data:image/svg+xml;base64,' . base64_encode($value);
        }

        return 'data:image/png;base64,' . $value;
    }
}
