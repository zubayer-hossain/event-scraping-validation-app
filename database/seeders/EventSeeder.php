<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use App\Models\Event;

class EventSeeder extends Seeder
{
    public function run()
    {
        $events = [
            [
                "name" => "Financial Stability Board - Consultation",
                "url" => "https://www.fsb.org/consultations/",
                "country" => "Australia",
                "document" => "Consultation",
                "source_type" => "web scraping",
                "horizon_scanning" => true,
                "source_selectors" => [
                    "date" => ".media-heading .media-date",
                    "link" => ".media-heading a",
                    "title" => ".media-heading a",
                    "container" => "div.mtt-results > div > div.media",
                    "date_format" => "j F Y",
                    "description" => null,
                    "remove_text_from_date" => "Published:"
                ],
                "document_selectors" => [
                    "description" => ".post .post-body .post-content"
                ],
                "status" => "pending",
                "created_at" => now(),
                "updated_at" => now()
            ],
            [
                "name" => "Financial Stability Board - Publications",
                "url" => "https://www.fsb.org/publications/",
                "country" => "Australia",
                "document" => "Media Release",
                "source_type" => "web scraping",
                "horizon_scanning" => true,
                "source_selectors" => [
                    "date" => ".media-heading .media-date",
                    "link" => ".media-heading a",
                    "title" => ".media-heading a",
                    "container" => "div.mtt-results > div > div.media",
                    "date_format" => "j F Y",
                    "description" => null,
                    "remove_text_from_date" => "Published:"
                ],
                "document_selectors" => [
                    "description" => ".post .post-body .post-content"
                ],
                "status" => "pending",
                "created_at" => now(),
                "updated_at" => now()
            ],
            [
                "name" => "Financial Stability Board - Press",
                "url" => "https://www.fsb.org/press/",
                "country" => "Australia",
                "document" => "Media Release",
                "source_type" => "web scraping",
                "horizon_scanning" => true,
                "source_selectors" => [
                    "date" => ".media-heading .media-date",
                    "link" => ".media-heading a",
                    "title" => ".media-heading a",
                    "container" => "div.mtt-results > div > div.media",
                    "date_format" => "j F Y",
                    "description" => null,
                    "remove_text_from_date" => "Published:"
                ],
                "document_selectors" => [
                    "description" => ".post .post-body .post-content"
                ],
                "status" => "pending",
                "created_at" => now(),
                "updated_at" => now()
            ]
        ];

        foreach ($events as $event) {
            $newEvent = Event::create($event);

            // Assign a random client to this event
            $client = User::where('role', 'client')->inRandomOrder()->first();
            DB::table('client_events')->insert([
                'event_id' => $newEvent->id,
                'client_id' => $client->id,
                'subscribed_at' => now(),
                'created_at' => now(),
                'updated_at' => now()
            ]);
        }
    }
}
