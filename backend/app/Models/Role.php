<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{
    protected $fillable =
    [
        'name',
        'description',
        'permision'//these are in for of numbers 1,2,3 and 4. 1 being the lowest and 4 the highest
        //Roles will be 4...1 and 2 is creator and brand
        //3 and 4 will be the Admin roles.
    ];

    public function users(): HasMany
    {
        return $this->hasMany(User::class);
    }
}
