<?php

namespace App\Policies;

use App\Models\Conversation;
use App\Models\User;

class ConversationPolicy
{
    /**
     * Only buyer or seller can view the conversation.
     */
    public function view(User $user, Conversation $conversation): bool
    {
        return $conversation->isParticipant($user->id);
    }

    /**
     * Only buyer or seller can send messages in the conversation.
     */
    public function sendMessage(User $user, Conversation $conversation): bool
    {
        return $conversation->isParticipant($user->id);
    }
}
