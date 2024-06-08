<?php

use App\Http\Controllers\ClientEventController;
use App\Http\Controllers\EventController;
use App\Http\Controllers\EventReportController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'role:author'])->group(function () {
    Route::get('events/list', [EventController::class, 'list']);
    Route::resource('events', EventController::class);
    Route::resource('event-reports', EventReportController::class);
    Route::post('events/{event}/check-selectors', [EventController::class, 'checkSelectors']);
    Route::post('events/{event}/run-crawler', [EventController::class, 'runCrawler']);
});

Route::middleware(['auth', 'role:client'])->group(function () {
   //
});

require __DIR__.'/auth.php';
