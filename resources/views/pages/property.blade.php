@extends('layouts.app')
@section('content')
@php
    $priceText = 'KES '.number_format((float) $property->price).($property->price_label ? ' '.$property->price_label : '');
    $whatsappMessage = "Hello Pelek Properties, I am interested in {$property->title} located in {$property->location}. Price: {$priceText}. I want to book or get more info about this property.";
    $whatsappUrl = 'https://wa.me/'.preg_replace('/[^0-9]/', '', $property->whatsapp).'?text='.rawurlencode($whatsappMessage);
<<<<<<< HEAD
    $whatsappLabel = $property->category === 'airbnb' ? 'Book Now' : 'Get More Info';
    $mobileBookingLabel = $property->category === 'airbnb' ? 'Select Room' : $whatsappLabel;
=======
    $whatsappLabel = in_array($property->category, ['rental', 'sale'], true) ? 'Get More Info' : 'Book on WhatsApp';
>>>>>>> e2a2cd99738bbb7dfe22bb748399b5c35b526e01
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
<<<<<<< HEAD

    $desktopGalleryImages = $propertyImages->take(5);

    $amenityIcons = [
        'non-smoking rooms' => 'cigarette-off',
        'non smoking rooms' => 'cigarette-off',
        'wifi' => 'wifi',
        'free wifi' => 'wifi',
        'parking' => 'car-front',
        'kitchen' => 'cooking-pot',
        'living area' => 'armchair',
        'security' => 'shield-check',
        'safety & security' => 'shield-check',
        'safety and security' => 'shield-check',
        'cctv' => 'cctv',
        'swimming pool' => 'waves',
        'air conditioning' => 'snowflake',
        'tv' => 'tv',
        'washer' => 'washing-machine',
        'dryer' => 'wind',
        'hot tub' => 'bath',
        'gym' => 'dumbbell',
        'garden' => 'trees',
        'balcony' => 'building-2',
        'generator' => 'zap',
        'water tank' => 'droplets',
        'bbq area' => 'flame',
        'pet friendly' => 'paw-print',
        'elevator' => 'move-vertical',
        'furnished' => 'sofa',
    ];
@endphp
<section class="py-10">
    <div class="container property-page-container">
        <div class="mb-8 lg:hidden" data-property-carousel>
            <div class="relative aspect-[16/9] overflow-hidden rounded-sm shadow-card">
                <div class="flex h-full transition-transform duration-500 ease-out" data-property-carousel-track>
                    @foreach ($propertyImages as $image)
                        <div class="min-w-full">
                            <img src="{{ $image }}" alt="{{ $property->title }}" data-lightbox-open class="h-full w-full cursor-zoom-in object-cover">
                        </div>
                    @endforeach
                </div>
                <button type="button" data-wishlist-toggle data-wishlist-icon data-property-id="{{ $property->id }}" class="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white text-secondary shadow-card transition-colors hover:bg-secondary hover:text-white" aria-label="Add to Wishlist">
                    <i data-lucide="heart" class="h-4 w-4"></i>
                </button>
=======
@endphp
<section class="py-10">
    <div class="container">
        <div class="mb-8" data-property-carousel>
            <div class="relative aspect-[16/9] overflow-hidden rounded-2xl shadow-card">
                <div class="flex h-full transition-transform duration-500 ease-out" data-property-carousel-track>
                    @foreach ($propertyImages as $image)
                        <div class="min-w-full">
                            <img src="{{ $image }}" alt="{{ $property->title }}" class="h-full w-full object-cover">
                        </div>
                    @endforeach
                </div>

>>>>>>> e2a2cd99738bbb7dfe22bb748399b5c35b526e01
            </div>

            @if ($propertyImages->count() > 1)
                <div class="mt-4 flex snap-x gap-3 overflow-x-auto pb-2" aria-label="Property images">
                    @foreach ($propertyImages as $image)
