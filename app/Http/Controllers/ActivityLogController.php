<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use Inertia\Inertia;
use Inertia\Response;

class ActivityLogController extends Controller
{
    /**
     * Display a listing of user activities.
     */
    public function index(): Response
    {
        $logs = ActivityLog::with('user')
            ->orderBy('created_at', 'desc')
            ->get();

        return Inertia::render('ActivityLog', [
            'logs' => $logs,
        ]);
    }
}
