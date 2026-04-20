<?php

namespace App\Http\Controllers\Api\Moderation;

use App\Http\Controllers\Controller;
use App\Http\Requests\BanUserRequest;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class ModerationUserController extends Controller
{
    /**
     * GET /api/moderation/users
     * List all members (with optional filter for banned users).
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::select(['id', 'name', 'email', 'role', 'student_id', 'is_active', 'ban_until', 'created_at']);

        // Filter by banned status
        if ($request->filled('banned')) {
            if ($request->input('banned') === 'true') {
                $query->where('is_active', false)
                    ->where('ban_until', '>', now());
            } elseif ($request->input('banned') === 'false') {
                $query->where('is_active', true);
            }
        }

        // Search by name or email
        if ($request->filled('q')) {
            $search = $request->input('q');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        $users = $query->orderBy('created_at', 'desc')
            ->paginate($request->input('per_page', 20));

        return response()->json($users);
    }

    /**
     * PUT /api/moderation/users/{id}/ban
     * Temporarily ban a user.
     */
    public function ban(BanUserRequest $request, User $user): JsonResponse
    {
        // Cannot ban a moderator
        if ($user->isModerator()) {
            return response()->json([
                'message' => 'Impossible de bannir un modérateur.',
            ], 422);
        }

        $user->update([
            'is_active' => false,
            'ban_until' => $request->ban_until,
        ]);

        // Revoke all tokens (force logout)
        $user->tokens()->delete();

        return response()->json([
            'message' => "Utilisateur {$user->name} banni jusqu'au {$request->ban_until}.",
            'user' => $user->fresh(),
        ]);
    }

    /**
     * PUT /api/moderation/users/{id}/unban
     * Lift a user's ban.
     */
    public function unban(User $user): JsonResponse
    {
        $user->update([
            'is_active' => true,
            'ban_until' => null,
        ]);

        return response()->json([
            'message' => "Bannissement de {$user->name} levé.",
            'user' => $user->fresh(),
        ]);
    }
}
