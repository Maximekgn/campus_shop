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
     * Ajoute automatiquement /storage/ devant le chemin.
     */
    public function getPathAttribute($value): string
    {
        if (!$value) return '';
        if (str_starts_with($value, 'http') || str_starts_with($value, '/')) {
            return $value; // Déjà correct, on ne touche pas
        }
        return '/storage/' . $value; // ✅ Corrige le chemin
    }

    /**
     * The listing this photo belongs to.
     */
    public function listing(): BelongsTo
    {
        return $this->belongsTo(Listing::class);
    }
}