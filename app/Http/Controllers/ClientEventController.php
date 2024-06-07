<?php

namespace App\Http\Controllers;

use App\Models\ClientEvent;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class ClientEventController extends Controller
{
    public function index(): Response
    {
        $clientEvents = ClientEvent::with('event')->get();
        return Inertia::render('ClientEvents/Index', compact('clientEvents'));
    }
}
