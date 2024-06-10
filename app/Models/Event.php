<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Event extends Model
{
    use HasFactory;

    protected $fillable = [
        'name', 'url', 'country', 'document', 'source_type', 'reference_selector',
        'horizon_scanning', 'source_selectors', 'document_selectors', 'status', 'check_start_time', 'check_end_time'
    ];

    protected $casts = [
        'source_selectors' => 'array',
        'document_selectors' => 'array',
        'horizon_scanning' => 'boolean',
        'check_start_time' => 'datetime',
        'check_end_time' => 'datetime',
    ];

    protected $appends = ['last_updated_at', 'check_start', 'check_end', 'duration'];

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

    public function getDurationAttribute()
    {
        $start = $this->check_start_time;
        $end = $this->check_end_time;
        return $start && $end ? $start->diffForHumans($end, true) : null;
    }

    public function getCheckStartAttribute()
    {
        $date = $this->check_start_time;
        return $date ? $date->format('g:i A, j F Y') : null;
    }

    public function getCheckEndAttribute()
    {
        $date = $this->check_end_time;
        return $date ? $date->format('g:i A, j F Y') : null;
    }
}
