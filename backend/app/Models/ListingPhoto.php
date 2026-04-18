<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ListingPhoto extends Model
{
    use HasFactory;

    protected $fillable = [
        'listing_id',
        'path',
        'order',
    ];

    protected function casts(): array
    {
        return [
            'order' => 'integer',
        ];
    }

    /**
     * The listing this photo belongs to.
     */
    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }
}
