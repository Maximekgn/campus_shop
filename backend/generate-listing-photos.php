<?php
/**
 * Script pour générer des photos de test pour les annonces
 * Lance depuis la CLI: php generate-listing-photos.php
 */

require 'vendor/autoload.php';

use App\Models\Listing;
use App\Models\ListingPhoto;
use Illuminate\Support\Facades\Storage;

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "\n";
echo str_repeat("=", 50) . "\n";
echo "Campus Shop - Generate Listing Photos\n";
echo str_repeat("=", 50) . "\n\n";

// Get all listings without photos
$listingsWithoutPhotos = Listing::whereDoesntHave('photos')->get();

if ($listingsWithoutPhotos->isEmpty()) {
    echo "✓ All listings already have photos.\n\n";
    exit(0);
}

echo "Found {$listingsWithoutPhotos->count()} listings without photos.\n";
echo "Generating placeholder photos...\n\n";

$photoCount = 0;
$service = new \App\Services\PhotoService();

foreach ($listingsWithoutPhotos as $listing) {
    try {
        // Generate 1-3 photos per listing
        $photoCount = rand(1, 3);
        
        for ($i = 0; $i < $photoCount; $i++) {
            $photo = ListingPhoto::create([
                'listing_id' => $listing->id,
                'path' => 'photos/placeholder-' . uniqid() . '.jpg',
                'is_primary' => $i === 0,
                'order' => $i + 1,
            ]);
            
            echo "  ✓ Photo created for listing #{$listing->id}\n";
        }
    } catch (\Exception $e) {
        echo "  ✗ Error creating photos for listing #{$listing->id}: {$e->getMessage()}\n";
    }
}

echo "\n";
echo "==========================================================\n";
echo "Photo generation completed!\n";
echo "==========================================================\n\n";
