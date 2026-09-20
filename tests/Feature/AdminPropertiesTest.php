<?php

namespace Tests\Feature;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Tests\TestCase;

class AdminPropertiesTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();

        config(['database.default' => 'sqlite', 'database.connections.sqlite.database' => ':memory:']);
        DB::purge('sqlite');
        $this->artisan('migrate', ['--force' => true]);
        $this->withoutVite();

        for ($index = 1; $index <= 22; $index++) {
            DB::table('properties')->insert([
                'id' => (string) Str::uuid(),
                'slug' => 'property-'.$index,
                'title' => 'Property '.$index,
                'location' => 'Nairobi',
                'category' => $index === 22 ? 'sale' : 'rental',
                'image' => '/images/property-1.jpg',
                'images' => '[]',
                'description' => '',
                'amenities' => '[]',
                'google_map_link' => '',
                'social_media_url' => '',
                'created_at' => now()->subMinutes($index),
                'updated_at' => now(),
            ]);
        }
    }

    public function test_properties_are_paginated_with_filters_preserved(): void
    {
        $response = $this->withSession(['admin_authenticated' => true])
            ->get('/admin/properties?search=Nairobi&category=rental');

        $response->assertOk()->assertViewHas('rows', function ($rows) {
            $this->assertCount(20, $rows);
            $this->assertSame(21, $rows->total());
            $this->assertStringContainsString('search=Nairobi', $rows->nextPageUrl());
            $this->assertStringContainsString('category=rental', $rows->nextPageUrl());

            return true;
        });

        $this->get('/admin/properties?search=Nairobi&category=rental&page=2')
            ->assertOk()->assertViewHas('rows', fn ($rows) => $rows->count() === 1);
    }

    public function test_title_search_and_category_filter_combine_and_handle_no_matches(): void
    {
        $this->withSession(['admin_authenticated' => true])
            ->get('/admin/properties?search=Property+22&category=sale')
            ->assertOk()->assertViewHas('rows', fn ($rows) => $rows->total() === 1);

        $this->get('/admin/properties?search=Property+22&category=rental')
            ->assertOk()->assertSee('No properties found.')
            ->assertViewHas('rows', fn ($rows) => $rows->total() === 0);
    }
}
