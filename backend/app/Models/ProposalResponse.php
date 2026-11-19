<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Override;

class ProposalResponse extends Model
{
    protected $table = 'responses';

    public const ACTIONS = ['accept', 'reject', 'counter'];
    public const PARTIES = ['brand', 'creator'];

    protected $fillable = [
        'proposal_id',
        'responded_by',
        'action',
        'message',
        'amount',
        'due_date'
    ];

    public function casts(): array
    {
        return [
            'amount' => 'integer',
            'due_date' => 'date'
        ];
    }

    public function proposal(): BelongsTo
    {
        return $this->belongsTo(Proposal::class);
    }
}
