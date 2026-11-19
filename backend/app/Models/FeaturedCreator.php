<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class FeaturedCreator extends Model
{
    protected $fillable = [
        'creator_id',
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

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Creator::class);
    }
}