<<<<<<< HEAD
                        <button type="button" data-property-carousel-jump="{{ $loop->index }}" class="h-20 w-28 shrink-0 snap-start overflow-hidden rounded-sm border-2 border-transparent bg-muted opacity-70 transition hover:opacity-100" aria-label="Show image {{ $loop->iteration }}">
                            <img src="{{ $image }}" alt="{{ $property->title }} image {{ $loop->iteration }}" data-lightbox-open class="h-full w-full cursor-zoom-in object-cover">
=======
                        <button type="button" data-property-carousel-jump="{{ $loop->index }}" class="h-20 w-28 shrink-0 snap-start overflow-hidden rounded-lg border-2 border-transparent bg-muted opacity-70 transition hover:opacity-100" aria-label="Show image {{ $loop->iteration }}">
                            <img src="{{ $image }}" alt="{{ $property->title }} image {{ $loop->iteration }}" class="h-full w-full object-cover">
>>>>>>> e2a2cd99738bbb7dfe22bb748399b5c35b526e01
                        </button>
                    @endforeach
                </div>
            @endif
        </div>
<<<<<<< HEAD
        <div class="relative mb-8 hidden h-[520px] grid-cols-[2fr_1fr_1fr] grid-rows-2 gap-2 overflow-hidden rounded-sm bg-muted lg:grid">
            @foreach ($desktopGalleryImages as $image)
                @php
                    $galleryCount = $desktopGalleryImages->count();
                    $galleryClass = match (true) {
                        $galleryCount === 1 => 'col-span-3 row-span-2',
                        $galleryCount === 2 && $loop->first => 'col-span-2 row-span-2',
                        $galleryCount === 2 => 'row-span-2',
                        $galleryCount === 3 && $loop->first => 'col-span-2 row-span-2',
                        $galleryCount === 4 && $loop->first => 'row-span-2',
                        default => $loop->first ? 'row-span-2' : '',
                    };
                @endphp
                <div class="relative min-h-0 overflow-hidden {{ $galleryClass }}">
                    <img src="{{ $image }}" alt="{{ $property->title }} image {{ $loop->iteration }}" data-lightbox-open class="h-full w-full cursor-zoom-in object-cover transition-transform duration-500 hover:scale-[1.02]">
                    @if ($loop->first)
                        <button type="button" data-wishlist-toggle data-wishlist-icon data-property-id="{{ $property->id }}" class="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white text-secondary shadow-card transition-colors hover:bg-secondary hover:text-white" aria-label="Add to Wishlist">
                            <i data-lucide="heart" class="h-4 w-4"></i>
                        </button>
                    @endif
                    @if ($loop->last && $galleryCount > 1)
                        <button type="button" data-lightbox-open data-lightbox-src="{{ $image }}" class="absolute bottom-4 right-4 rounded-sm bg-white px-5 py-3 text-sm font-semibold text-card-foreground shadow-card transition hover:bg-gray-50">
                            See All {{ $propertyImages->count() }} Photos
                        </button>
                    @endif
                </div>
            @endforeach
        </div>
        <div>
            <div class="lg:flex lg:items-center lg:justify-between lg:gap-10">
                <div class="min-w-0">
                    <span class="text-sm font-semibold capitalize text-secondary">{{ str_replace('_', ' ', $property->category) }}</span>
                    <h1 class="mt-2 text-2xl font-bold sm:text-3xl">{{ $property->title }}</h1>
                    <p class="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
                        <i data-lucide="map-pin" class="h-3.5 w-3.5"></i>{{ $property->location }}
                    </p>
                </div>

                <aside class="mt-6 lg:mt-0 lg:shrink-0">
                    <div class="flex items-center justify-between gap-4">
                        <div class="flex min-w-0 items-baseline gap-1">
                            @if ($property->category !== 'airbnb')
                                <p class="text-xs text-card-foreground">From</p>
                            @endif
                            <p class="whitespace-nowrap text-xl font-bold sm:text-2xl">KES {{ number_format((float) $property->price) }}</p>
                            @if ($property->category === 'airbnb')
                                <p class="whitespace-nowrap text-xs text-card-foreground">per night</p>
                            @endif
                        </div>
                        <a href="{{ $whatsappUrl }}" class="flex shrink-0 items-center justify-center gap-2 rounded-sm bg-secondary px-5 py-3 text-sm font-semibold text-white transition-opacity hover:opacity-90 sm:px-7">
                            <span class="sm:hidden">{{ $mobileBookingLabel }}</span>
                            <span class="hidden sm:inline">{{ $whatsappLabel }}</span>
                            <i data-lucide="arrow-up-right" class="h-4 w-4" aria-hidden="true"></i>
                        </a>
                    </div>
                    @if ($socialMediaUrl !== '')
                        <a href="{{ $socialMediaUrl }}" target="_blank" rel="noopener noreferrer" class="mt-3 flex items-center justify-center gap-2 rounded-sm border border-secondary px-6 py-3 font-semibold text-secondary transition-colors hover:bg-secondary/10">
                            <i data-lucide="external-link" class="h-4 w-4"></i>View on {{ $socialMediaLabel }}
                        </a>
                    @endif
                </aside>
            </div>

            <section class="mt-8 max-w-3xl" aria-labelledby="overview-heading">
                <h2 id="overview-heading" class="mb-3 text-xl font-bold">Overview</h2>
                <div class="prose prose-sm max-w-none leading-7 text-muted-foreground">{!! $property->description ?: '<p>Contact Pelek Properties for more details about this listing.</p>' !!}</div>
            </section>

            @if (! empty($property->amenities))
                <section class="mt-8 max-w-3xl" aria-labelledby="amenities-heading">
                    <h2 id="amenities-heading" class="mb-5 text-xl font-bold">Amenities</h2>
                    <ul class="grid grid-cols-3 gap-x-4 gap-y-4">
                        @foreach ($property->amenities as $amenity)
                            @php
                                $amenityName = trim((string) $amenity);
                                $amenityIcon = $amenityIcons[strtolower($amenityName)] ?? 'circle-check';
                            @endphp
                            <li class="flex items-center gap-3 text-sm text-card-foreground">
                                <i data-lucide="{{ $amenityIcon }}" class="h-4 w-4 shrink-0 text-secondary" aria-hidden="true"></i>
                                <span>{{ $amenityName }}</span>
                            </li>
                        @endforeach
                    </ul>
                </section>
            @endif
