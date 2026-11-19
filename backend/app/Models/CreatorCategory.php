<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class CreatorCategory extends Model
{
    protected $fillable = [
        'name'
    ];

    public function brands(): BelongsToMany
    {
        return $this->belongsToMany(
            Creator::class,
            'creator_creator_category',
            'creator_category_id',
            'creator_id'
        );
    }
}
