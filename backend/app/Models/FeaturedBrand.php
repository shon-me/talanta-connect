<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeaturedBrand extends Model
{
    protected $fillable = [
        'brand_id',
        'image_path',
        'description',
        'sort_order',
        'is_active',
    ];

    public function casts(): array
    {
        return [
            'sort_order' => 'integer',
            'is_active' => 'boolean'
        ];
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }
}
