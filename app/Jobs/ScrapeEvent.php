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
    protected $createdBy;

    public function __construct(Event $event, $createdBy)
    {
        $this->event = $event;
        $this->createdBy = $createdBy;
    }

    public function handle()
    {
        $startTime = now();
        $this->event->update(['check_start_time' => $startTime]);

        try {
            $client = Client::createChromeClient(base_path('drivers/chromedriver.exe'));
            $crawler = $client->request('GET', $this->event->url);

            $selectors = $this->event->source_selectors;
            if (!$selectors || !isset($selectors['container']) || !$selectors['container']) {
                throw new \Exception("Container selector is missing or invalid.");
            }

            $container = $crawler->filter($selectors['container']);
            $documentSelectors = $this->event->document_selectors;

            Log::info("=============================");
            Log::info("Found {$container->count()} elements for selector: {$selectors['container']}");
            Log::info("=============================");

            if ($container->count() == 0) {
                Log::warning("No containers found for selector: {$selectors['container']}");
                throw new \Exception("No elements found for the specified container selector.");
            }

            $lastIndex = $container->count() - 1;
            $container->each(function (Crawler $node, $index) use ($selectors,$documentSelectors, &$reports, $client, $lastIndex) {
                if ($node->filter($selectors['link'])->count() > 0 && $node->filter($selectors['title'])->count() > 0 && $node->filter($selectors['date'])->count() > 0) {
                    $link = $node->filter($selectors['link'])->link()->getUri();
                    $title = $node->filter($selectors['title'])->text();
                    $date = $node->filter($selectors['date'])->text();

                    Log::info("========================");
                    Log::info("Link: {$link}, Title: {$title}, Date: {$date}");
                    Log::info("========================");

                    $eventReportData = [
                        'event_id' => $this->event->id,
                        'title' => $title,
                        'date' => $date,
                        'source_url' => $link,
                        'base_url' => $this->event->url,
                        'is_verified' => false,
                        'report' => $selectors,
                        'created_by' => $this->createdBy,
                    ];
                    $isLastJob = ($index === $lastIndex);
                    ProcessEventReport::dispatch($eventReportData, $documentSelectors, $isLastJob);
                } else {
                    Log::warning("Missing necessary elements within container for URL: {$this->event->url}");
                }
            });

            $client->quit();
            unset($client);
        } catch (\Exception $e) {
            Log::error("Error scraping event ID {$this->event->id}: " . $e->getMessage());
            Log::info("Trace: " . $e->getTraceAsString());
            $this->event->update(['status' => 'failed', 'check_end_time' => now()]);
            throw $e;
        }
    }
}
