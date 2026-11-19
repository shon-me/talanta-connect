<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('creator_creator_category', function (Blueprint $table) {
            $table->foreignId('creator_id')->constrained()->cascadeOnDelete();
            $table->foreignId('creator_category_id')->constrained()->cascadeOnDelete();
            $table->primary(['creator_id', 'creator_category_id']);
            $table->index('creator_category_id');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('creator_creator_category');
    }
};
