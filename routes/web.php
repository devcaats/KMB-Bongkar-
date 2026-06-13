<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\DeliveryOrderController;
use App\Http\Controllers\ActivityLogController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if (auth()->check()) {
        $startOfThisMonth = now()->startOfMonth();
        $startOfLastMonth = now()->subMonth()->startOfMonth();
        $endOfLastMonth = now()->subMonth()->endOfMonth();

        $countThisMonth = \App\Models\DeliveryOrder::where('created_at', '>=', $startOfThisMonth)->count();
        $countLastMonth = \App\Models\DeliveryOrder::whereBetween('created_at', [$startOfLastMonth, $endOfLastMonth])->count();

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

        return Inertia::render('Dashboard', [
            'metrics' => [
                'do_count_this_month' => $countThisMonth,
                'do_percentage_change' => $percentageChange,
                'do_percentage_direction' => $direction,
            ]
        ]);
    }
    return Inertia::render('Welcome', [
        'canLogin'       => Route::has('login'),
        'canRegister'    => Route::has('register'),
        'laravelVersion' => Illuminate\Foundation\Application::VERSION,
        'phpVersion'     => PHP_VERSION,
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

    Route::get('/log-aktivitas', [ActivityLogController::class, 'index'])->name('log-aktivitas.index');
});

Route::redirect('/dashboard', '/');

// 404 fallback
Route::fallback(function () {
    return Inertia::render('Errors/NotFound')->toResponse(request())->setStatusCode(404);
});

require __DIR__ . '/auth.php';
