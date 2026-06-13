<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\DeliveryOrder;
use App\Models\User;
use Illuminate\Http\Client\ConnectionException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Inertia\Inertia;
use Inertia\Response;

class RincianDeliveryOrderController extends Controller
{
    public function index(): Response
    {
        $orders = $this->ordersQuery()
            ->orderBy('created_at', 'desc')
            ->get()
            ->map(fn (DeliveryOrder $order) => $this->formatOrder($order));

        return Inertia::render('RincianDO', [
            'orders' => $orders,
            'whatsappConfigured' => $this->whatsappConfigured(),
            'whatsappRecipients' => $this->whatsappRecipients(),
        ]);
    }

    public function sendToWhatsapp(Request $request, DeliveryOrder $deliveryOrder): RedirectResponse
    {
        $deliveryOrder->loadMissing(['driver', 'loadReport', 'unloadReport']);

        if (auth()->user()?->role === 'driver' && $deliveryOrder->driver_id !== auth()->id()) {
            abort(403);
        }

        if (!$this->isComplete($deliveryOrder)) {
            return back()->with('error', 'Rincian DO belum lengkap. Laporan muat dan bongkar wajib tersedia sebelum dikirim ke WA.');
        }

        $recipient = $this->resolveWhatsappRecipient($request);
        $result = $this->sendWhatsappMessage($this->buildWhatsappMessage($deliveryOrder), $recipient->nohp);

        if (!$result['ok']) {
            return back()->with('error', $result['message']);
        }

        ActivityLog::create([
            'user_id' => auth()->id(),
            'activity' => 'Kirim Rincian DO ke WA',
            'details' => 'Mengirim rincian DO #' . $deliveryOrder->nomor_do . ' ke ' . $recipient->name . ' (' . $recipient->nohp . ').',
        ]);

        return back()->with('success', 'Rincian DO #' . $deliveryOrder->nomor_do . ' berhasil dikirim ke WA ' . $recipient->name . '.');
    }

    public function sendAllCompleteToWhatsapp(Request $request): RedirectResponse
    {
        $orders = $this->ordersQuery()
            ->orderBy('created_at', 'desc')
            ->get()
            ->filter(fn (DeliveryOrder $order) => $this->isComplete($order));

        if ($orders->isEmpty()) {
            return back()->with('error', 'Belum ada rincian DO lengkap yang bisa dikirim ke WA.');
        }

        $message = $orders
            ->map(fn (DeliveryOrder $order) => $this->buildWhatsappMessage($order))
            ->implode("\n\n--------------------\n\n");

        $recipient = $this->resolveWhatsappRecipient($request);
        $result = $this->sendWhatsappMessage($message, $recipient->nohp);

        if (!$result['ok']) {
            return back()->with('error', $result['message']);
        }

        ActivityLog::create([
            'user_id' => auth()->id(),
            'activity' => 'Kirim Semua Rincian DO ke WA',
            'details' => 'Mengirim ' . $orders->count() . ' rincian DO lengkap ke ' . $recipient->name . ' (' . $recipient->nohp . ').',
        ]);

        return back()->with('success', $orders->count() . ' rincian DO lengkap berhasil dikirim ke WA ' . $recipient->name . '.');
    }

    private function ordersQuery()
    {
        $query = DeliveryOrder::with(['driver', 'loadReport', 'unloadReport']);

        if (auth()->user()?->role === 'driver') {
            $query->where('driver_id', auth()->id());
        }

        return $query;
    }

    private function formatOrder(DeliveryOrder $order): array
    {
        $selisih = $order->unloadReport?->selisih;

        return [
            'id' => $order->id,
            'driver' => $order->driver?->name,
            'nomor_unit' => $order->nomor_unit,
            'nomor_do' => $order->nomor_do,
            'uang_jalan' => (float) $order->uang_jalan,
            'created_at' => $order->created_at,
            'is_complete' => $this->isComplete($order),
            'load_report' => $order->loadReport ? [
                'load_date' => $order->loadReport->load_date,
                'bruto' => (float) $order->loadReport->bruto,
                'tara' => (float) $order->loadReport->tara,
                'netto' => (float) $order->loadReport->netto,
            ] : null,
            'unload_report' => $order->unloadReport ? [
                'unload_date' => $order->unloadReport->unload_date,
                'bruto' => (float) $order->unloadReport->bruto,
                'tara' => (float) $order->unloadReport->tara,
                'netto' => (float) $order->unloadReport->netto,
                'selisih' => $selisih !== null ? (float) $selisih : null,
                'status_selisih' => $order->unloadReport->status_selisih,
            ] : null,
        ];
    }

