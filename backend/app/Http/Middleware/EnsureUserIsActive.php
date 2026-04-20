<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsActive
{
    /**
     * Handle an incoming request.
     * Block users that are banned (is_active = false AND ban_until is in the future).
     */
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if ($user && !$user->is_active) {
            if ($user->ban_until && $user->ban_until->isFuture()) {
                return response()->json([
                    'message' => 'Votre compte est temporairement suspendu.',
                    'ban_until' => $user->ban_until->toIso8601String(),
                ], 403);
            }

            // Ban expired — reactivate the user
            $user->update(['is_active' => true, 'ban_until' => null]);
        }

        return $next($request);
    }
}
