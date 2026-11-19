<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Creator extends Model
{
    use HasUlids;

    protected $fillable = [
        'user_id',
        'bio'
    ];

    public function uniqueIds(): array
    {
        return ['public_id'];
    }

    public function getRouteKeyName(): string
    {
        return 'public_id';
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function featured(): HasOne
    {
        return $this->hasOne(FeaturedCreator::class);
    }

    public function creatorCategories(): BelongsToMany
    {
        return $this->belongsToMany(
            CreatorCategory::class,
            'creator_creator_category',
            'creator_id',
            'creator_category_id'
        );
    }

    public function withdrawMethods(): HasMany
    {
        return $this->hasMany(WithdrawMethod::class);
    }

    public function wallets(): HasMany
    {
        return $this->hasMany(Wallet::class);
    }

    public function proposals(): HasMany
    {
        return $this->hasMany(Proposal::class);
    }

    public function transactions(): HasManyThrough
    {
        return $this->hasManyThrough(Transaction::class, Wallet::class);
    }
}
