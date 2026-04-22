<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Favorite;
use App\Models\Listing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FavoriteController extends Controller
{
    /**
     * POST /api/listings/{id}/favorite
     * Toggle favorite: add if absent, remove if present.
     */
    public function toggle(Request $request, Listing $listing): JsonResponse
    {
        $userId = $request->user()->id;

        $existing = Favorite::where('user_id', $userId)
            ->where('listing_id', $listing->id)
            ->first();

        if ($existing) {
            $existing->delete();
            return response()->json([
                'message' => 'Annonce retirée des favoris.',
                'is_favorited' => false,
            ]);
        }

        Favorite::create([
            'user_id' => $userId,
            'listing_id' => $listing->id,
        ]);

        return response()->json([
            'message' => 'Annonce ajoutée aux favoris.',
            'is_favorited' => true,
        ], 201);
    }

    /**
     * GET /api/favorites
     * List authenticated user's favorite listings.
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;
        $favorites = Listing::whereHas('favorites', function ($query) use ($userId) {
            $query->where('user_id', $userId);
        })
            ->with(['user:id,name', 'photos'])
            ->withExists(['favorites as is_favorited' => function ($query) use ($userId) {
                $query->where('user_id', $userId);
            }])
            ->active()
            ->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 15));

        return response()->json($favorites);
    }
}
