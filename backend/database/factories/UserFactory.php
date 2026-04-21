<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

/**
 * @extends Factory<User>
 */
class UserFactory extends Factory
{
    protected static ?string $password;

    public function definition(): array
    {
        return [
            'name' => fake()->name(),
            'email' => fake()->unique()->safeEmail(),
            'email_verified_at' => now(),
            'password' => static::$password ??= Hash::make('password'),
            'role' => 'membre',
            'student_id' => 'ETU' . fake()->unique()->numerify('######'),
            'is_active' => true,
            'ban_until' => null,
            'remember_token' => Str::random(10),
        ];
    }

    /**
     * Set user as moderator.
     */
    public function moderator(): static
    {
        return $this->state(fn (array $attributes) => [
            'role' => 'moderateur',
        ]);
    }

    /**
     * Set user as banned.
     */
    public function banned(): static
    {
        return $this->state(fn (array $attributes) => [
            'is_active' => false,
            'ban_until' => now()->addDays(7),
        ]);
    }

    /**
     * Indicate that the model's email address should be unverified.
     */
    public function unverified(): static
    {
        return $this->state(fn (array $attributes) => [
            'email_verified_at' => null,
        ]);
    }
}
