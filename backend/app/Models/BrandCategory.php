<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class BrandCategory extends Model
{
    protected $fillable = [
        'name'
    ];

    public function brands(): BelongsToMany
    {
        return $this->belongsToMany(
            Brand::class,
            'brand_brand_category',
            'brand_category_id',
            'brand_id'
        );
    }
}
