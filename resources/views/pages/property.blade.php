@extends('layouts.app')
@section('content')
@php
    $priceText = 'KES '.number_format((float) $property->price).($property->price_label ? ' '.$property->price_label : '');
    $whatsappMessage = "Hello Pelek Properties, I am interested in {$property->title} located in {$property->location}. Price: {$priceText}. I want to book or get more info about this property.";
    $whatsappUrl = 'https://wa.me/'.preg_replace('/[^0-9]/', '', $property->whatsapp).'?text='.rawurlencode($whatsappMessage);
    $whatsappLabel = in_array($property->category, ['rental', 'sale'], true) ? 'Get More Info' : 'Book on WhatsApp';
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
        <div class="relative mb-8 aspect-[16/9] overflow-hidden rounded-2xl shadow-card" data-property-carousel>
            <div class="flex h-full transition-transform duration-500 ease-out" data-property-carousel-track>
                @foreach ($propertyImages as $image)
                    <div class="min-w-full">
                        <img src="{{ $image }}" alt="{{ $property->title }}" class="h-full w-full object-cover">
                    </div>
                @endforeach
            </div>

            @if ($propertyImages->count() > 1)
                <button type="button" data-property-carousel-prev class="absolute left-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-card transition-colors hover:bg-secondary hover:text-white" aria-label="Previous image">
                    <i data-lucide="chevron-left" class="h-5 w-5"></i>
                </button>
                <button type="button" data-property-carousel-next class="absolute right-4 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-primary shadow-card transition-colors hover:bg-secondary hover:text-white" aria-label="Next image">
                    <i data-lucide="chevron-right" class="h-5 w-5"></i>
                </button>
            @endif
        </div>
        <div class="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div class="order-2 lg:order-1"><span class="text-sm font-semibold text-secondary">{{ str_replace('_',' ',ucfirst($property->category)) }}</span><h1 class="mt-2 text-4xl font-bold">{{ $property->title }}</h1><p class="mt-3 flex items-center gap-2 text-muted-foreground"><i data-lucide="map-pin" class="h-4 w-4"></i>{{ $property->location }}</p><p class="mt-6 leading-7 text-muted-foreground">{{ $property->description ?: 'Contact Pelek Properties for more details about this listing.' }}</p></div>
            <aside class="order-1 rounded-xl bg-white p-6 shadow-card lg:order-2"><p class="text-2xl font-bold">KES {{ number_format((float) $property->price) }}</p><p class="text-sm text-muted-foreground">{{ $property->price_label }}</p><a href="{{ $whatsappUrl }}" class="mt-6 flex items-center justify-center rounded-xl bg-secondary px-6 py-3 font-semibold text-white">{{ $whatsappLabel }}</a><button type="button" data-wishlist-toggle data-wishlist-active-class="bg-secondary/10" data-property-id="{{ $property->id }}" class="mt-3 flex w-full items-center justify-center rounded-xl border border-secondary px-6 py-3 font-semibold text-secondary transition-colors hover:bg-secondary/10">Add to Wishlist</button></aside>
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
