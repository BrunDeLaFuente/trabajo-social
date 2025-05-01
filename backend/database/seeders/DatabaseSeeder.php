<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Crear usuario administrador
        User::create([
            'name' => 'Admin User',
            'email' => 'admin@example.com',
            'password' => Hash::make('admin1234'),
            'celular_user' => '7777777',
            'is_admin' => true,
            'last_login_at' => Carbon::now(),
            'current_session_token' => null,
        ]);

        // Crear usuario regular
        User::create([
            'name' => 'Test User',
            'email' => 'user@example.com',
            'password' => Hash::make('user1234'),
            'celular_user' => '7222222',
            'is_admin' => false,
            'last_login_at' => null,
            'current_session_token' => null,
        ]);
    }
}
