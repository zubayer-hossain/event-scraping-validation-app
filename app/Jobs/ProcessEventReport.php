<?php

namespace App\Jobs;

use App\Models\Event;
use App\Models\EventReport;
use Symfony\Component\Panther\Client;
use Illuminate\Support\Facades\Log;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;

class ProcessEventReport implements ShouldQueue
{
    use Dispatchable, InteractsWithQueue, Queueable, SerializesModels;

    protected $eventReportData, $documentSelectors, $isLastJob;

    public function __construct($eventReportData, $documentSelectors, $isLastJob)
    {
        $this->eventReportData = $eventReportData;
        $this->documentSelectors = $documentSelectors;
        $this->isLastJob = $isLastJob;
    }

    public function handle()
    {
        try {
            $client = Client::createChromeClient();
            $crawler = $client->request('GET', $this->eventReportData['source_url']);

            if ($crawler->filter($this->documentSelectors['description'])->count() > 0) {
                $description = $crawler->filter($this->documentSelectors['description'])->text();
                Log::info("========================");
                Log::info("Found description for URL: {$this->eventReportData['source_url']} :: {$description}");
                Log::info("========================");

                $this->eventReportData['description'] = $description;
                $this->eventReportData['is_verified'] = true;
                $this->eventReportData['processed_at'] = now();

                EventReport::create($this->eventReportData);
            } else {
                Log::warning("Description not found for URL: {$this->eventReportData['source_url']}");
            }
        } catch (\Exception $e) {
            Log::error("Error processing event report: " . $e->getMessage());
        } finally {
            if ($this->isLastJob) {
                Event::where('id', $this->eventReportData['event_id'])
                    ->update(['status' => 'completed', 'check_end_time' => now()]);

                Log::info("Event status updated to completed for event ID: {$this->eventReportData['event_id']}");
            }

            if (isset($client)) {
                $client->quit();
            }
        }
    }
}
