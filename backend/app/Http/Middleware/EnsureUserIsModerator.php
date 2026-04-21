<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsModerator
{
    /**
     * Handle an incoming request.
     * Only moderators can access moderation routes.
     */
    public function handle(Request $request, Closure $next): Response
    {
        if (!$request->user() || !$request->user()->isModerator()) {
            return response()->json([
                'message' => 'Accès réservé aux modérateurs.',
            ], 403);
        }

        return $next($request);
    }
}
