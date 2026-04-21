<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Listing;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class BonusFeaturesTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test 1: L'indicateur de présence (middleware UpdateLastSeen)
     */
    public function test_last_seen_at_is_updated_on_authenticated_request(): void
    {
        $user = User::factory()->create(['last_seen_at' => null]);

        // Appel d'une route authentifiée (profil)
        $response = $this->actingAs($user)->getJson('/api/auth/me');
        $response->assertStatus(200);

        // Vérification que le champ a été mis à jour
        $this->assertNotNull($user->fresh()->last_seen_at);
    }

    /**
     * Test 2: Suggestion Anti-Doublon à la création d'annonce
     */
    public function test_duplicate_suggestion_prevents_creation_and_returns_409(): void
    {
        $user = User::factory()->create();

        // 1. L'utilisateur crée une première annonce
        Listing::factory()->create([
            'user_id' => $user->id,
            'title' => 'Livre de Mathématiques Avancées',
            'type' => 'vente',
            'price' => 20,
        ]);

        // 2. L'utilisateur essaie de recréer une annonce au titre très similaire
        $response = $this->actingAs($user)->postJson('/api/listings', [
            'title' => 'Livre de Mathématiques d\'occasion',
            'description' => 'Un super livre de maths',
            'type' => 'vente',
            'price' => 15,
        ]);

        // Vérification de l'anti-doublon !
        $response->assertStatus(409)
                 ->assertJsonFragment([
                     'message' => 'Vous avez peut-être déjà posté cet article.',
                 ]);
                 
        // 3. Forcer la création
        $responseForce = $this->actingAs($user)->postJson('/api/listings', [
            'title' => 'Livre de Mathématiques d\'occasion',
            'description' => 'Un super livre de maths',
            'type' => 'vente',
            'price' => 15,
            'force_create' => true,
        ]);
        
        $responseForce->assertStatus(201);
    }

    /**
     * Test 3: Historique des modifications de prix via l'Observer
     */
    public function test_price_history_is_recorded_when_listing_price_changes(): void
    {
        $user = User::factory()->create();
        $listing = Listing::factory()->create([
            'user_id' => $user->id,
            'type' => 'vente',
            'price' => 50,
        ]);

        // On modifie le prix
        $response = $this->actingAs($user)->putJson("/api/listings/{$listing->id}", [
            'title' => $listing->title,
            'description' => $listing->description,
            'type' => $listing->type,
            'price' => 40, // Nouveau prix !
        ]);

        $response->assertStatus(200);

        // On vérifie l'historique en DB
        $this->assertDatabaseHas('listing_price_histories', [
            'listing_id' => $listing->id,
            'old_price' => 50,
            'new_price' => 40,
        ]);
        
        // On vérifie que ça remonte bien lors de l'appel 'show'
        $responseShow = $this->getJson("/api/listings/{$listing->id}");
        $responseShow->assertStatus(200);
        $this->assertCount(1, $responseShow->json('listing.price_histories'));
    }

    /**
     * Test 4: Statistiques Vendeur via le profil User
     */
    public function test_user_profile_returns_seller_statistics(): void
    {
        $user = User::factory()->create();
        
        // 2 annonces publiées, 1 vendue
        Listing::factory()->count(2)->create(['user_id' => $user->id, 'status' => 'publiee']);
        Listing::factory()->count(1)->create(['user_id' => $user->id, 'status' => 'vendue']);

        $response = $this->getJson("/api/users/{$user->id}");

        $response->assertStatus(200)
                 ->assertJsonPath('stats.published_listings_count', 2)
                 ->assertJsonPath('stats.sold_listings_count', 1);
    }

    /**
     * Test 5: Filtrage des annonces par catégories
     */
    public function test_listings_can_be_filtered_by_categories(): void
    {
        // Création des catégories
        $catElectro = Category::create(['name' => 'Electronique', 'slug' => 'electro']);
        $catLivres = Category::create(['name' => 'Livres', 'slug' => 'livres']);

        // Création d'annonces
        $listing1 = Listing::factory()->create(['status' => 'publiee']);
        $listing1->categories()->attach($catElectro->id);

        $listing2 = Listing::factory()->create(['status' => 'publiee']);
        $listing2->categories()->attach($catLivres->id);

        // Filtrage par 'electro'
        $response = $this->getJson('/api/listings?categories=electro');

        $response->assertStatus(200);
        $this->assertCount(1, $response->json('data'));
        $this->assertEquals($listing1->id, $response->json('data.0.id'));
    }
}
