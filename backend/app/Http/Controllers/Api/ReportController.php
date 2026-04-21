<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\Report;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    /**
     * POST /api/listings/{id}/report
     * Report a listing with a reason.
     * One report per user per listing (unique constraint).
     */
    public function store(Request $request, Listing $listing): JsonResponse
    {
        $request->validate([
            'reason' => ['required', 'string', 'max:1000'],
        ], [
            'reason.required' => 'Le motif du signalement est obligatoire.',
        ]);

        // Check if user already reported this listing
        $existing = Report::where('reporter_id', $request->user()->id)
            ->where('listing_id', $listing->id)
            ->first();

        if ($existing) {
            return response()->json([
                'message' => 'Vous avez déjà signalé cette annonce.',
            ], 422);
        }

        $report = Report::create([
            'reporter_id' => $request->user()->id,
            'listing_id' => $listing->id,
            'reason' => $request->reason,
            'status' => 'pending',
        ]);

        return response()->json([
            'message' => 'Signalement enregistré. Un modérateur va examiner cette annonce.',
            'report' => $report,
        ], 201);
    }
}
