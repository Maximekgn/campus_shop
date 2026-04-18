<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreListingRequest;
use App\Http\Requests\UpdateListingRequest;
use App\Models\Listing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ListingController extends Controller
{
    /**
     * GET /api/listings
     * Public listing: filtered, paginated, only published (active scope).
     */
    public function index(Request $request): JsonResponse
    {
        $query = Listing::active()->with(['user:id,name', 'photos']);

        // Search by title or description
        if ($request->filled('q')) {
            $search = $request->input('q');
            $query->where(function ($q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Filter by type
        if ($request->filled('type')) {
            $query->where('type', $request->input('type'));
        }

        // Filter by price range
        if ($request->filled('price_min')) {
            $query->where('price', '>=', $request->input('price_min'));
        }
        if ($request->filled('price_max')) {
            $query->where('price', '<=', $request->input('price_max'));
        }

        // Filter by user
        if ($request->filled('user')) {
            if ($request->input('user') === 'me' && $request->user()) {
                $query->where('user_id', $request->user()->id);
            } else {
                $query->where('user_id', $request->input('user'));
            }
        }

        // Sorting
        $sortBy = $request->input('sort', 'recent');
        switch ($sortBy) {
            case 'price_asc':
                $query->orderBy('price', 'asc');
                break;
            case 'price_desc':
                $query->orderBy('price', 'desc');
                break;
            case 'popular':
                $query->orderBy('views_count', 'desc');
                break;
            case 'recent':
            default:
                $query->orderBy('created_at', 'desc');
                break;
        }

        $listings = $query->paginate($request->input('per_page', 15));

        return response()->json($listings);
    }

    /**
     * GET /api/listings/{id}
     * Show a single listing + increment views_count.
     */
    public function show(Listing $listing): JsonResponse
    {
        // Increment views without touching updated_at
        DB::table('listings')
            ->where('id', $listing->id)
            ->increment('views_count');

        $listing->load(['user:id,name,email', 'photos']);
        $listing->views_count += 1; // Reflect in response

        // Add favorite status if authenticated
        $isFavorited = false;
        if (auth('sanctum')->check()) {
            $isFavorited = $listing->favorites()
                ->where('user_id', auth('sanctum')->id())
                ->exists();
        }

        return response()->json([
            'listing' => $listing,
            'is_favorited' => $isFavorited,
        ]);
    }

    /**
     * POST /api/listings
     * Create a new listing (status = draft, awaits moderation).
     */
    public function store(StoreListingRequest $request): JsonResponse
    {
        $listing = Listing::create([
            'user_id' => $request->user()->id,
            'title' => $request->title,
            'description' => $request->description,
            'type' => $request->type,
            'price' => $request->type === 'don' ? null : $request->price,
            'status' => 'draft',
        ]);

        $listing->load('photos');

        return response()->json([
            'message' => 'Annonce créée avec succès. Elle sera visible après validation par un modérateur.',
            'listing' => $listing,
        ], 201);
    }

    /**
     * PUT /api/listings/{id}
     * Update own listing.
     */
    public function update(UpdateListingRequest $request, Listing $listing): JsonResponse
    {
        $this->authorize('update', $listing);

        $data = $request->validated();

        // If type is changed to 'don', clear the price
        if (isset($data['type']) && $data['type'] === 'don') {
            $data['price'] = null;
        }

        $listing->update($data);
        $listing->load('photos');

        return response()->json([
            'message' => 'Annonce mise à jour.',
            'listing' => $listing,
        ]);
    }

    /**
     * DELETE /api/listings/{id}
     * Delete listing (owner or moderator).
     */
    public function destroy(Listing $listing): JsonResponse
    {
        $this->authorize('delete', $listing);

        $listing->delete();

        return response()->json([
            'message' => 'Annonce supprimée.',
        ]);
    }

    /**
     * GET /api/my-listings
     * Get authenticated user's listings (scope mine).
     */
    public function myListings(Request $request): JsonResponse
    {
        $listings = Listing::mine()
            ->with(['photos'])
            ->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 15));

        return response()->json($listings);
    }
}
