<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        // Create two authors
        User::factory()->author()->count(2)->create();

        // Create five clients
        User::factory()->client()->count(5)->create();
    }
}
