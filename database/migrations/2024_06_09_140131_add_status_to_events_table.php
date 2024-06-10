<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddStatusToEventsTable extends Migration
{
    public function up()
    {
        Schema::table('events', function (Blueprint $table) {
            $table->string('status')->default('pending')->after('document_selectors');
            $table->dateTime('check_start_time')->nullable()->after('status');
            $table->dateTime('check_end_time')->nullable()->after('check_start_time');
        });
    }

    public function down()
    {
        Schema::table('events', function (Blueprint $table) {
            $table->dropColumn(['status', 'check_start_time', 'check_end_time']);
        });
    }
}

