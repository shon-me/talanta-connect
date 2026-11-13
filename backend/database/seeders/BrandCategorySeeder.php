<?php

namespace Database\Seeders;

use App\Models\Brand_category;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class BrandCategorySeeder extends Seeder
{
    public function run(): void
    {
        $brand_categories = [
            ['public_id'=>Str::ulid(),'name'=>'Food & Drink', 'description'=>'Brands that deal with foods and drinks.']
        ];

        foreach ($brand_categories as $brand_category) {
            Brand_category::create($brand_category);
        }
    }
}
