<?php

namespace App\Providers;

use Illuminate\Routing\UrlGenerator;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\URL;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(UrlGenerator $url): void
    {
        \App\Models\Listing::observe(\App\Observers\ListingObserver::class);
        
        if (env('APP_ENV') === 'production') {
            URL::forceScheme('https');
        }
        
        // Override email verification routes for API
        if (!$this->app->runningInConsole()) {
            $url->route('verification.notice', function () {
                return response()->json(['message' => 'Vérifiez votre email']);
            }, false);
        }
    }
}
