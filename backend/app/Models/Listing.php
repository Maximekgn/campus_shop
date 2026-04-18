<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Support\Facades\Auth;

class Listing extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'title',
        'description',
        'type',
        'price',
        'status',
        'views_count',
    ];

    protected function casts(): array
    {
        return [
            'price' => 'decimal:2',
            'views_count' => 'integer',
        ];
    }

    // ──────────────────────────────────────────────
    // Scopes
    // ──────────────────────────────────────────────

    /**
     * Scope: only published listings (public display).
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('status', 'publiee');
    }

    /**
     * Scope: only listings belonging to the authenticated user.
     */
    public function scopeMine(Builder $query): Builder
    {
        return $query->where('user_id', Auth::id());
    }

    // ──────────────────────────────────────────────
    // Relations
    // ──────────────────────────────────────────────

    /**
     * Owner of this listing.
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Photos attached to this listing (max 3).
     */
    public function photos(): HasMany
    {
        return $this->hasMany(ListingPhoto::class)->orderBy('order');
    }

    /**
     * Conversations about this listing.
     */
    public function conversations(): HasMany
    {
        return $this->hasMany(Conversation::class);
    }

    /**
     * Favorites for this listing.
     */
    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    /**
     * Users who favorited this listing.
     */
    public function favoritedByUsers(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'favorites')->withTimestamps();
    }

    /**
     * Reports against this listing.
     */
    public function reports(): HasMany
    {
        return $this->hasMany(Report::class);
    }
}
