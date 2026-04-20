<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    public function show(User $user): JsonResponse
    {
        $publishedCount = $user->listings()->where('status', 'publiee')->count();
        $soldCount = $user->listings()->where('status', 'vendue')->count();
        
        // Calcul du taux de réponse (très basique pour l'exemple)
        $conversations = $user->sellerConversations()->withCount('messages')->get();
        $totalConversations = $conversations->count();
        $respondedConversations = $conversations->filter(function($c) use ($user) {
            // Check si le vendeur a envoyé un message
            return $c->messages()->where('user_id', $user->id)->exists();
        })->count();

        $responseRate = $totalConversations > 0 
            ? round(($respondedConversations / $totalConversations) * 100) 
            : null;

        return response()->json([
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'created_at' => $user->created_at,
                'last_seen_at' => $user->last_seen_at,
                'is_active' => $user->is_active,
            ],
            'stats' => [
                'published_listings_count' => $publishedCount,
                'sold_listings_count' => $soldCount,
                'response_rate_percent' => $responseRate,
                'registration_date' => $user->created_at->toIso8601String(),
            ]
        ]);
    }
}
