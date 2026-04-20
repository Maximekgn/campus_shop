<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\StoreMessageRequest;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\JsonResponse;

class MessageController extends Controller
{
    /**
     * POST /api/conversations/{id}/messages
     * Send a message in a conversation.
     * Updates last_message_at on the conversation.
     */
    public function store(StoreMessageRequest $request, Conversation $conversation): JsonResponse
    {
        $this->authorize('sendMessage', $conversation);

        $message = Message::create([
            'conversation_id' => $conversation->id,
            'sender_id' => $request->user()->id,
            'body' => $request->body,
        ]);

        // Update last_message_at
        $conversation->update([
            'last_message_at' => now(),
        ]);

        $message->load('sender:id,name');

        return response()->json([
            'message' => 'Message envoyé.',
            'data' => $message,
        ], 201);
    }
}