=======
        <div class="max-w-3xl">
            <span class="text-sm font-semibold capitalize text-secondary">{{ str_replace('_', ' ', $property->category) }}</span>
            <h1 class="mt-2 text-4xl font-bold">{{ $property->title }}</h1>
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

            <p class="mt-6 leading-7 text-muted-foreground">{{ $property->description ?: 'Contact Pelek Properties for more details about this listing.' }}</p>
>>>>>>> e2a2cd99738bbb7dfe22bb748399b5c35b526e01
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
<<<<<<< HEAD

    <div data-image-lightbox class="fixed inset-0 z-[100] hidden items-center justify-center bg-black/90 p-3 sm:p-6" role="dialog" aria-modal="true" aria-label="Property image viewer">
        <button type="button" data-lightbox-close class="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-black" aria-label="Close image viewer">
            <i data-lucide="x" class="h-5 w-5"></i>
        </button>
        <button type="button" data-lightbox-prev class="absolute left-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black sm:left-6" aria-label="Previous image">
            <i data-lucide="chevron-left" class="h-5 w-5"></i>
        </button>
        <img data-lightbox-image src="" alt="Expanded property image" class="max-h-[94vh] max-w-full object-contain">
        <button type="button" data-lightbox-next class="absolute right-3 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-black sm:right-6" aria-label="Next image">
            <i data-lucide="chevron-right" class="h-5 w-5"></i>
        </button>
    </div>
=======
>>>>>>> e2a2cd99738bbb7dfe22bb748399b5c35b526e01
</section>
@endsection
