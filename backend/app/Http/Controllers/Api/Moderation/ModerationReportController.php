<?php

namespace App\Http\Controllers\Api\Moderation;

use App\Http\Controllers\Controller;
use App\Models\Listing;
use App\Models\Report;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ModerationReportController extends Controller
{
    /**
     * GET /api/moderation/reports
     * List all open (pending) reports.
     */
    public function index(Request $request): JsonResponse
    {
        $reports = Report::where('status', 'pending')
            ->with([
                'reporter:id,name,email',
                'listing:id,title,status,user_id',
                'listing.user:id,name',
            ])
            ->orderBy('created_at', 'asc')
            ->paginate($request->input('per_page', 15));

        return response()->json($reports);
    }

    /**
     * PUT /api/moderation/reports/{id}
     * Resolve a report. Actions: "hide" (archive listing), "warn" (keep listing), "delete" (delete listing).
     */
    public function resolve(Request $request, Report $report): JsonResponse
    {
        $request->validate([
            'action' => ['required', 'in:hide,warn,delete'],
            'note' => ['nullable', 'string', 'max:1000'],
        ], [
            'action.required' => 'L\'action est obligatoire.',
            'action.in' => 'L\'action doit être : hide, warn ou delete.',
        ]);

        if ($report->status === 'resolved') {
            return response()->json([
                'message' => 'Ce signalement a déjà été traité.',
            ], 422);
        }

        $listing = $report->listing;
        $action = $request->action;

        switch ($action) {
            case 'hide':
                // Archive the listing (hide it from public view)
                $listing->update(['status' => 'archivee']);
                break;

            case 'delete':
                // Delete the listing and its photos entirely
                foreach ($listing->photos as $photo) {
                    Storage::disk('public')->delete($photo->path);
                }
                $listing->delete();
                break;

            case 'warn':
                // Just acknowledge — listing stays, user gets a warning (logged in resolution_note)
                break;
        }

        $report->update([
            'status' => 'resolved',
            'resolved_by' => $request->user()->id,
            'resolution_note' => $request->input('note', "Action : {$action}"),
        ]);

        return response()->json([
            'message' => 'Signalement traité.',
            'report' => $report->fresh(['reporter:id,name', 'resolver:id,name']),
        ]);
    }
}
