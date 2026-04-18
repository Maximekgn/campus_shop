<?php

namespace App\Policies;

use App\Models\Listing;
use App\Models\User;

class ListingPolicy
{
    /**
     * Only the author can update their listing.
     */
    public function update(User $user, Listing $listing): bool
    {
        return $user->id === $listing->user_id;
    }

    /**
     * The author OR a moderator can delete a listing.
     */
    public function delete(User $user, Listing $listing): bool
    {
        return $user->id === $listing->user_id || $user->isModerator();
    }

    /**
     * Only the author can change the status of their listing.
     */
    public function updateStatus(User $user, Listing $listing): bool
    {
        return $user->id === $listing->user_id;
    }

    /**
     * Only the author can manage photos on their listing.
     */
    public function managePhotos(User $user, Listing $listing): bool
    {
        return $user->id === $listing->user_id;
    }
}
