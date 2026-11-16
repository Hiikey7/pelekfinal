@extends('layouts.app')
@section('content')
@php
    $priceText = 'KES '.number_format((float) $property->price).($property->price_label ? ' '.$property->price_label : '');
    $propertyUrl = route('property.show', $property);
    $whatsappMessage = "Hello Pelek Properties, I am interested in {$property->title} located in {$property->location}. Price: {$priceText}. I want to book or get more info about this property. Listing: {$propertyUrl}";
    $whatsappUrl = 'https://wa.me/'.preg_replace('/[^0-9]/', '', $property->whatsapp).'?text='.rawurlencode($whatsappMessage);
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
                <button type="button" data-wishlist-toggle data-wishlist-icon data-property-id="{{ $property->id }}" class="absolute right-4 top-4 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 text-secondary shadow-sm backdrop-blur transition-colors hover:bg-secondary hover:text-white" aria-label="Add to Wishlist">
                    <i data-lucide="heart" class="h-5 w-5"></i>
                </button>

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
                <button type="button" data-booking-open class="mt-6 flex w-full items-center justify-center rounded-xl bg-secondary px-6 py-3 font-semibold text-white">{{ in_array($property->category, ['rental', 'sale'], true) ? 'Get More Info' : 'Book Now' }}</button>
                <a href="{{ $whatsappUrl }}" target="_blank" rel="noopener noreferrer" class="mt-3 flex items-center justify-center rounded-xl border border-secondary px-6 py-3 font-semibold text-secondary transition-colors hover:bg-secondary/10">{{ in_array($property->category, ['rental', 'sale'], true) ? 'Enquire via WhatsApp' : 'Book via WhatsApp' }}</a>
                @if ($socialMediaUrl !== '')
                    <a href="{{ $socialMediaUrl }}" target="_blank" rel="noopener noreferrer" class="mt-3 flex items-center justify-center gap-2 rounded-xl border border-secondary px-6 py-3 font-semibold text-secondary transition-colors hover:bg-secondary/10">
                        <i data-lucide="external-link" class="h-4 w-4"></i>View on {{ $socialMediaLabel }}
                    </a>
                @endif
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

<div data-booking-modal class="fixed inset-0 z-[100] hidden items-center justify-center bg-black/60 p-4" role="dialog" aria-modal="true" aria-labelledby="booking-title">
    <div class="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-xl bg-white p-6 shadow-xl">
        <button type="button" data-booking-close class="absolute right-4 top-4 rounded p-1 text-muted-foreground hover:bg-muted" aria-label="Close booking form"><i data-lucide="x" class="h-5 w-5"></i></button>
        <h2 id="booking-title" class="pr-8 text-2xl font-bold">{{ match ($property->category) { 'airbnb' => 'Book Your Stay', 'rental' => 'Rental Inquiry', 'sale' => 'Property Purchase Inquiry', default => 'Commercial Property Inquiry' } }}</h2>
        <p class="mt-1 text-sm text-muted-foreground">{{ $property->title }}</p>
        @if (session('booking_success'))<div role="status" class="mt-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">{{ session('booking_success') }}</div>@endif
        @if (session('booking_error'))<div role="alert" class="mt-4 rounded-lg bg-amber-50 p-3 text-sm text-amber-800">{{ session('booking_error') }}</div>@endif
        @if ($errors->any())<div role="alert" class="mt-4 rounded-lg bg-red-50 p-3 text-sm text-red-700">{{ $errors->first() }}</div>@endif
        <form method="POST" action="{{ route('property.book', $property) }}" class="mt-5 space-y-4">
            @csrf
            <div><label for="booking-name" class="mb-1 block text-sm font-medium">Name</label><input id="booking-name" name="visitor_name" value="{{ old('visitor_name') }}" required maxlength="180" autocomplete="name" class="w-full rounded-lg border border-border p-3"></div>
            <div><label for="booking-email" class="mb-1 block text-sm font-medium">Email</label><input id="booking-email" type="email" name="email" value="{{ old('email') }}" required autocomplete="email" class="w-full rounded-lg border border-border p-3"></div>
            <div><label for="booking-phone" class="mb-1 block text-sm font-medium">Phone</label><input id="booking-phone" type="tel" name="phone" value="{{ old('phone') }}" required autocomplete="tel" class="w-full rounded-lg border border-border p-3"></div>
            @if ($property->category === 'airbnb')
                <div><label for="booking-guests" class="mb-1 block text-sm font-medium">Number of guests</label><input id="booking-guests" type="number" name="guest_count" min="1" max="50" value="{{ old('guest_count', 1) }}" required class="w-full rounded-lg border border-border p-3"></div>
                <div><label for="booking-date" class="mb-1 block text-sm font-medium">Check-in date</label><input id="booking-date" type="date" name="booking_date" value="{{ old('booking_date') }}" min="{{ now()->toDateString() }}" required class="w-full rounded-lg border border-border p-3"></div>
                <div><label for="booking-checkout" class="mb-1 block text-sm font-medium">Check-out date</label><input id="booking-checkout" type="date" name="check_out_date" value="{{ old('check_out_date') }}" min="{{ now()->toDateString() }}" required class="w-full rounded-lg border border-border p-3"></div>
            @elseif ($property->category === 'rental')
                <div><label for="booking-date" class="mb-1 block text-sm font-medium">Preferred move-in date</label><input id="booking-date" type="date" name="booking_date" value="{{ old('booking_date') }}" min="{{ now()->toDateString() }}" required class="w-full rounded-lg border border-border p-3"></div>
            @else
                <div><label for="booking-questions" class="mb-1 block text-sm font-medium">Any questions? <span class="font-normal text-muted-foreground">(optional)</span></label><textarea id="booking-questions" name="questions" rows="4" maxlength="3000" placeholder="Tell us what you would like to know about this property." class="w-full rounded-lg border border-border p-3">{{ old('questions') }}</textarea></div>
            @endif
            <button type="submit" class="w-full rounded-lg bg-secondary px-6 py-3 font-semibold text-white">{{ $property->category === 'airbnb' ? 'Request Stay' : ($property->category === 'rental' ? 'Send Rental Inquiry' : 'Request Property Information') }}</button>
        </form>
    </div>
</div>
@if (session('booking_success') || session('booking_error') || $errors->any())
    <script>document.addEventListener('DOMContentLoaded', () => { const modal = document.querySelector('[data-booking-modal]'); modal?.classList.remove('hidden'); modal?.classList.add('flex'); });</script>
@endif
<script>
document.addEventListener('DOMContentLoaded', () => {
    const modal = document.querySelector('[data-booking-modal]');
    const open = () => { modal?.classList.remove('hidden'); modal?.classList.add('flex'); document.getElementById('booking-name')?.focus(); };
    const close = () => { modal?.classList.add('hidden'); modal?.classList.remove('flex'); };
    document.querySelector('[data-booking-open]')?.addEventListener('click', open);
    modal?.querySelector('[data-booking-close]')?.addEventListener('click', close);
    modal?.addEventListener('click', (event) => { if (event.target === modal) close(); });
    document.addEventListener('keydown', (event) => { if (event.key === 'Escape') close(); });
});
</script>
@endsection
