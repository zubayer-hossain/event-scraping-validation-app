<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = User::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'name' => $this->faker->name,
            'email' => $this->faker->unique()->safeEmail,
            'password' => Hash::make('password'), // Default password
            'email_verified_at' => now(),
            'remember_token' => Str::random(10),
            'role' => 'client', // Default role
            'status' => true,
        ];
    }

    /**
     * Indicate that the user is an author.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function author()
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => 'author',
            ];
        });
    }

    /**
     * Indicate that the user is a client.
     *
     * @return \Illuminate\Database\Eloquent\Factories\Factory
     */
    public function client()
    {
        return $this->state(function (array $attributes) {
            return [
                'role' => 'client',
            ];
        });
    }
}
