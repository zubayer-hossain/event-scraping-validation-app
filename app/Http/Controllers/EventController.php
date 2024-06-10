<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreEventRequest;
use App\Jobs\ScrapeEvent;
use App\Mail\ClientNotification;
use App\Models\Event;
use App\Models\User;
use Carbon\Carbon;
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
        $events = [];

        if ($user->role === 'author') {
            $events = Event::orderBy('created_at', 'desc')->get();
        } else if ($user->role === 'client') {
            $events = $user->events;
        }

        return response()->json($events);
    }

    public function create(): Response
    {
        return Inertia::render('Events/Create');
    }

    public function store(StoreEventRequest $request)
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
            return Inertia::render('Events/List');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('events.create')->withErrors(['error' => 'An error occurred while creating the event.']);
        }
    }

    public function edit(Event $event): Response
    {
        return Inertia::render('Events/Edit', compact('event'));
    }

    public function update(StoreEventRequest $request, Event $event)
    {
        DB::beginTransaction();

        try {
            $event->update($request->validated());
            DB::commit();
            return Inertia::render('Events/List');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('events.edit', $event->id)->withErrors(['error' => 'An error occurred while updating the event.']);
        }
    }

    public function destroy(Event $event)
    {
        DB::beginTransaction();

        try {
            $event->delete();
            DB::commit();

            return Inertia::render('Events/List');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->route('events.index')->withErrors(['error' => 'An error occurred while deleting the event.']);
        }
    }

    public function checkSelectors(Event $event): Response
    {
        ScrapeEvent::dispatch($event);
        return Inertia::render('Events/List');
    }

    public function getEventReports(Event $event)
    {
        $reports = $event->reports;
        return response()->json($reports);
    }
}

