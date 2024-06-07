<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class EventReport extends Model
{
    use HasFactory;

    protected $fillable = [
        'event_id', 'title', 'description', 'date', 'processed_at',
        'source_url', 'base_url', 'is_verified', 'report', 'created_by'
    ];

    protected $casts = [
        'report' => 'array',
    ];

    public function event()
    {
        return $this->belongsTo(Event::class);
    }

    public function author()
    {
        return $this->belongsTo(User::class, 'created_by');
    }
}
