<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Str;

class Property extends Model
{
    use HasUuids;

    protected $fillable = [
        'title', 'slug', 'location', 'price', 'price_label', 'rating', 'reviews_count',
        'category', 'type', 'image', 'images', 'description', 'amenities',
<<<<<<< HEAD
        'bedrooms', 'bathrooms', 'guests', 'featured', 'active', 'whatsapp', 'lat', 'lng',
=======
        'bedrooms', 'bathrooms', 'guests', 'featured', 'whatsapp', 'lat', 'lng',
>>>>>>> e2a2cd99738bbb7dfe22bb748399b5c35b526e01
        'google_map_link', 'social_media_url', 'social_media_type',
    ];

    protected $casts = [
        'images' => 'array',
        'amenities' => 'array',
        'featured' => 'boolean',
<<<<<<< HEAD
        'active' => 'boolean',
=======
>>>>>>> e2a2cd99738bbb7dfe22bb748399b5c35b526e01
        'price' => 'decimal:2',
        'rating' => 'decimal:2',
    ];

    protected static function booted(): void
    {
        static::saving(function (self $property) {
            if ($property->isDirty('title') || blank($property->slug)) {
                $property->slug = static::uniqueSlug($property->title, $property->getKey());
            }
        });
    }

    public function resolveRouteBinding($value, $field = null): ?self
    {
        if ($field !== null) {
            return parent::resolveRouteBinding($value, $field);
        }

        return static::query()->where('slug', $value)->first()
            ?? static::query()->whereKey($value)->first();
    }

    public function getRouteKeyName(): string
    {
        return 'slug';
    }

    private static function uniqueSlug(string $title, mixed $ignoreId = null): string
    {
        $baseSlug = Str::slug($title) ?: (string) Str::uuid();
        $slug = $baseSlug;
        $suffix = 2;

        while (static::query()
            ->where('slug', $slug)
            ->when($ignoreId, fn ($query) => $query->whereKeyNot($ignoreId))
            ->exists()) {
            $slug = "{$baseSlug}-{$suffix}";
            $suffix += 1;
        }

        return $slug;
    }
}
