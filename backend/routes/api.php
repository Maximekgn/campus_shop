<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CategoryController;
use App\Http\Controllers\Api\ConversationController;
use App\Http\Controllers\Api\EmailVerificationController;
use App\Http\Controllers\Api\FavoriteController;
use App\Http\Controllers\Api\ListingController;
use App\Http\Controllers\Api\ListingPhotoController;
use App\Http\Controllers\Api\ListingStatusController;
use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\Moderation\ModerationListingController;
use App\Http\Controllers\Api\Moderation\ModerationReportController;
use App\Http\Controllers\Api\Moderation\ModerationUserController;
use App\Http\Controllers\Api\ReportController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes — CampusShop
|--------------------------------------------------------------------------
|
| All routes are prefixed with /api automatically.
| Auth uses Laravel Sanctum Bearer tokens.
|
*/

// ──────────────────────────────────────────────
// 5.1 Authentication — /api/auth
// ──────────────────────────────────────────────
Route::prefix('auth')->group(function () {
    // Guest routes
    Route::post('/register', [AuthController::class, 'register']);
    Route::post('/login', [AuthController::class, 'login']);

    // Authenticated routes
    Route::middleware('auth:sanctum')->group(function () {
        Route::post('/logout', [AuthController::class, 'logout']);
        Route::get('/me', [AuthController::class, 'me']);
        Route::put('/me', [AuthController::class, 'updateProfile']);
    });
});

// User public profile (stats)
Route::get('/users/{user}', [\App\Http\Controllers\Api\UserController::class, 'show']);

// Email Verification
Route::post('/email/verify/{id}/{hash}', [EmailVerificationController::class, 'verify'])
    ->middleware(['auth:sanctum', 'signed'])
    ->name('verification.verify');

Route::post('/email/resend', [EmailVerificationController::class, 'resend'])
    ->middleware('auth:sanctum');

// ──────────────────────────────────────────────
// 5.1.1 Categories — /api/categories
// ──────────────────────────────────────────────
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{category}', [CategoryController::class, 'show']);

// ──────────────────────────────────────────────
// 5.2 Listings — /api/listings
// ──────────────────────────────────────────────
Route::get('/listings', [ListingController::class, 'index']);
Route::get('/listings/{listing}', [ListingController::class, 'show']);

Route::middleware(['auth:sanctum', 'active'])->group(function () {
    // Requires verified email to create
    Route::post('/listings', [ListingController::class, 'store'])
        ->middleware('verified');

    Route::put('/listings/{listing}', [ListingController::class, 'update']);
    Route::delete('/listings/{listing}', [ListingController::class, 'destroy']);

    // Status change
    Route::put('/listings/{listing}/status', [ListingStatusController::class, 'update']);

    // Photos
    Route::post('/listings/{listing}/photos', [ListingPhotoController::class, 'store']);
    Route::delete('/listings/{listing}/photos/{photo}', [ListingPhotoController::class, 'destroy']);

    // My listings
    Route::get('/my-listings', [ListingController::class, 'myListings']);
});

// ──────────────────────────────────────────────
// 5.3 Messaging — /api/conversations
// ──────────────────────────────────────────────
Route::middleware(['auth:sanctum', 'active'])->group(function () {
    Route::post('/conversations', [ConversationController::class, 'store']);
    Route::get('/conversations', [ConversationController::class, 'index']);
    Route::get('/conversations/unread-count', [ConversationController::class, 'unreadCount']);
    Route::get('/conversations/{conversation}', [ConversationController::class, 'show']);
    Route::post('/conversations/{conversation}/messages', [MessageController::class, 'store']);
});

// ──────────────────────────────────────────────
// 5.4 Favorites & Reports
// ──────────────────────────────────────────────
Route::middleware(['auth:sanctum', 'active'])->group(function () {
    Route::post('/listings/{listing}/favorite', [FavoriteController::class, 'toggle']);
    Route::get('/favorites', [FavoriteController::class, 'index']);
    Route::post('/listings/{listing}/report', [ReportController::class, 'store']);
});

// ──────────────────────────────────────────────
// 5.5 Moderation — /api/moderation
// ──────────────────────────────────────────────
Route::prefix('moderation')
    ->middleware(['auth:sanctum', 'active', 'role:moderateur'])
    ->group(function () {
        // Listing moderation
        Route::get('/pending', [ModerationListingController::class, 'pending']);
        Route::get('/listings/{listing}/note', [ModerationListingController::class, 'getNote']);
        Route::put('/listings/{listing}/note', [ModerationListingController::class, 'saveNote']);
        Route::get('/listings/{listing}/seller', [ModerationListingController::class, 'getSeller']);
        Route::put('/listings/{listing}/approve', [ModerationListingController::class, 'approve']);
        Route::put('/listings/{listing}/reject', [ModerationListingController::class, 'reject']);

        // Report moderation
        Route::get('/reports', [ModerationReportController::class, 'index']);
        Route::put('/reports/{report}', [ModerationReportController::class, 'resolve']);

        // User moderation
        Route::get('/users', [ModerationUserController::class, 'index']);
        Route::put('/users/{user}/ban', [ModerationUserController::class, 'ban']);
        Route::put('/users/{user}/unban', [ModerationUserController::class, 'unban']);
    });
