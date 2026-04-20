<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Conversation;
use App\Models\Listing;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ConversationController extends Controller
{
    /**
     * POST /api/conversations
     * Start a new conversation about a listing (or return existing one).
     * Uses firstOrCreate to enforce uniqueness on (listing_id, buyer_id, seller_id).
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'listing_id' => ['required', 'exists:listings,id'],
        ]);

        $listing = Listing::findOrFail($request->listing_id);
        $buyerId = $request->user()->id;
        $sellerId = $listing->user_id;

        // Cannot start a conversation with yourself
        if ($buyerId === $sellerId) {
            return response()->json([
                'message' => 'Vous ne pouvez pas vous envoyer un message pour votre propre annonce.',
            ], 422);
        }

        $conversation = Conversation::firstOrCreate(
            [
                'listing_id' => $listing->id,
                'buyer_id' => $buyerId,
                'seller_id' => $sellerId,
            ]
        );

        $conversation->load(['listing:id,title,status', 'buyer:id,name', 'seller:id,name', 'latestMessage']);

        $wasCreated = $conversation->wasRecentlyCreated;

        return response()->json([
            'message' => $wasCreated ? 'Conversation créée.' : 'Conversation existante récupérée.',
            'conversation' => $conversation,
        ], $wasCreated ? 201 : 200);
    }

    /**
     * GET /api/conversations
     * List all conversations for the authenticated user, sorted by last message.
     */
    public function index(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $conversations = Conversation::where('buyer_id', $userId)
            ->orWhere('seller_id', $userId)
            ->with([
                'listing:id,title,status',
                'buyer:id,name',
                'seller:id,name',
                'latestMessage',
            ])
            ->withCount(['messages as unread_count' => function ($query) use ($userId) {
                $query->where('sender_id', '!=', $userId)
                    ->whereNull('read_at');
            }])
            ->orderBy('last_message_at', 'desc')
            ->paginate($request->input('per_page', 20));

        return response()->json($conversations);
    }

    /**
     * GET /api/conversations/{id}
     * Show a conversation with all messages.
     * Marks unread messages as read (read_at) for the current user.
     */
    public function show(Request $request, Conversation $conversation): JsonResponse
    {
        $this->authorize('view', $conversation);

        $userId = $request->user()->id;

        // Mark all unread messages from the OTHER person as read
        $conversation->messages()
            ->where('sender_id', '!=', $userId)
            ->whereNull('read_at')
            ->update(['read_at' => now()]);

        $conversation->load([
            'listing:id,title,status,price,type',
            'buyer:id,name',
            'seller:id,name',
            'messages.sender:id,name',
        ]);

        return response()->json([
            'conversation' => $conversation,
        ]);
    }

    /**
     * GET /api/conversations/unread-count
     * Total number of unread messages for the authenticated user.
     */
    public function unreadCount(Request $request): JsonResponse
    {
        $userId = $request->user()->id;

        $conversationIds = Conversation::where('buyer_id', $userId)
            ->orWhere('seller_id', $userId)
            ->pluck('id');

        $count = \App\Models\Message::whereIn('conversation_id', $conversationIds)
            ->where('sender_id', '!=', $userId)
            ->whereNull('read_at')
            ->count();

        return response()->json([
            'unread_count' => $count,
        ]);
    }
}
