<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\ListingPhoto;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ListingPhotoController extends Controller
{
    /**
     * POST /api/listings/{id}/photos
     * Upload one or more photos (max 3 total per listing).
     * Accepts multipart/form-data with field name "photos[]" or "photos".
     */
    public function store(Request $request, Listing $listing): JsonResponse
    {
        $this->authorize('managePhotos', $listing);

        // Validate uploaded files
        $request->validate([
            'photos' => ['required', 'array', 'min:1'],
            'photos.*' => ['image', 'mimes:jpeg,png,webp', 'max:1024'],
        ], [
            'photos.required' => 'Au moins une photo est requise.',
            'photos.*.image' => 'Le fichier doit être une image.',
            'photos.*.mimes' => 'Formats acceptés : JPEG, PNG, WebP.',
            'photos.*.max' => 'Chaque photo ne peut pas dépasser 1 Mo.',
        ]);

        // Check current photo count
        $currentCount = $listing->photos()->count();
        $newPhotos = $request->file('photos');
        $totalAfter = $currentCount + count($newPhotos);

        if ($totalAfter > 3) {
            return response()->json([
                'message' => "Maximum 3 photos par annonce. Vous en avez déjà {$currentCount}.",
                'current_count' => $currentCount,
                'max' => 3,
            ], 422);
        }

        $uploadedPhotos = [];
        $order = $currentCount + 1;

        foreach ($newPhotos as $photo) {
            $path = $photo->store("listings/{$listing->id}", 'public');

            $listingPhoto = ListingPhoto::create([
                'listing_id' => $listing->id,
                'path' => $path,
                'order' => $order,
            ]);

            $uploadedPhotos[] = $listingPhoto;
            $order++;
        }

        return response()->json([
            'message' => count($uploadedPhotos) . ' photo(s) uploadée(s) avec succès.',
            'photos' => $uploadedPhotos,
        ], 201);
    }

    /**
     * DELETE /api/listings/{id}/photos/{photoId}
     * Delete a specific photo from a listing.
     */
    public function destroy(Listing $listing, ListingPhoto $photo): JsonResponse
    {
        $this->authorize('managePhotos', $listing);

        // Ensure the photo belongs to this listing
        if ($photo->listing_id !== $listing->id) {
            return response()->json([
                'message' => 'Cette photo n\'appartient pas à cette annonce.',
            ], 404);
        }

        // Delete the file from storage
        Storage::disk('public')->delete($photo->path);

        $photo->delete();

        // Reorder remaining photos
        $listing->photos()->orderBy('order')->get()->each(function ($p, $index) {
            $p->update(['order' => $index + 1]);
        });

        return response()->json([
            'message' => 'Photo supprimée.',
        ]);
    }
}
