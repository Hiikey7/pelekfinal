<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->string('slug')->nullable()->after('title')->index();
        });

        $used = [];
        DB::table('properties')
            ->orderBy('created_at')
            ->get(['id', 'title'])
            ->each(function ($property) use (&$used) {
                $baseSlug = Str::slug($property->title) ?: (string) $property->id;
                $slug = $baseSlug;
                $suffix = 2;

                while (isset($used[$slug])) {
                    $slug = "{$baseSlug}-{$suffix}";
                    $suffix += 1;
                }

                $used[$slug] = true;
                DB::table('properties')->where('id', $property->id)->update(['slug' => $slug]);
            });
    }

    public function down(): void
    {
        Schema::table('properties', function (Blueprint $table) {
            $table->dropIndex(['slug']);
            $table->dropColumn('slug');
        });
    }
};
