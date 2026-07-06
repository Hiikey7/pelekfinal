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

            </div>

            @if ($propertyImages->count() > 1)
                <div class="mt-4 flex snap-x gap-3 overflow-x-auto pb-2" aria-label="Property images">
                    @foreach ($propertyImages as $image)
                        <button type="button" data-property-carousel-jump="{{ $loop->index }}" class="h-20 w-28 shrink-0 snap-start overflow-hidden rounded-lg border-2 border-transparent bg-muted opacity-70 transition hover:opacity-100" aria-label="Show image {{ $loop->iteration }}">
                            <img src="{{ $image }}" alt="{{ $property->title }} image {{ $loop->iteration }}" class="h-full w-full object-cover">
                        </button>
                    @endforeach
                </div>
            @endif
        </div>
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
