<?php

namespace App\Http\Controllers;

use App\Models\ActivityLog;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;

class UserController extends Controller
{
    public function index(): Response
    {
        $users = User::orderBy('name')->get(['id', 'name', 'email', 'nohp', 'role', 'created_at']);

        return Inertia::render('Users/Index', [
            'users' => $users,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name'     => ['required', 'string', 'max:255'],
            'email'    => ['required', 'email', 'max:255', Rule::unique('users', 'email')],
            'nohp'     => ['nullable', 'string', 'max:30'],
            'password' => ['required', 'string', 'min:8'],
            'role'     => ['required', Rule::in(['admin', 'driver', 'finance'])],
        ], [
            'name.required'     => 'Nama wajib diisi.',
            'email.required'    => 'Email wajib diisi.',
            'email.email'       => 'Format email tidak valid.',
            'email.unique'      => 'Email sudah digunakan.',
            'nohp.max'          => 'Nomor HP maksimal 30 karakter.',
            'password.required' => 'Password wajib diisi.',
            'password.min'      => 'Password minimal 8 karakter.',
            'role.required'     => 'Role wajib dipilih.',
            'role.in'           => 'Role tidak valid.',
        ]);

        $user = User::create([
            'name'     => $validated['name'],
            'email'    => $validated['email'],
            'nohp'     => $validated['nohp'] ?? null,
            'password' => Hash::make($validated['password']),
            'role'     => $validated['role'],
        ]);

        ActivityLog::create([
            'user_id'  => auth()->id(),
            'activity' => 'Tambah User',
            'details'  => 'Menambahkan user baru: ' . $user->name . ' (' . $user->role . ')',
        ]);

        return back()->with('success', "User {$user->name} berhasil ditambahkan!");
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->id === auth()->id()) {
            return back()->with('error', 'Anda tidak bisa menghapus akun sendiri.');
        }

        $name = $user->name;
        $user->delete();

        ActivityLog::create([
            'user_id'  => auth()->id(),
            'activity' => 'Hapus User',
            'details'  => 'Menghapus user: ' . $name,
        ]);

        return back()->with('success', "User {$name} berhasil dihapus.");
    }
}
