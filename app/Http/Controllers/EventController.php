<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEventRequest;
use App\Mail\ClientNotification;
use App\Models\Event;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    public function index(): Response
    {
        return Inertia::render('Events/List');
    }

    public function list()
    {
        $user = Auth::user();
        if ($user->hasRole('author')) {
            $events = Event::all();
        } else if ($user->hasRole('client')) {
            $events = $user->events;
        } else {
            $events = [];
        }

        return response()->json($events);
    }

    public function create(): Response
    {
        return Inertia::render('Events/Create');
    }

    public function store(StoreEventRequest $request): RedirectResponse
    {
        DB::beginTransaction();

        try {
            $event = Event::create($request->validated());

            // Assign event to a randomly selected client
            $client = User::where('role', 'client')->inRandomOrder()->first();
            if ($client) {
                $event->clients()->attach($client->id, ['subscribed_at' => now(), 'created_at' => now(), 'updated_at' => now()]);
                Mail::to($client->email)->queue(new ClientNotification($event, $client));
            }

            DB::commit();
            return redirect()->route('events.index')->with('success', 'Event created successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('events.create')->withErrors(['error' => 'An error occurred while creating the event.']);
        }
    }

    public function show(Event $event): Response
    {
        return Inertia::render('Events/Show', compact('event'));
    }

    public function edit(Event $event): Response
    {
        return Inertia::render('Events/Edit', compact('event'));
    }

    public function update(StoreEventRequest $request, Event $event): RedirectResponse
    {
        DB::beginTransaction();

        try {
            $event->update($request->validated());
            DB::commit();
            return redirect()->route('events.index')->with('success', 'Event updated successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('events.edit', $event->id)->withErrors(['error' => 'An error occurred while updating the event.']);
        }
    }

    public function destroy(Event $event): RedirectResponse
    {
        DB::beginTransaction();

        try {
            $event->delete();
            DB::commit();
            return redirect()->route('events.index')->with('success', 'Event deleted successfully!');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('events.index')->withErrors(['error' => 'An error occurred while deleting the event.']);
        }
    }

    public function checkSelectors(Event $event): RedirectResponse
    {
        // Implementation for checking selectors
        return redirect()->route('events.show', $event);
    }

    public function runCrawler(Event $event): RedirectResponse
    {
        // Implementation for running the crawler
        return redirect()->route('events.show', $event);
    }
}

