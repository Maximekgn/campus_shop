<?php

namespace App\Http\Controllers\Api\Moderation;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ModerationListingController extends Controller
{
    /**
     * GET /api/moderation/pending
     * List all listings awaiting moderation (status = draft).
     */
    public function pending(Request $request): JsonResponse
    {
        $listings = Listing::where('status', 'draft')
            ->with(['user:id,name,email', 'photos'])
            ->orderBy('created_at', 'asc')
            ->paginate($request->input('per_page', 15));

        return response()->json($listings);
    }

    /**
     * PUT /api/moderation/listings/{id}/approve
     * Approve a listing → status becomes "publiee".
     */
    public function approve(Listing $listing): JsonResponse
    {
        if ($listing->status !== 'draft') {
            return response()->json([
                'message' => 'Seules les annonces en brouillon peuvent être approuvées.',
            ], 422);
        }

        $listing->update(['status' => 'publiee']);

        return response()->json([
            'message' => 'Annonce approuvée et publiée.',
            'listing' => $listing,
        ]);
    }

    /**
     * PUT /api/moderation/listings/{id}/reject
     * Reject a listing with a reason → status becomes "archivee".
     */
    public function reject(Request $request, Listing $listing): JsonResponse
    {
        $request->validate([
            'reason' => ['required', 'string', 'max:1000'],
        ], [
            'reason.required' => 'Le motif de refus est obligatoire.',
        ]);

        if ($listing->status !== 'draft') {
            return response()->json([
                'message' => 'Seules les annonces en brouillon peuvent être refusées.',
            ], 422);
        }

        $listing->update(['status' => 'archivee']);

        return response()->json([
            'message' => 'Annonce refusée.',
            'listing' => $listing,
            'reason' => $request->reason,
        ]);
    }
}
