<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('properties', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->string('location');
            $table->decimal('price', 12, 2)->default(0);
            $table->string('price_label')->default('');
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('reviews_count')->default(0);
            $table->string('category', 80)->default('rental');
            $table->string('type', 120)->default('');
            $table->text('image');
            $table->json('images');
            $table->longText('description');
            $table->json('amenities');
            $table->integer('bedrooms')->default(1);
            $table->integer('bathrooms')->default(1);
            $table->integer('guests')->nullable();
            $table->boolean('featured')->default(false);
            $table->string('whatsapp', 80)->default('+254711614099');
            $table->decimal('lat', 10, 7)->default(0);
            $table->decimal('lng', 10, 7)->default(0);
            $table->text('google_map_link');
            $table->text('social_media_url');
            $table->string('social_media_type', 80)->default('');
            $table->timestamps();
        });

        Schema::create('blogs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('excerpt');
            $table->longText('content');
            $table->text('image');
            $table->string('author')->default('Pelek Properties');
            $table->string('date', 80)->default('');
            $table->string('category', 120)->default('');
            $table->string('read_time', 80)->default('5 min read');
            $table->boolean('show_on_homepage')->default(false);
            $table->timestamps();
        });

        Schema::create('faqs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->text('question');
            $table->longText('answer');
            $table->integer('sort_order')->default(0);
            $table->timestamps();
        });

        Schema::create('reviews', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->integer('rating')->default(5);
            $table->text('comment');
            $table->string('date', 80)->default('');
            $table->text('avatar');
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('contact_messages', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('full_name');
            $table->string('email');
            $table->string('phone', 80)->default('');
            $table->string('subject')->default('');
            $table->longText('message');
            $table->boolean('read')->default(false);
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('offers', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->text('description');
            $table->text('image');
            $table->string('cta_text', 120)->default('View Now');
            $table->text('cta_link');
            $table->boolean('active')->default(true);
            $table->string('promo_code', 120)->default('');
            $table->string('offer_type', 80)->default('cta_button');
            $table->timestamps();
        });

        Schema::create('amenities', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name')->unique();
            $table->timestamp('created_at')->useCurrent();
        });

        Schema::create('orders', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('visitor_name');
            $table->string('phone', 80)->default('');
            $table->uuid('property_id')->nullable();
            $table->string('property_title')->default('');
            $table->decimal('price_per_night', 12, 2)->default(0);
            $table->integer('num_days')->default(1);
            $table->decimal('total_amount', 12, 2)->default(0);
            $table->string('payment_method', 80)->default('cash');
            $table->string('status', 80)->default('pending');
            $table->text('notes');
            $table->timestamps();
            $table->foreign('property_id')->references('id')->on('properties')->nullOnDelete();
        });

        Schema::create('expenses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('title');
            $table->decimal('amount', 12, 2)->default(0);
            $table->string('category', 120)->default('other');
            $table->text('description');
            $table->timestamps();
        });

        Schema::create('site_settings', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('key', 120)->unique();
            $table->text('value');
            $table->timestamp('updated_at')->useCurrent()->useCurrentOnUpdate();
        });

        $amenities = ['WiFi', 'Swimming Pool', 'Parking', 'Air Conditioning', 'Kitchen', 'TV', 'Washer', 'Dryer', 'Hot Tub', 'Gym', 'Garden', 'Balcony', 'Security', 'CCTV', 'Generator', 'Water Tank', 'BBQ Area', 'Pet Friendly', 'Elevator', 'Furnished'];
        foreach ($amenities as $name) {
            DB::table('amenities')->insert(['id' => (string) str()->uuid(), 'name' => $name]);
        }

        foreach (['whatsapp' => '+254711614099', 'instagram' => '', 'tiktok' => '', 'facebook' => ''] as $key => $value) {
            DB::table('site_settings')->insert(['id' => (string) str()->uuid(), 'key' => $key, 'value' => $value]);
        }
    }

    public function down(): void
    {
        foreach (['site_settings', 'expenses', 'orders', 'amenities', 'offers', 'contact_messages', 'reviews', 'faqs', 'blogs', 'properties'] as $table) {
            Schema::dropIfExists($table);
        }
    }
};
