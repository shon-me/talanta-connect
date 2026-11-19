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
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->ulid('public_id', 26)->unique();
            $table->string('type', 10);
            $table->foreignId('wallet_id')->constrained('wallets');
            $table->foreignId('proposal_id')->constrained('proposals');
            $table->foreignId('payment_method_id')->constrained('payment_methods');
            $table->foreignId('widthraw_method_id')->constrained('withdraw_methods');
            $table->unsignedBigInteger('amount');
            $table->char('currency', 3);
            $table->string('status', 10)->default('pending');
            $table->string('provider_ref', 100)->unique();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
