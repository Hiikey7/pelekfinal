<?php

namespace Database\Seeders;

use App\Models\Blog;
use App\Models\Faq;
use App\Models\Property;
use App\Models\Review;
use App\Models\SiteSetting;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        foreach (['whatsapp' => '+254711614099', 'instagram' => '', 'tiktok' => '', 'facebook' => ''] as $key => $value) {
            SiteSetting::query()->updateOrCreate(['key' => $key], ['value' => $value]);
        }

        $properties = [
            ['Luxury Nairobi Apartment', 'Kilimani, Nairobi', 'airbnb', '/images/property-1.jpg', 9500, true],
            ['Modern Family Rental', 'Lavington, Nairobi', 'rental', '/images/property-2.jpg', 85000, true],
            ['Elegant Villa For Sale', 'Karen, Nairobi', 'sale', '/images/property-3.jpg', 32000000, true],
            ['Prime Office Suite', 'Westlands, Nairobi', 'commercial_spaces', '/images/property-4.jpg', 180000, false],
            ['Cozy Coastal Stay', 'Diani, Kenya', 'airbnb', '/images/property-5.jpg', 12000, true],
            ['Executive Townhouse', 'Runda, Nairobi', 'rental', '/images/property-6.jpg', 220000, false],
        ];

        foreach ($properties as [$title, $location, $category, $image, $price, $featured]) {
            Property::query()->updateOrCreate(
                ['title' => $title],
                [
                    'location' => $location,
                    'category' => $category,
                    'type' => ucfirst(str_replace('_', ' ', $category)),
                    'image' => $image,
                    'images' => [$image],
                    'description' => 'A carefully managed Pelek Properties listing with thoughtful amenities, responsive support, and a convenient location.',
                    'amenities' => ['WiFi', 'Parking', 'Security', 'Kitchen'],
                    'bedrooms' => 3,
                    'bathrooms' => 2,
                    'guests' => 4,
                    'price' => $price,
                    'price_label' => $category === 'airbnb' ? '/ night' : '',
                    'rating' => 4.8,
                    'reviews_count' => 24,
                    'featured' => $featured,
                    'whatsapp' => '+254711614099',
                    'lat' => 0,
                    'lng' => 0,
                    'google_map_link' => '',
                    'social_media_url' => '',
                    'social_media_type' => '',
                ]
            );
        }

        Blog::query()->updateOrCreate(
            ['title' => 'How to Choose the Right Airbnb in Nairobi'],
            [
                'excerpt' => 'A practical guide to location, amenities, pricing, and guest support.',
                'content' => 'Choose a stay based on access, security, verified amenities, and responsive guest support.',
                'image' => '/images/property-1.jpg',
                'author' => 'Pelek Properties',
                'date' => now()->format('M d, Y'),
                'category' => 'Airbnb',
                'read_time' => '4 min read',
                'show_on_homepage' => true,
            ]
        );

        foreach ([
            ['Mary Wanjiku', 'Excellent support and a beautiful apartment.', 'MW'],
            ['Daniel Otieno', 'The booking process was smooth and professional.', 'DO'],
            ['Grace Njeri', 'Clean property, great location, and quick communication.', 'GN'],
        ] as [$name, $comment, $avatar]) {
            Review::query()->updateOrCreate(['name' => $name], [
                'rating' => 5,
                'comment' => $comment,
                'date' => now()->format('M d, Y'),
                'avatar' => $avatar,
            ]);
        }

        foreach ([
            ['What types of properties do you offer?', 'We offer Airbnb stays, rentals, properties for sale, and commercial spaces.'],
            ['Do you manage properties?', 'Yes. Pelek Properties supports bookings, tenant care, maintenance coordination, and reporting.'],
            ['How do I contact you?', 'Use the contact page or WhatsApp button and our team will respond.'],
        ] as $index => [$question, $answer]) {
            Faq::query()->updateOrCreate(['question' => $question], ['answer' => $answer, 'sort_order' => $index]);
        }
    }
}
