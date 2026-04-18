<?php

namespace Database\Factories;

use App\Models\Listing;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Listing>
 */
class ListingFactory extends Factory
{
    protected $model = Listing::class;

    public function definition(): array
    {
        $type = fake()->randomElement(['vente', 'don', 'echange']);

        return [
            'user_id' => User::factory(),
            'title' => fake()->sentence(4),
            'description' => fake()->paragraph(3),
            'type' => $type,
            'price' => $type === 'vente' ? fake()->randomFloat(2, 1, 500) : null,
            'status' => 'publiee',
            'views_count' => fake()->numberBetween(0, 200),
        ];
    }

    /**
     * Set as draft (awaiting moderation).
     */
    public function draft(): static
    {
        return $this->state(fn (array $attributes) => [
            'status' => 'draft',
        ]);
    }

    /**
     * Set as a sale listing.
     */
    public function vente(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'vente',
            'price' => fake()->randomFloat(2, 5, 300),
        ]);
    }

    /**
     * Set as a donation listing.
     */
    public function don(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'don',
            'price' => null,
        ]);
    }

    /**
     * Set as an exchange listing.
     */
    public function echange(): static
    {
        return $this->state(fn (array $attributes) => [
            'type' => 'echange',
            'price' => null,
        ]);
    }
}
