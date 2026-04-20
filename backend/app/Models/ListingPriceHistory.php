<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ListingPriceHistory extends Model
{
    protected $fillable = ['listing_id', 'old_price', 'new_price'];

    public function listing()
    {
        return $this->belongsTo(Listing::class);
    }
}
