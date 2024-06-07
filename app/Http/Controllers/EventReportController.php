<?php

namespace App\Http\Controllers;

use App\Models\Event;
use App\Models\EventReport;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class EventReportController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): Response
    {
        $eventReports = EventReport::with('event', 'author')->get();
        return Inertia::render('EventReports/Index', compact('eventReports'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $events = Event::all();
        return Inertia::render('EventReports/Create', compact('events'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): RedirectResponse
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
            'source_url' => 'required|url',
            'base_url' => 'required|url',
        ]);

        $reportData = $request->all();
        $reportData['created_by'] = auth()->id();

        EventReport::create($reportData);

        return redirect()->route('event-reports.index');
    }

    /**
     * Display the specified resource.
     */
    public function show(EventReport $eventReport): Response
    {
        return Inertia::render('EventReports/Show', compact('eventReport'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(EventReport $eventReport): Response
    {
        $events = Event::all();
        return Inertia::render('EventReports/Edit', compact('eventReport', 'events'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, EventReport $eventReport): RedirectResponse
    {
        $request->validate([
            'event_id' => 'required|exists:events,id',
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'date' => 'required|date',
            'source_url' => 'required|url',
            'base_url' => 'required|url',
        ]);

        $eventReport->update($request->all());

        return redirect()->route('event-reports.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(EventReport $eventReport): RedirectResponse
    {
        $eventReport->delete();
        return redirect()->route('event-reports.index');
    }
}
