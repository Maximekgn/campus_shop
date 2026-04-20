<?php

namespace App\Observers;

use App\Models\Listing;

class ListingObserver
{
    /**
     * Handle the Listing "created" event.
     */
    public function created(Listing $listing): void
    {
        //
    }

    public function updated(Listing $listing): void
    {
        if ($listing->isDirty('price')) {
            $listing->priceHistories()->create([
                'old_price' => $listing->getOriginal('price'),
                'new_price' => $listing->price,
            ]);
        }
    }

    /**
     * Handle the Listing "deleted" event.
     */
    public function deleted(Listing $listing): void
    {
        //
    }

    /**
     * Handle the Listing "restored" event.
     */
    public function restored(Listing $listing): void
    {
        //
    }

    /**
     * Handle the Listing "force deleted" event.
     */
    public function forceDeleted(Listing $listing): void
    {
        //
    }
}
