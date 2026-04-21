<?php

namespace App\Models;

use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;

class User extends Authenticatable implements MustVerifyEmail
{
    use HasApiTokens, HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'student_id',
        'is_active',
        'ban_until',
        'last_seen_at',
    ];

    /**
     * The attributes that should be hidden for serialization.
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
            'is_active' => 'boolean',
            'ban_until' => 'datetime',
            'last_seen_at' => 'datetime',
        ];
    }

    /**
     * Check if the user is a moderator.
     */
    public function isModerator(): bool
    {
        return $this->role === 'moderateur';
    }

    /**
     * Check if the user is currently banned.
     */
    public function isBanned(): bool
    {
        return !$this->is_active && $this->ban_until && $this->ban_until->isFuture();
    }

    /**
     * Get the listings owned by this user.
     */
    public function listings(): HasMany
    {
        return $this->hasMany(Listing::class);
    }

    /**
     * Get the listings favorited by this user.
     */
    public function favorites(): HasMany
    {
        return $this->hasMany(Favorite::class);
    }

    /**
     * Get the listings favorited by this user (through pivot).
     */
    public function favoritedListings(): BelongsToMany
    {
        return $this->belongsToMany(Listing::class, 'favorites')->withTimestamps();
    }

    /**
     * Get conversations where this user is the buyer.
     */
    public function buyerConversations(): HasMany
    {
        return $this->hasMany(Conversation::class, 'buyer_id');
    }

    /**
     * Get conversations where this user is the seller.
     */
    public function sellerConversations(): HasMany
    {
        return $this->hasMany(Conversation::class, 'seller_id');
    }

    /**
     * Get all reports filed by this user.
     */
    public function reports(): HasMany
    {
        return $this->hasMany(Report::class, 'reporter_id');
    }
}
