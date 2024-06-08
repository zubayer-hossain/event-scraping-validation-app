<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'url', 'country', 'document', 'source_type', 'reference_selector',
        'horizon_scanning', 'source_selectors', 'document_selectors'
    ];

    protected $casts = [
        'source_selectors' => 'array',
        'document_selectors' => 'array',
        'horizon_scanning' => 'boolean',
    ];

    protected $appends = ['last_updated_at'];

    public function reports()
    {
        return $this->hasMany(EventReport::class);
    }

    public function clients()
    {
        return $this->belongsToMany(User::class, 'client_events', 'event_id', 'client_id');
    }

    public function getLastUpdatedAtAttribute()
    {
        $date = $this->updated_at;
        return $date ? $date->format('g:i A, j F Y') : null;
    }
}
