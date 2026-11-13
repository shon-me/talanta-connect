<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Brand_category extends Model
{
    protected $fillable = [
        'name',
        'description',
    ];
    
    public function brands()
    {
        return $this->belongsToMany(Brands::class, 'brand_category');
    }
}
