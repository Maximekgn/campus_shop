<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', fn() => view('welcome'));


Route::get('/mobile', fn() => Inertia::render('Mobile/Home'));
Route::get('/mobile/search', fn() => Inertia::render('Mobile/Search'));
Route::get('/mobile/listings/create', fn() => Inertia::render('Mobile/Create'));
Route::get('/mobile/conversations', fn() => Inertia::render('Mobile/Conversations'));
Route::get('/mobile/conversations/{conversation}', fn($conversation) => Inertia::render('Mobile/ConversationShow', [
    'conversationId' => (int) $conversation,
]));
Route::get('/mobile/profile', fn() => Inertia::render('Mobile/Profile'));



Route::get('/login', fn() => Inertia::render('Auth/Login'))->name('login');
Route::get('/register', fn() => Inertia::render('Auth/Register'))->name('register');
