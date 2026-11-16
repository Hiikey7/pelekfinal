<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasColumn('properties', 'active')) {
            return;
        }

        Schema::table('properties', function (Blueprint $table) {
            $table->boolean('active')->default(true)->after('featured');
        });
    }

    public function down(): void
    {
        if (! Schema::hasColumn('properties', 'active')) {
            return;
        }

        Schema::table('properties', function (Blueprint $table) {
            $table->dropColumn('active');
        });
    }
};
