<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\UpdateStatusRequest;
use App\Models\Listing;
use Illuminate\Http\JsonResponse;

class ListingStatusController extends Controller
{
    /**
     * PUT /api/listings/{id}/status
     * Change listing status (owner only).
     * Allowed transitions:
     *   publiee → reservee | vendue
     *   reservee → publiee | vendue
     */
    public function update(UpdateStatusRequest $request, Listing $listing): JsonResponse
    {
        $this->authorize('updateStatus', $listing);

        $listing->update([
            'status' => $request->status,
        ]);

        return response()->json([
            'message' => 'Statut mis à jour.',
            'listing' => $listing,
        ]);
    }
}
