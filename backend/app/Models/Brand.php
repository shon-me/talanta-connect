<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Override;

class Brand extends Model
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
        return $this->hasOne(FeaturedBrand::class);
    }

    public function brandCategories(): BelongsToMany
    {
        return $this->belongsToMany(
            BrandCategory::class,
            'brand_brand_category',
            'brand_id',
            'brand_category_id'
        );
    }

    public function paymentMethods(): HasMany
    {
        return $this->hasMany(PaymentMethod::class);
    }

    public function campaings(): HasMany
    {
        return $this->hasMany(Campaing::class);
    }

    public function proposals(): HasMany
    {
        return $this->hasMany(Proposal::class);
    }

    public function transactions(): HasManyThrough
    {
        return $this->hasManyThrough(Transaction::class, Proposal::class);
    }
}
