<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Test User',
            'email' => 'test@example.com',
            'nohp' => '6281234567800',
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Budi Santoso (Driver)',
            'email' => 'budi.driver@example.com',
            'nohp' => '6281234567801',
            'role' => 'driver',
        ]);

        User::factory()->create([
            'name' => 'Joko Susilo (Driver)',
            'email' => 'joko.driver@example.com',
            'nohp' => '6281234567802',
            'role' => 'driver',
        ]);

        User::factory()->create([
            'name' => 'Andi Wijaya (Driver)',
            'email' => 'andi.driver@example.com',
            'nohp' => '6281234567803',
            'role' => 'driver',
        ]);
    }
}
