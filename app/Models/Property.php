<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Property extends Model
{
    use HasUuids;

    protected $fillable = [
        'title', 'location', 'price', 'price_label', 'rating', 'reviews_count',
        'category', 'type', 'image', 'images', 'description', 'amenities',
        'bedrooms', 'bathrooms', 'guests', 'featured', 'whatsapp', 'lat', 'lng',
        'google_map_link', 'social_media_url', 'social_media_type',
    ];

    protected $casts = [
        'images' => 'array',
        'amenities' => 'array',
        'featured' => 'boolean',
        'price' => 'decimal:2',
        'rating' => 'decimal:2',
    ];
}
