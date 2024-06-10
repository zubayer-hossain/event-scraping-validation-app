<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    // Add the role to the fillable attributes
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'avatar',
        'last_login_at',
        'status',
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function events()
    {
        return $this->belongsToMany(Event::class, 'client_events', 'client_id', 'event_id')
            ->withPivot('subscribed_at');
    }
}

