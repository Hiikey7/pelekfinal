@extends('layouts.app')
@section('content')
@php
    $priceText = 'KES '.number_format((float) $property->price).($property->price_label ? ' '.$property->price_label : '');
    $whatsappMessage = "Hello Pelek Properties, I am interested in {$property->title} located in {$property->location}. Price: {$priceText}. I want to book or get more info about this property.";
    $whatsappUrl = 'https://wa.me/'.preg_replace('/[^0-9]/', '', $property->whatsapp).'?text='.rawurlencode($whatsappMessage);
    $whatsappLabel = in_array($property->category, ['rental', 'sale'], true) ? 'Get More Info' : 'Book on WhatsApp';
    $socialMediaUrl = trim((string) $property->social_media_url);
    if ($socialMediaUrl !== '' && ! preg_match('/^https?:\/\//i', $socialMediaUrl)) {
        $socialMediaUrl = 'https://'.$socialMediaUrl;
    }
    $socialMediaLabels = [
        'instagram' => 'Instagram',
        'tiktok' => 'TikTok',
        'facebook' => 'Facebook',
    ];
    $socialMediaType = strtolower(trim((string) $property->social_media_type));
    $socialMediaLabel = $socialMediaLabels[$socialMediaType] ?? 'Social Media';
    $propertyImages = collect($property->images ?: [])
        ->prepend($property->image)
        ->filter()
        ->unique()
        ->values();

    if ($propertyImages->isEmpty()) {
        $propertyImages = collect(['/images/property-1.jpg']);
    }

    $amenityIcon = function (string $amenity) use ($amenityIcons): string {
        if (! empty($amenityIcons[$amenity])) {
            return $amenityIcons[$amenity];
        }

        $name = strtolower($amenity);

        return match (true) {
            str_contains($name, 'wifi') || str_contains($name, 'wi-fi') => 'wifi',
            str_contains($name, 'parking') => 'square-parking',
            str_contains($name, 'kitchen') => 'cooking-pot',
            str_contains($name, 'living') || str_contains($name, 'lounge') => 'sofa',
            str_contains($name, 'smok') => 'cigarette-off',
            str_contains($name, 'security') || str_contains($name, 'safety') => 'shield-check',
            str_contains($name, 'pool') || str_contains($name, 'swim') => 'waves',
            str_contains($name, 'gym') || str_contains($name, 'fitness') => 'dumbbell',
            str_contains($name, 'air') || str_contains($name, 'ac') => 'snowflake',
            str_contains($name, 'tv') => 'tv',
            str_contains($name, 'washer') || str_contains($name, 'laundry') => 'washing-machine',
            default => 'circle-check',
        };
    };
