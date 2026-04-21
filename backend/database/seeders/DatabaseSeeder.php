<?php

namespace Database\Seeders;

use App\Models\Conversation;
use App\Models\Favorite;
use App\Models\Listing;
use App\Models\Message;
use App\Models\Report;
use App\Models\User;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database with realistic test data.
     */
    public function run(): void
    {
        // ── 1. Create moderator ──
        $moderator = User::factory()->moderator()->create([
            'name' => 'Modérateur CampusShop',
            'email' => 'moderateur@campus.edu',
            'password' => bcrypt('password'),
        ]);

        // ── 2. Create 10 regular members ──
        $members = User::factory(10)->create();

        // Add a known test user
        $testUser = User::factory()->create([
            'name' => 'Jean Dupont',
            'email' => 'jean@campus.edu',
            'password' => bcrypt('password'),
        ]);

        $allMembers = $members->push($testUser);

        // ── 3. Create listings ──
        $listings = collect();

        // 15 published listings
        foreach ($allMembers->random(8) as $member) {
            $count = rand(1, 3);
            for ($i = 0; $i < $count; $i++) {
                $listings->push(
                    Listing::factory()
                        ->for($member)
                        ->create()
                );
            }
        }

        // 5 draft listings (awaiting moderation)
        foreach ($allMembers->random(3) as $member) {
            $listings->push(
                Listing::factory()
                    ->draft()
                    ->for($member)
                    ->create()
            );
        }

        // 2 vente, 2 don, 1 échange for the test user
        $listings->push(Listing::factory()->vente()->for($testUser)->create(['title' => 'Manuel de Mathématiques L2']));
        $listings->push(Listing::factory()->vente()->for($testUser)->create(['title' => 'Calculatrice TI-83']));
        $listings->push(Listing::factory()->don()->for($testUser)->create(['title' => 'Cahiers de cours (lot)']));
        $listings->push(Listing::factory()->don()->for($testUser)->create(['title' => 'Stylos et fournitures']));
        $listings->push(Listing::factory()->echange()->for($testUser)->create(['title' => 'Échange livre Physique contre Chimie']));

        $publishedListings = $listings->where('status', 'publiee');

        // ── 4. Create conversations and messages ──
        foreach ($publishedListings->random(min(8, $publishedListings->count())) as $listing) {
            $buyer = $allMembers->where('id', '!=', $listing->user_id)->random();

            $conversation = Conversation::create([
                'listing_id' => $listing->id,
                'buyer_id' => $buyer->id,
                'seller_id' => $listing->user_id,
                'last_message_at' => now()->subMinutes(rand(1, 1440)),
            ]);

            // Add 2-5 messages per conversation
            $messageCount = rand(2, 5);
            for ($i = 0; $i < $messageCount; $i++) {
                $sender = $i % 2 === 0 ? $buyer : User::find($listing->user_id);
                Message::create([
                    'conversation_id' => $conversation->id,
                    'sender_id' => $sender->id,
                    'body' => fake()->sentence(rand(5, 20)),
                    'read_at' => $i < $messageCount - 1 ? now()->subMinutes(rand(1, 60)) : null,
                    'created_at' => now()->subMinutes(($messageCount - $i) * 10),
                ]);
            }
        }

        // ── 5. Create favorites ──
        foreach ($allMembers->random(6) as $member) {
            $favListings = $publishedListings
                ->where('user_id', '!=', $member->id)
                ->random(min(3, $publishedListings->where('user_id', '!=', $member->id)->count()));

            foreach ($favListings as $listing) {
                Favorite::firstOrCreate([
                    'user_id' => $member->id,
                    'listing_id' => $listing->id,
                ]);
            }
        }

        // ── 6. Create a few reports ──
        $reportedListings = $publishedListings->random(min(3, $publishedListings->count()));
        foreach ($reportedListings as $listing) {
            $reporter = $allMembers->where('id', '!=', $listing->user_id)->random();
            Report::firstOrCreate(
                [
                    'reporter_id' => $reporter->id,
                    'listing_id' => $listing->id,
                ],
                [
                    'reason' => fake()->randomElement([
                        'Contenu inapproprié',
                        'Annonce en doublon',
                        'Prix abusif',
                        'Article interdit',
                        'Description trompeuse',
                    ]),
                    'status' => 'pending',
                ]
            );
        }

        // ── Summary ──
        $this->command->info('✅ Seeding complete:');
        $this->command->info("   - 1 moderator (moderateur@campus.edu / password)");
        $this->command->info("   - 1 test user (jean@campus.edu / password)");
        $this->command->info("   - 10 random members");
        $this->command->info("   - " . $listings->count() . " listings");
        $this->command->info("   - " . Conversation::count() . " conversations");
        $this->command->info("   - " . Message::count() . " messages");
        $this->command->info("   - " . Favorite::count() . " favorites");
        $this->command->info("   - " . Report::count() . " reports");
    }
}
