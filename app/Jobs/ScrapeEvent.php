<?php

namespace App\Jobs;

use App\Models\Event;
use App\Models\EventReport;
use Symfony\Component\Panther\DomCrawler\Crawler;
use Symfony\Component\Panther\PantherTestCase;
use Symfony\Component\Panther\Client;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use Illuminate\Support\Facades\Log;

class ScrapeEvent implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $event;

    public function __construct(Event $event)
    {
        $this->event = $event;
    }

    public function handle()
    {
        $startTime = now();
//        $this->event->update(['status' => 'scraping', 'check_start_time' => $startTime]);

        try {
            $client = Client::createChromeClient(base_path('drivers/chromedriver.exe'));
            $crawler = $client->request('GET', $this->event->url);

            $selectors = $this->event->source_selectors;
            if (!$selectors || !isset($selectors['container']) || !$selectors['container']) {
                throw new \Exception("Container selector is missing or invalid.");
            }

            $container = $crawler->filter($selectors['container']);
            Log::info("=============================");
            Log::info("Found {$container->count()} elements for selector: {$selectors['container']}");
            Log::info("=============================");
            if ($container->count() == 0) {
                Log::warning("No containers found for selector: {$selectors['container']}");
                throw new \Exception("No elements found for the specified container selector.");
            }

            $reports = [];
            $container->each(function (Crawler $node) use ($selectors, &$reports, $client) {
                if ($node->filter($selectors['link'])->count() > 0 && $node->filter($selectors['title'])->count() > 0 && $node->filter($selectors['date'])->count() > 0) {
                    Log::info("Found necessary elements within container for : {$selectors['link']}");
                    $link = $node->filter($selectors['link'])->link()->getUri();
                    $title = $node->filter($selectors['title'])->text();
                    $date = $node->filter($selectors['date'])->text();

                    $detailCrawler = $client->request('GET', $link);
                    if ($detailCrawler->filter($selectors['description'])->count() > 0) {
                        $description = $detailCrawler->filter($selectors['description'])->text();

                        EventReport::create([
                            'event_id' => $this->event->id,
                            'title' => $title,
                            'description' => $description,
                            'date' => $date,
                            'source_url' => $link,
                            'base_url' => $this->event->url,
                            'is_verified' => true,
                            'created_by' => auth()->id(),
                        ]);
                    } else {
                        Log::warning("Description not found for link: {$link}");
                    }
                } else {
                    Log::warning("Missing necessary elements within container for URL: {$this->event->url}");
                }
            });

            $endTime = now();
            $this->event->update(['status' => 'completed', 'check_end_time' => $endTime]);
        } catch (\Exception $e) {
            Log::error("Error scraping event ID {$this->event->id}: " . $e->getMessage());
            Log::info("Trace: " . $e->getTraceAsString());
            $this->event->update(['status' => 'failed', 'check_end_time' => now()]);
            throw $e;
        }
    }
}