@endphp
<section class="py-10">
    <div class="container">
        <div class="mb-8" data-property-carousel>
            <div class="relative aspect-[16/9] overflow-hidden rounded-md shadow-card">
                <div class="flex h-full transition-transform duration-500 ease-out" data-property-carousel-track>
                    @foreach ($propertyImages as $image)
                        <div class="min-w-full">
                            <button type="button" class="block h-full w-full cursor-zoom-in" data-image-lightbox-open data-image-src="{{ $image }}" aria-label="Open image fullscreen">
                                <img src="{{ $image }}" alt="{{ $property->title }}" class="h-full w-full object-cover">
                            </button>
                        </div>
                    @endforeach
                </div>

            </div>

            @if ($propertyImages->count() > 1)
                <div class="mt-4 flex snap-x gap-3 overflow-x-auto pb-2" aria-label="Property images">
                    @foreach ($propertyImages as $image)
                        <button type="button" data-property-carousel-jump="{{ $loop->index }}" data-image-lightbox-open data-image-src="{{ $image }}" class="h-20 w-28 shrink-0 snap-start cursor-zoom-in overflow-hidden rounded-md border-2 border-transparent bg-muted opacity-70 transition hover:opacity-100" aria-label="Show image {{ $loop->iteration }}">
                            <img src="{{ $image }}" alt="{{ $property->title }} image {{ $loop->iteration }}" class="h-full w-full object-cover">
                        </button>
                    @endforeach
                </div>
            @endif
        </div>
        <div class="fixed inset-0 z-[90] hidden items-center justify-center bg-black/90 p-2 sm:p-5" data-image-lightbox>
            <button type="button" class="absolute right-3 top-3 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition hover:bg-white/20" data-image-lightbox-close aria-label="Close image">
                <i data-lucide="x" class="h-5 w-5"></i>
            </button>
            <img src="" alt="{{ $property->title }}" class="max-h-full max-w-full rounded-sm object-contain" data-image-lightbox-image>
        </div>
        <div class="max-w-3xl">
            <span class="text-sm font-semibold capitalize text-secondary">{{ str_replace('_', ' ', $property->category) }}</span>
            <h1 class="mt-2 text-3xl font-bold sm:text-4xl">{{ $property->title }}</h1>
            <p class="mt-3 flex items-center gap-2 text-muted-foreground">
                <i data-lucide="map-pin" class="h-4 w-4"></i>{{ $property->location }}
            </p>

            <aside class="mt-6 rounded-xl bg-white p-6 shadow-card">
                <p class="text-2xl font-bold">KES {{ number_format((float) $property->price) }}</p>
                <p class="text-sm text-muted-foreground">{{ $property->price_label }}</p>
                <a href="{{ $whatsappUrl }}" class="mt-6 flex items-center justify-center rounded-xl bg-secondary px-6 py-3 font-semibold text-white">{{ $whatsappLabel }}</a>
                @if ($socialMediaUrl !== '')
                    <a href="{{ $socialMediaUrl }}" target="_blank" rel="noopener noreferrer" class="mt-3 flex items-center justify-center gap-2 rounded-xl border border-secondary px-6 py-3 font-semibold text-secondary transition-colors hover:bg-secondary/10">
                        <i data-lucide="external-link" class="h-4 w-4"></i>View on {{ $socialMediaLabel }}
                    </a>
                @endif
                <button type="button" data-wishlist-toggle data-wishlist-active-class="bg-secondary/10" data-property-id="{{ $property->id }}" class="mt-3 flex w-full items-center justify-center rounded-xl border border-secondary px-6 py-3 font-semibold text-secondary transition-colors hover:bg-secondary/10">Add to Wishlist</button>
            </aside>

            <section class="mt-8">
                <h2 class="text-2xl font-bold">Overview</h2>
                <div class="mt-4 space-y-3 leading-7 text-muted-foreground [&_a]:font-semibold [&_a]:text-secondary [&_blockquote]:border-l-4 [&_blockquote]:border-secondary [&_blockquote]:pl-4 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-foreground [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc">
                    {!! $property->description ?: '<p>Contact Pelek Properties for more details about this listing.</p>' !!}
                </div>
            </section>

            @if (! empty($property->amenities))
                <section class="mt-10">
                    <h2 class="text-2xl font-bold">Amenities</h2>
                    <div class="mt-5 grid grid-cols-3 gap-x-3 gap-y-5 sm:gap-x-8 lg:gap-x-14">
                        @foreach ($property->amenities as $amenity)
                            <div class="flex min-w-0 items-center gap-2 text-xs font-medium text-primary sm:gap-3 sm:text-sm">
                                <i data-lucide="{{ $amenityIcon($amenity) }}" class="h-4 w-4 shrink-0 text-secondary"></i>
                                <span class="min-w-0 leading-snug">{{ $amenity }}</span>
                            </div>
                        @endforeach
                    </div>
                </section>
            @endif
        </div>

        @if ($similar->isNotEmpty())
            <section class="mt-12">
                <div class="mb-5 flex items-center justify-between gap-4">
                    <h2 class="text-2xl font-bold">Similar Properties</h2>
                    <a href="{{ route('properties') }}" class="text-sm font-semibold text-secondary">View all</a>
                </div>
                <div class="-mx-4 flex snap-x gap-5 overflow-x-auto px-4 pb-4">
                    @foreach ($similar as $item)
                        <div class="w-[290px] shrink-0 snap-start md:w-[340px]">
                            @include('partials.property-card', ['property' => $item])
                        </div>
                    @endforeach
                </div>
            </section>
        @endif
    </div>
</section>
@endsection
