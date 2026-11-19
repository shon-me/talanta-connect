<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUlids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Proposal extends Model
{
    use HasUlids;

    public const STATS = ['pending', 'accepted', 'rejected', 'countered'];
    public const PARTIES = ['brand', 'creator'];

    protected $fillable = [
        'creator_id',
        'brand_id',
        'campaing_id',
        'initiated_by',
        'description',
        'amount',
        'currency',
        'due_date',
        'status'
    ];

    public function uniqueIds(): array
    {
        return ['public_id'];
    }

    public function getRouteKeyName(): string
    {
        return 'public_id';
    }

    public function casts(): array
    {
        return [
            'amount' => 'integer',
            'due_date' => 'date'
        ];
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(Creator::class);
    }

    public function brand(): BelongsTo
    {
        return $this->belongsTo(Brand::class);
    }

    public function campaign(): BelongsTo
    {
        return $this->belongsTo(Campaing::class);
    }

    public function responses(): HasMany
    {
        return $this->hasMany(ProposalResponse::class);
    }

    public function transactions(): HasMany
    {
        return $this->hasMany(Transaction::class);
    }
}
