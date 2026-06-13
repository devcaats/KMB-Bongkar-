<?php

namespace App\Http\Controllers;

use App\Models\User;
use App\Models\DeliveryOrder;
use App\Models\ActivityLog;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\RedirectResponse;

class DeliveryOrderController extends Controller
{
    /**
     * Display the Delivery Order creation page.
     */
    public function index(): Response
    {
        $drivers = User::where('role', 'driver')->orderBy('name')->get(['id', 'name']);
        
        $deliveryOrders = DeliveryOrder::with('driver')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('PembuatanDO', [
            'drivers' => $drivers,
            'deliveryOrders' => $deliveryOrders,
        ]);
    }

    /**
     * Store multiple Delivery Orders in a single transaction.
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'items' => 'required|array|min:1',
            'items.*.driver_id' => 'required|exists:users,id',
            'items.*.nomor_unit' => 'required|string|max:255',
            'items.*.nomor_do' => 'required|string|max:255',
            'items.*.uang_jalan' => 'required|numeric|min:0',
        ], [
            'items.required' => 'Minimal harus ada satu data DO.',
            'items.array' => 'Data DO tidak valid.',
            'items.min' => 'Minimal harus ada satu data DO.',
            'items.*.driver_id.required' => 'Nama driver wajib diisi.',
            'items.*.driver_id.exists' => 'Driver tidak ditemukan.',
            'items.*.nomor_unit.required' => 'Nomor unit wajib diisi.',
            'items.*.nomor_do.required' => 'Nomor DO wajib diisi.',
            'items.*.uang_jalan.required' => 'Uang jalan wajib diisi.',
            'items.*.uang_jalan.numeric' => 'Uang jalan harus berupa angka.',
            'items.*.uang_jalan.min' => 'Uang jalan tidak boleh kurang dari 0.',
        ]);

        DB::transaction(function () use ($validated) {
            foreach ($validated['items'] as $item) {
                DeliveryOrder::create([
                    'driver_id' => $item['driver_id'],
                    'nomor_unit' => $item['nomor_unit'],
                    'nomor_do' => $item['nomor_do'],
                    'uang_jalan' => $item['uang_jalan'],
                ]);
            }

            // Record user activity log
            $count = count($validated['items']);
            ActivityLog::create([
                'user_id' => auth()->id(),
                'activity' => 'Pembuatan DO',
                'details' => 'Menambahkan ' . $count . ' data Delivery Order baru.',
            ]);
        });

        return redirect()->back()->with('success', 'Semua data DO berhasil disimpan.');
    }
}
