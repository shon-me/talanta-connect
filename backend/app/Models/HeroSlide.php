<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class HeroSlide extends Model
{
    protected $fillable = [
        'video_path',
        'poster_path',
        'title',
        'subtitle',
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
}