    private function isComplete(DeliveryOrder $order): bool
    {
        return $order->loadReport !== null && $order->unloadReport !== null;
    }

    private function buildWhatsappMessage(DeliveryOrder $order): string
    {
        $load = $order->loadReport;
        $unload = $order->unloadReport;
        $selisih = (float) $unload->selisih;

        return implode("\n", [
            '*Rincian Delivery Order*',
            'Nomor DO: ' . $order->nomor_do,
            'Driver: ' . ($order->driver?->name ?? '-'),
            'Nomor Unit: ' . $order->nomor_unit,
            'Tanggal DO: ' . optional($order->created_at)->format('d/m/Y H:i'),
            'Uang Jalan: Rp ' . number_format((float) $order->uang_jalan, 0, ',', '.'),
            '',
            '*Laporan Muat*',
            'Tanggal Muat: ' . $load->load_date,
            'Bruto: ' . number_format((float) $load->bruto, 0, ',', '.') . ' kg',
            'Tara: ' . number_format((float) $load->tara, 0, ',', '.') . ' kg',
            'Netto Muat: ' . number_format((float) $load->netto, 0, ',', '.') . ' kg',
            '',
            '*Laporan Bongkar*',
            'Tanggal Bongkar: ' . $unload->unload_date,
            'Bruto: ' . number_format((float) $unload->bruto, 0, ',', '.') . ' kg',
            'Tara: ' . number_format((float) $unload->tara, 0, ',', '.') . ' kg',
            'Netto Bongkar: ' . number_format((float) $unload->netto, 0, ',', '.') . ' kg',
            'Selisih: ' . ($selisih > 0 ? '+' : '') . number_format($selisih, 0, ',', '.') . ' kg',
            'Status: ' . strtoupper($unload->status_selisih),
        ]);
    }

    private function whatsappConfigured(): bool
    {
        return filled(config('services.whatsapp_bot.url'));
    }

    private function whatsappRecipients()
    {
        return User::query()
            ->whereNotNull('nohp')
            ->where('nohp', '!=', '')
            ->orderBy('name')
            ->get(['id', 'name', 'email', 'role', 'nohp'])
            ->map(fn (User $user) => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'nohp' => $user->nohp,
            ]);
    }

    private function resolveWhatsappRecipient(Request $request): User
    {
        $validated = $request->validate([
            'recipient_user_id' => ['required', 'integer', 'exists:users,id'],
        ], [
            'recipient_user_id.required' => 'Pilih akun penerima WA terlebih dahulu.',
            'recipient_user_id.exists' => 'Akun penerima WA tidak ditemukan.',
        ]);

        $recipient = User::findOrFail($validated['recipient_user_id']);

        if (blank($recipient->nohp)) {
            abort(422, 'Akun penerima belum memiliki nomor HP.');
        }

        return $recipient;
    }

    private function sendWhatsappMessage(string $message, string $recipientNumber): array
    {
        if (!$this->whatsappConfigured()) {
            return [
                'ok' => false,
                'message' => 'Bot WA belum dikonfigurasi. Isi WHATSAPP_BOT_URL di file .env.',
            ];
        }

        $numberField = config('services.whatsapp_bot.number_field', 'number');
        $messageField = config('services.whatsapp_bot.message_field', 'message');
        $token = config('services.whatsapp_bot.token');

        $request = Http::timeout(15)
            ->acceptJson()
            ->asJson();

        if (filled($token)) {
            $request = $request->withToken($token);
        }

        try {
            $response = $request->post(config('services.whatsapp_bot.url'), [
                $numberField => $recipientNumber,
                $messageField => $message,
            ]);
        } catch (ConnectionException $exception) {
            return [
                'ok' => false,
                'message' => 'Gagal menghubungi bot WA: ' . $exception->getMessage(),
            ];
        }

        if ($response->failed()) {
            return [
                'ok' => false,
                'message' => 'Bot WA menolak request. Status HTTP: ' . $response->status(),
            ];
        }

        return ['ok' => true, 'message' => 'ok'];
    }
}
