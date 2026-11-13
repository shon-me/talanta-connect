<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('brand_category', function (Blueprint $table) {
            $table->foreignId('brand_id')->constrained()->cascadeOnDelete();
            $table->foreignId('brand_category_id')->constrained()->cascadeOnDelete();
            $table->primary(['brand_id', 'brand_category_id']);
            /*This is a pivot table that has a many to many relationship 
            enabling communication between brands table and 
            brands categorey table*/
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('brand_category');
    }
};
