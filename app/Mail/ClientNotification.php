<?php

namespace App\Mail;

use App\Models\Event;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class ClientNotification extends Mailable
{
    use Queueable, SerializesModels;

    public $event;
    public $client;

    public function __construct(Event $event, User $client)
    {
        $this->event = $event;
        $this->client = $client;
    }

    public function build()
    {
        return $this->markdown('emails.client_notification')
            ->subject('New Event Notification')
            ->with([
                'eventName' => $this->event->name,
                'eventUrl' => $this->event->url,
                'clientName' => $this->client->name,
            ]);
    }
}
