<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        return Inertia::render('Events/List');
    }

    public function list()
    {
        $events = Event::all();
        return response()->json($events);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        return Inertia::render('Events/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'required|url',
            'country' => 'required|string|max:255',
            'document' => 'required|string|max:255',
            'source_type' => 'required|string|max:255',
            'reference_selector' => 'nullable|string|max:255',
            'horizon_scanning' => 'required|boolean',
            'source_selectors' => 'nullable|array',
            'document_selectors' => 'nullable|array',
        ]);

        $event = Event::create($request->all());

        // Assign event to a randomly selected client
        $client = User::where('role', 'client')->inRandomOrder()->first();
        if ($client) {
            $event->clients()->attach($client->id, ['subscribed_at' => now()]);
            // Send an email notification to the client using the queue (implementation required)
        }

        return redirect()->route('events.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(Event $event): Response
    {
        return Inertia::render('Events/Show', compact('event'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Event $event): Response
    {
        return Inertia::render('Events/Edit', compact('event'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Event $event): RedirectResponse
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'url' => 'required|url',
            'country' => 'required|string|max:255',
            'document' => 'required|string|max:255',
            'source_type' => 'required|string|max:255',
            'reference_selector' => 'nullable|string|max:255',
            'horizon_scanning' => 'required|boolean',
            'source_selectors' => 'nullable|array',
            'document_selectors' => 'nullable|array',
        ]);

        $event->update($request->all());

        return redirect()->route('events.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Event $event): RedirectResponse
    {
        $event->delete();
        return redirect()->route('events.index');
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
