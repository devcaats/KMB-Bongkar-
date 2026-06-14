<?php

namespace App\Services;

use Illuminate\Http\Client\ConnectionException;
use Illuminate\Support\Facades\Http;

class WhatsappBotService
{
    public function failoverEnabled(): bool
    {
        return filter_var(config('services.whatsapp_bot.failover_enabled', false), FILTER_VALIDATE_BOOLEAN);
    }

    public function hasBaseUrl(): bool
    {
        return filled(config('services.whatsapp_bot.base_url'))
            || ($this->failoverEnabled() && filled(config('services.whatsapp_bot.secondary_base_url')));
    }

    public function hasSecondaryBaseUrl(): bool
    {
        return filled(config('services.whatsapp_bot.secondary_base_url'));
    }

    public function hasSecondarySendEndpoint(): bool
    {
        return filled(config('services.whatsapp_bot.secondary_url'));
    }

    public function configuredServerCount(): int
    {
        $primaryConfigured = filled(config('services.whatsapp_bot.base_url'))
            || filled(config('services.whatsapp_bot.url'));

        $secondaryConfigured = filled(config('services.whatsapp_bot.secondary_base_url'))
            || filled(config('services.whatsapp_bot.secondary_url'));

        return (int) $primaryConfigured + (int) $secondaryConfigured;
    }

    public function hasEndpoint(string $name): bool
    {
        return ! empty($this->endpointCandidates($name));
    }

    public function hasSendEndpoint(): bool
    {
        return ! empty($this->sendCandidates());
    }

    public function primaryEndpointUrl(string $name): ?string
    {
        return $this->buildEndpointUrl('primary', $name);
    }

    public function firstEndpointUrl(string $name): ?string
    {
        return $this->endpointCandidates($name)[0]['url'] ?? null;
    }

    public function endpointCandidates(string $name): array
    {
        return $this->candidates(fn (string $server) => $this->buildEndpointUrl($server, $name));
    }

    public function sendCandidates(): array
    {
        return $this->candidates(fn (string $server) => $this->configValue($server, 'url'));
    }

    public function getEndpoint(string $name): array
    {
        return $this->request('get', $this->endpointCandidates($name));
    }

    public function postEndpoint(string $name, array $payload = []): array
    {
        return $this->request('post', $this->endpointCandidates($name), $payload);
    }

    public function sendMessage(string $message, string $recipientNumber): array
    {
        if (! $this->hasSendEndpoint()) {
            return [
                'ok' => false,
                'message' => 'Bot WA belum dikonfigurasi. Isi WHATSAPP_BOT_URL di file .env.',
            ];
        }

        $numberField = config('services.whatsapp_bot.number_field', 'number');
        $messageField = config('services.whatsapp_bot.message_field', 'message');

        return $this->request('post', $this->sendCandidates(), [
            $numberField => $recipientNumber,
            $messageField => $message,
        ], asJson: true);
    }

    private function request(string $method, array $candidates, array $payload = [], bool $asJson = false): array
    {
        if (empty($candidates)) {
            return [
                'ok' => false,
                'message' => 'Endpoint bot WA belum dikonfigurasi untuk fitur ini.',
            ];
        }

        $failures = [];

        foreach ($candidates as $candidate) {
            $request = Http::timeout(15);
            $request = $asJson ? $request->acceptJson()->asJson() : $request->accept('*/*');

            if (filled($candidate['token'])) {
                $request = $request->withToken($candidate['token']);
            }

            try {
                $response = $method === 'get'
                    ? $request->get($candidate['url'])
                    : $request->post($candidate['url'], $payload);
            } catch (ConnectionException $exception) {
                $failures[] = [
                    'server' => $candidate['server'],
                    'label' => $candidate['label'],
                    'message' => 'Gagal menghubungi bot WA: '.$exception->getMessage(),
                ];

                continue;
            }

            if ($response->failed()) {
                $failures[] = [
                    'server' => $candidate['server'],
                    'label' => $candidate['label'],
                    'message' => 'Bot WA menolak request. Status HTTP: '.$response->status(),
                ];

                continue;
            }

            $contentType = $response->header('content-type', '');
            $body = $response->body();
            $data = str_contains(strtolower($contentType), 'application/json')
                ? $response->json()
                : $body;

            return [
                'ok' => true,
                'message' => 'ok',
                'data' => $data,
                'contentType' => $contentType,
                'body' => $body,
                'server' => $candidate['server'],
                'serverLabel' => $candidate['label'],
            ];
        }

        return [
            'ok' => false,
            'message' => $this->failureMessage($failures),
            'attempts' => $failures,
        ];
    }

    private function failureMessage(array $failures): string
    {
        if (count($failures) === 1) {
            return $failures[0]['message'];
        }

        $messages = collect($failures)
            ->map(fn (array $failure) => $failure['label'].': '.$failure['message'])
            ->implode(' | ');

        return 'Semua server bot WA gagal. '.$messages;
    }

    private function candidates(callable $urlResolver): array
    {
        $servers = ['primary'];

        if ($this->failoverEnabled()) {
            $servers[] = 'secondary';
        }

        $candidates = [];

        foreach ($servers as $server) {
            $url = $urlResolver($server);

            if (blank($url)) {
                continue;
            }

            $candidates[] = [
                'server' => $server,
                'label' => $server === 'primary' ? 'server utama' : 'server cadangan',
                'url' => $url,
                'token' => $this->token($server),
            ];
        }

        return collect($candidates)
            ->unique('url')
            ->values()
            ->all();
    }

    private function buildEndpointUrl(string $server, string $name): ?string
    {
        $configured = $this->configValue($server, "{$name}_url");

        if (filled($configured)) {
            return $configured;
        }

        $baseUrl = $this->configValue($server, 'base_url');

        if (blank($baseUrl)) {
            return null;
        }

        return rtrim($baseUrl, '/').'/'.$name;
    }

    private function configValue(string $server, string $key): mixed
    {
        $prefix = $server === 'secondary' ? 'secondary_' : '';

        return config("services.whatsapp_bot.{$prefix}{$key}");
    }

    private function token(string $server): mixed
    {
        if ($server === 'secondary' && filled(config('services.whatsapp_bot.secondary_token'))) {
            return config('services.whatsapp_bot.secondary_token');
        }

        return config('services.whatsapp_bot.token');
    }
}
