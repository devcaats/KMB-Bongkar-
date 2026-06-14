<?php

namespace Tests\Unit;

use App\Services\WhatsappBotService;
use Illuminate\Http\Client\Request;
use Illuminate\Support\Facades\Http;
use Tests\TestCase;

class WhatsappBotServiceTest extends TestCase
{
    public function test_failover_disabled_only_uses_primary_server(): void
    {
        config([
            'services.whatsapp_bot.failover_enabled' => 'false',
            'services.whatsapp_bot.base_url' => 'https://primary.example',
            'services.whatsapp_bot.secondary_base_url' => 'https://secondary.example',
        ]);

        Http::fake([
            'https://primary.example/status' => Http::response(['status' => 'connected'], 200),
            'https://secondary.example/status' => Http::response(['status' => 'connected'], 200),
        ]);

        $result = app(WhatsappBotService::class)->getEndpoint('status');

        $this->assertTrue($result['ok']);
        $this->assertSame('primary', $result['server']);

        Http::assertSentCount(1);
        Http::assertSent(fn (Request $request) => $request->url() === 'https://primary.example/status');
        Http::assertNotSent(fn (Request $request) => $request->url() === 'https://secondary.example/status');
    }

    public function test_failover_enabled_uses_secondary_when_primary_fails(): void
    {
        config([
            'services.whatsapp_bot.failover_enabled' => true,
            'services.whatsapp_bot.base_url' => 'https://primary.example',
            'services.whatsapp_bot.secondary_base_url' => 'https://secondary.example',
        ]);

        Http::fake([
            'https://primary.example/status' => Http::response(['ok' => false], 500),
            'https://secondary.example/status' => Http::response(['status' => 'connected'], 200),
        ]);

        $result = app(WhatsappBotService::class)->getEndpoint('status');

        $this->assertTrue($result['ok']);
        $this->assertSame('secondary', $result['server']);
        $this->assertSame(['status' => 'connected'], $result['data']);

        Http::assertSentCount(2);
        Http::assertSent(fn (Request $request) => $request->url() === 'https://primary.example/status');
        Http::assertSent(fn (Request $request) => $request->url() === 'https://secondary.example/status');
    }

    public function test_send_message_uses_secondary_send_endpoint_after_primary_failure(): void
    {
        config([
            'services.whatsapp_bot.failover_enabled' => true,
            'services.whatsapp_bot.url' => 'https://primary.example/send',
            'services.whatsapp_bot.secondary_url' => 'https://secondary.example/send',
            'services.whatsapp_bot.number_field' => 'number',
            'services.whatsapp_bot.message_field' => 'message',
        ]);

        Http::fake([
            'https://primary.example/send' => Http::response(['ok' => false], 500),
            'https://secondary.example/send' => Http::response(['ok' => true], 200),
        ]);

        $result = app(WhatsappBotService::class)->sendMessage('Halo', '628123456789');

        $this->assertTrue($result['ok']);
        $this->assertSame('secondary', $result['server']);

        Http::assertSent(fn (Request $request) => $request->url() === 'https://secondary.example/send'
            && $request['number'] === '628123456789'
            && $request['message'] === 'Halo');
    }
}
