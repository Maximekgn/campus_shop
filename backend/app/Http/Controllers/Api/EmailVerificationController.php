<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Foundation\Auth\EmailVerificationRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EmailVerificationController extends Controller
{
    /**
     * POST /api/email/verify/{id}/{hash}
     * Verify the user's email address.
     */
    public function verify(EmailVerificationRequest $request): JsonResponse
    {
        $request->fulfill();

        return response()->json([
            'message' => 'Email vérifié avec succès.',
        ]);
    }

    /**
     * POST /api/email/resend
     * Resend the email verification notification.
     */
    public function resend(Request $request): JsonResponse
    {
        if ($request->user()->hasVerifiedEmail()) {
            return response()->json([
                'message' => 'Email déjà vérifié.',
            ]);
        }

        $request->user()->sendEmailVerificationNotification();

        return response()->json([
            'message' => 'Email de vérification renvoyé.',
        ]);
    }
}
