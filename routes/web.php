<?php

use App\Http\Controllers\ActivityLogController;
use App\Http\Controllers\DeliveryOrderController;
use App\Http\Controllers\DriverController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RincianDeliveryOrderController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\WhatsappBotController;
use App\Models\DeliveryOrder;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        $user = auth()->user();

        $buildDoStatistics = function ($driverId = null) {
            $ordersQuery = DeliveryOrder::with([
                'loadReport:id,delivery_order_id,netto',
                'unloadReport:id,delivery_order_id,netto,selisih',
            ])->orderBy('created_at');

            if ($driverId) {
                $ordersQuery->where('driver_id', $driverId);
            }

            $statsByDate = [];

            foreach ($ordersQuery->get(['id', 'nomor_do', 'created_at']) as $order) {
                $date = $order->created_at
                    ? $order->created_at->toDateString()
                    : now()->toDateString();

                if (!isset($statsByDate[$date])) {
                    $statsByDate[$date] = [
                        'tanggal'       => $date,
                        'netto_muat'    => 0,
                        'netto_bongkar' => 0,
                        'susut'         => 0,
                        'surplus'       => 0,
                        'selisih'       => null,
                        'status'        => null,
                        'nomor_do'      => [],
                        'has_muat'      => false,
                        'has_bongkar'   => false,
                    ];
                }

                $statsByDate[$date]['nomor_do'][] = $order->nomor_do;

                if ($order->loadReport) {
                    $statsByDate[$date]['has_muat'] = true;
                    $statsByDate[$date]['netto_muat'] += (float) $order->loadReport->netto;
                }

                if ($order->unloadReport) {
                    $statsByDate[$date]['has_bongkar'] = true;
                    $statsByDate[$date]['netto_bongkar'] += (float) $order->unloadReport->netto;

                    $selisih = (float) $order->unloadReport->selisih;
                    if ($selisih > 0) {
                        $statsByDate[$date]['surplus'] += $selisih;
                    } elseif ($selisih < 0) {
                        $statsByDate[$date]['susut'] += abs($selisih);
                    }
                }
            }

            return collect($statsByDate)
                ->map(function ($row) {
                    $row['netto_muat'] = $row['has_muat'] ? $row['netto_muat'] : null;
                    $row['netto_bongkar'] = $row['has_bongkar'] ? $row['netto_bongkar'] : null;

                    if ($row['has_bongkar']) {
                        $row['selisih'] = $row['surplus'] - $row['susut'];
                        $row['status'] = $row['selisih'] > 0
                            ? 'surplus'
                            : ($row['selisih'] < 0 ? 'susut' : 'pas');
                    }

                    unset($row['has_muat'], $row['has_bongkar']);

                    return $row;
                })
                ->sortBy('tanggal')
                ->values();
        };

        $buildStatisticsChart = function ($stats) {
            return [
                'categories' => $stats->pluck('tanggal')->values(),
                'netto_muat' => $stats->pluck('netto_muat')->map(fn ($value) => $value ?? 0)->values(),
                'netto_bongkar' => $stats->pluck('netto_bongkar')->map(fn ($value) => $value ?? 0)->values(),
                'susut' => $stats->pluck('susut')->values(),
                'surplus' => $stats->pluck('surplus')->values(),
            ];
        };

        if ($user->role === 'driver') {
            $driverId = $user->id;

            $logs = \App\Models\ActivityLog::where('user_id', $driverId)
                ->orderBy('created_at', 'desc')
                ->take(5)
                ->get();

            $stats = $buildDoStatistics($driverId);

            return Inertia::render('Dashboard', [
                'recent_logs'      => $logs,
                'driver_stats'     => $stats->sortByDesc('tanggal')->values(),
                'statistics_chart' => $buildStatisticsChart($stats),
            ]);
        }

        $startOfThisMonth = now()->startOfMonth();
        $startOfLastMonth = now()->subMonth()->startOfMonth();
        $endOfLastMonth = now()->subMonth()->endOfMonth();

        $countThisMonth = DeliveryOrder::where('created_at', '>=', $startOfThisMonth)->count();
        $countLastMonth = DeliveryOrder::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();

        $percentageChange = 0;
        $direction = 'up';

        if ($countLastMonth > 0) {
            $diff = $countThisMonth - $countLastMonth;
            $percentageChange = round(abs(($diff / $countLastMonth) * 100), 2);
            $direction = $diff >= 0 ? 'up' : 'down';
        } else {
            $percentageChange = $countThisMonth > 0 ? 100 : 0;
            $direction = 'up';
        }

        $stats = $buildDoStatistics();

        return Inertia::render('Dashboard', [
            'metrics' => [
                'do_count_this_month' => $countThisMonth,
                'do_percentage_change' => $percentageChange,
                'do_percentage_direction' => $direction,
            ],
            'statistics_chart' => $buildStatisticsChart($stats),
        ]);
    }

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
    Route::get('/saas', function () {
        return Inertia::render('Saas');
    })->name('saas');
    Route::get('/data-tables', function () {
        return Inertia::render('DataTables');
    })->name('data-tables');

    Route::get('/pembuatan-do', [DeliveryOrderController::class, 'index'])->name('pembuatan-do.index');
    Route::post('/pembuatan-do', [DeliveryOrderController::class, 'store'])->name('pembuatan-do.store');

    Route::get('/rincian-do', [RincianDeliveryOrderController::class, 'index'])->name('rincian-do.index');
    Route::post('/rincian-do/kirim-semua-wa', [RincianDeliveryOrderController::class, 'sendAllCompleteToWhatsapp'])->name('rincian-do.whatsapp.all');
    Route::post('/rincian-do/{deliveryOrder}/kirim-wa', [RincianDeliveryOrderController::class, 'sendToWhatsapp'])->name('rincian-do.whatsapp');

    Route::get('/wa-bot', [WhatsappBotController::class, 'index'])->name('wa-bot.index');
    Route::get('/wa-bot/status', [WhatsappBotController::class, 'status'])->name('wa-bot.status');
    Route::get('/wa-bot/qr', [WhatsappBotController::class, 'qr'])->name('wa-bot.qr');
    Route::get('/wa-bot/events', [WhatsappBotController::class, 'events'])->name('wa-bot.events');
    Route::post('/wa-bot/restart', [WhatsappBotController::class, 'restart'])->name('wa-bot.restart');
    Route::post('/wa-bot/logout', [WhatsappBotController::class, 'logout'])->name('wa-bot.logout');

    Route::get('/log-aktivitas', [ActivityLogController::class, 'index'])->name('log-aktivitas.index');

    // User management
    Route::get('/users', [UserController::class, 'index'])->name('users.index');
    Route::post('/users', [UserController::class, 'store'])->name('users.store');
    Route::delete('/users/{user}', [UserController::class, 'destroy'])->name('users.destroy');

    // Driver reporting routes
    Route::get('/laporan-muat', [DriverController::class, 'laporanMuat'])->name('driver.muat');
    Route::post('/laporan-muat', [DriverController::class, 'storeLaporanMuat'])->name('driver.muat.store');
    Route::post('/laporan-muat/{loadReport}', [DriverController::class, 'updateLaporanMuat'])->name('driver.muat.update');
    Route::delete('/laporan-muat/{loadReport}', [DriverController::class, 'destroyLaporanMuat'])->name('driver.muat.destroy');
    Route::get('/laporan-bongkar', [DriverController::class, 'laporanBongkar'])->name('driver.bongkar');
    Route::post('/laporan-bongkar', [DriverController::class, 'storeLaporanBongkar'])->name('driver.bongkar.store');
    Route::post('/laporan-bongkar/{unloadReport}', [DriverController::class, 'updateLaporanBongkar'])->name('driver.bongkar.update');
    Route::delete('/laporan-bongkar/{unloadReport}', [DriverController::class, 'destroyLaporanBongkar'])->name('driver.bongkar.destroy');
    Route::get('/maintenance-unit', [DriverController::class, 'maintenanceUnit'])->name('driver.maintenance');
    Route::post('/maintenance-unit', [DriverController::class, 'storeMaintenanceUnit'])->name('driver.maintenance.store');
});

Route::redirect('/dashboard', '/');

if (app()->environment('local')) {
    Route::get('/preview-500', function () {
        return Inertia::render('Errors/ServerError')
            ->toResponse(request())
            ->setStatusCode(500);
    })->name('preview.500');
}

// 404 fallback
Route::fallback(function () {
    return Inertia::render('Errors/NotFound')->toResponse(request())->setStatusCode(404);
});

require __DIR__.'/auth.php';
