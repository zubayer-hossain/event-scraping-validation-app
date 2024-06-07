<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ClientEvent extends Model
{
    use HasFactory;

    protected $fillable = ['client_id', 'event_id', 'subscribed_at'];

    public function client()
    {
        return $this->belongsTo(User::class, 'client_id');
    }

    public function event()
    {
        return $this->belongsTo(Event::class);
    }
}
