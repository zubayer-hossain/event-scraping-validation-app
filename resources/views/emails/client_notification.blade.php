@component('mail::message')
# Hello, {{ $clientName }}

We have a new event for you: **{{ $eventName }}**

You can view it here:

@component('mail::button', ['url' => $eventUrl])
View Event
@endcomponent

Thanks,<br>
{{ config('app.name') }}
@endcomponent
