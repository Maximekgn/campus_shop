<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

Route::prefix('mobile')->group(function () {
    Route::get('/', fn() => view('mobile.home'));
    Route::get('/search', fn() => view('mobile.home'));
    Route::get('/listings/create', fn() => view('mobile.home'));
    Route::get('/conversations', fn() => view('mobile.home'));
    Route::get('/profile', fn() => view('mobile.home'));
});

Route::get('/email/verify-notice', function () {
    return response()->json(['message' => 'Veuillez vérifier votre email']);
})->name('verification.notice');