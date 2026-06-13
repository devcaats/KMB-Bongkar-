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
            'role' => 'admin',
        ]);

        User::factory()->create([
            'name' => 'Budi Santoso (Driver)',
            'email' => 'budi.driver@example.com',
            'role' => 'driver',
        ]);

        User::factory()->create([
            'name' => 'Joko Susilo (Driver)',
            'email' => 'joko.driver@example.com',
            'role' => 'driver',
        ]);

        User::factory()->create([
            'name' => 'Andi Wijaya (Driver)',
            'email' => 'andi.driver@example.com',
            'role' => 'driver',
        ]);
    }
}
