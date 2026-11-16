<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('orders', 'email')) {
            Schema::table('orders', fn (Blueprint $table) => $table->string('email')->default('')->after('property_title'));
        }
        if (! Schema::hasColumn('orders', 'booking_date')) {
            Schema::table('orders', fn (Blueprint $table) => $table->date('booking_date')->nullable()->after('email'));
        }
        if (! Schema::hasColumn('orders', 'check_out_date')) {
            Schema::table('orders', fn (Blueprint $table) => $table->date('check_out_date')->nullable()->after('booking_date'));
        }
        if (! Schema::hasColumn('orders', 'guest_count')) {
            Schema::table('orders', fn (Blueprint $table) => $table->unsignedInteger('guest_count')->nullable()->after('check_out_date'));
        }
    }

    public function down(): void
    {
        Schema::table('orders', function (Blueprint $table) {
            $columns = array_values(array_filter(['email', 'booking_date', 'check_out_date', 'guest_count'], fn (string $column) => Schema::hasColumn('orders', $column)));
            if ($columns !== []) $table->dropColumn($columns);
        });
    }
};
