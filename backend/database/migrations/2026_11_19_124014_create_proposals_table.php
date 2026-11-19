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
        Schema::create('proposals', function (Blueprint $table) {
            $table->id();
            $table->ulid('public_id', 26)->unique();
            $table->foreignId('creator_id')->constrained('creators')->cascadeOnDelete();
            $table->foreignId('brand_id')->constrained('brands')->cascadeOnDelete();
            $table->foreignId('campaing_id')->nullable()->constrained('campaings')->cascadeOnDelete();
            $table->string('initiated_by', 7);
            $table->text('description');
            $table->unsignedBigInteger('amount');
            $table->char('currency', 3);
            $table->date('due_date');
            $table->string('status', 10)->default('pending');
            $table->timestamps();

            $table->index(['creator_id', 'status']);
            $table->index(['brand_id', 'status']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('proposals');
    }
};
