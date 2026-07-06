@extends('layouts.admin', ['title' => $title])

@section('content')
<div class="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
    <div>
        <h1 class="text-3xl font-bold">{{ $title }}</h1>
        <p class="mt-2 text-sm text-muted-foreground">{{ $description }}</p>
    </div>

    @if ($section === 'orders')
        <div class="flex gap-2">
            <a href="{{ route('admin.orders.export', ['month' => $month]) }}" class="inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2 text-sm font-semibold shadow-card transition hover:bg-muted">
                <i data-lucide="download" class="h-4 w-4"></i>
                CSV
            </a>
            <a href="#new-order" class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90">
                <i data-lucide="plus" class="h-4 w-4"></i>
                New Order
            </a>
        </div>
    @elseif ($section === 'expenses')
        <a href="#new-expense" class="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90">
            <i data-lucide="plus" class="h-4 w-4"></i>
            Add Expense
        </a>
    @elseif ($section === 'blogs')
        <a href="#new-blog" class="inline-flex items-center gap-2 rounded-lg bg-[#00bfb3] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#00aaa0]">
            <i data-lucide="plus" class="h-4 w-4"></i>
            Add Blog
        </a>
    @elseif ($section === 'amenities')
        <a href="#new-amenity" class="inline-flex items-center gap-2 rounded-lg bg-[#00bfb3] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#00aaa0]">
            <i data-lucide="plus" class="h-4 w-4"></i>
            Add Amenity
        </a>
    @elseif ($section === 'properties')
        <a href="#new-property" class="inline-flex items-center gap-2 rounded-lg bg-[#00bfb3] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#00aaa0]">
            <i data-lucide="plus" class="h-4 w-4"></i>
            Add Property
        </a>
    @elseif ($section === 'reviews')
        <a href="#new-review" class="inline-flex items-center gap-2 rounded-lg bg-[#00bfb3] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#00aaa0]">
            <i data-lucide="plus" class="h-4 w-4"></i>
            Add Review
        </a>
    @elseif ($section === 'offers')
        <a href="#new-offer" class="inline-flex items-center gap-2 rounded-lg bg-[#00bfb3] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[#00aaa0]">
            <i data-lucide="plus" class="h-4 w-4"></i>
            Add Offer
        </a>
    @endif
</div>

@if (session('status'))
    <div class="mb-5 rounded-lg border border-[#b8eee9] bg-[#e4faf8] px-4 py-3 text-sm font-semibold text-[#007970]">
        {{ session('status') }}
    </div>
@endif

@if ($errors->any())
    <div class="mb-5 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
        {{ $errors->first() }}
    </div>
@endif

@if ($section === 'settings')
    <section class="mb-6 max-w-xl rounded-lg bg-white p-6 shadow-card">
        <form method="POST" action="{{ route('admin.settings.update') }}" class="space-y-5">
            @csrf
            <div>
                <label class="mb-2 block text-sm font-semibold">WhatsApp Number</label>
                <input name="whatsapp" value="{{ old('whatsapp', $settings['whatsapp'] ?? '+254711614099') }}" class="w-full rounded-lg border border-border px-4 py-3 text-sm outline-none focus:border-[#00bfb3] focus:ring-2 focus:ring-[#00bfb3]/20">
                <p class="mt-1 text-xs text-muted-foreground">Used in mobile nav and property pages</p>
            </div>
            <div>
                <label class="mb-2 block text-sm font-semibold">Instagram URL</label>
                <input name="instagram" value="{{ old('instagram', $settings['instagram'] ?? '') }}" placeholder="https://instagram.com/yourpage" class="w-full rounded-lg border border-border px-4 py-3 text-sm outline-none focus:border-[#00bfb3] focus:ring-2 focus:ring-[#00bfb3]/20">
            </div>
            <div>
                <label class="mb-2 block text-sm font-semibold">TikTok URL</label>
                <input name="tiktok" value="{{ old('tiktok', $settings['tiktok'] ?? '') }}" placeholder="https://tiktok.com/@yourpage" class="w-full rounded-lg border border-border px-4 py-3 text-sm outline-none focus:border-[#00bfb3] focus:ring-2 focus:ring-[#00bfb3]/20">
            </div>
            <div>
                <label class="mb-2 block text-sm font-semibold">Facebook URL</label>
                <input name="facebook" value="{{ old('facebook', $settings['facebook'] ?? '') }}" placeholder="https://facebook.com/yourpage" class="w-full rounded-lg border border-border px-4 py-3 text-sm outline-none focus:border-[#00bfb3] focus:ring-2 focus:ring-[#00bfb3]/20">
            </div>
            <button type="submit" class="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90">
                <i data-lucide="save" class="h-4 w-4"></i>
                Save Settings
            </button>
        </form>
    </section>
@endif

@if ($section === 'amenities')
    <section id="new-amenity" class="mb-6 rounded-lg bg-white p-6 shadow-card">
        <form method="POST" action="{{ route('admin.amenities.store') }}" class="grid gap-4 md:grid-cols-[1fr_auto_auto] md:items-end">
            @csrf
            <div>
                <label class="mb-2 block text-sm font-medium text-muted-foreground">Amenity Name</label>
                <input name="name" placeholder="e.g. Swimming Pool" class="w-full rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
            </div>
            <button type="submit" class="rounded-lg bg-[#00bfb3] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#00aaa0]">Add</button>
            <a href="{{ route('admin.section', 'amenities') }}" class="rounded-lg border border-border bg-white px-6 py-3 text-center text-sm font-semibold transition hover:bg-muted">Cancel</a>
        </form>
    </section>
@endif

@if ($section === 'properties')
    @php($editingProperty = $editItem)
    <section id="new-property" class="mb-6 rounded-lg bg-white p-6 shadow-card">
        <form method="POST" action="{{ $editingProperty ? route('admin.properties.update', $editingProperty) : route('admin.properties.store') }}" enctype="multipart/form-data" class="space-y-5">
            @csrf
            @if ($editingProperty)
                @method('PUT')
            @endif
            <div class="grid gap-x-12 gap-y-5 lg:grid-cols-2">
                <div>
                    <label class="mb-2 block text-sm font-medium text-muted-foreground">Property title</label>
                    <input name="title" value="{{ old('title', $editingProperty?->title) }}" placeholder="e.g. Luxury 2 Bedroom Apartment" class="w-full rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
                </div>
                <div>
                    <label class="mb-2 block text-sm font-medium text-muted-foreground">Location</label>
                    <input name="location" value="{{ old('location', $editingProperty?->location) }}" placeholder="e.g. Kilimani, Nairobi" class="w-full rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
                </div>
                <div>
                    <label class="mb-2 block text-sm font-medium text-muted-foreground">Numeric price</label>
                    <input name="price" type="number" min="0" step="1" value="{{ old('price', $editingProperty?->price ?? 0) }}" class="w-full rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
                </div>
                <input type="hidden" name="price_label" value="{{ old('price_label', $editingProperty?->price_label) }}">
                <div>
                    <label class="mb-2 block text-sm font-medium text-muted-foreground">Category</label>
                    <select name="category" class="w-full rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
                        @foreach (['rental' => 'Rental', 'airbnb' => 'Airbnb', 'sale' => 'Sale', 'commercial_spaces' => 'Commercial Spaces'] as $value => $label)
                            <option value="{{ $value }}" @selected(old('category', $editingProperty?->category ?? 'rental') === $value)>{{ $label }}</option>
                        @endforeach
                    </select>
                </div>
                <div>
                    <label class="mb-2 block text-sm font-medium text-muted-foreground">Property type</label>
                    <input name="type" value="{{ old('type', $editingProperty?->type) }}" placeholder="e.g. Apartment, Villa, Maisonette" class="w-full rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
                </div>
                <div>
                    <label class="mb-2 block text-sm font-medium text-muted-foreground">Bedrooms</label>
                    <input name="bedrooms" type="number" min="0" value="{{ old('bedrooms', $editingProperty?->bedrooms ?? 1) }}" class="w-full rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
                </div>
                <div>
                    <label class="mb-2 block text-sm font-medium text-muted-foreground">Bathrooms</label>
                    <input name="bathrooms" type="number" min="0" value="{{ old('bathrooms', $editingProperty?->bathrooms ?? 1) }}" class="w-full rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
                </div>
                <div>
                    <label class="mb-2 block text-sm font-medium text-muted-foreground">Guests</label>
                    <input name="guests" type="number" min="0" value="{{ old('guests', $editingProperty?->guests) }}" placeholder="e.g. 4 for Airbnb capacity" class="w-full rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
                </div>
                <div>
                    <label class="mb-2 block text-sm font-medium text-muted-foreground">WhatsApp number</label>
                    <input name="whatsapp" value="{{ old('whatsapp', $editingProperty?->whatsapp ?? '+254711614099') }}" class="w-full rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
                </div>
                <input type="hidden" name="lat" value="{{ old('lat', $editingProperty?->lat ?? 0) }}">
                <input type="hidden" name="lng" value="{{ old('lng', $editingProperty?->lng ?? 0) }}">
                <div>
                    <label class="mb-2 block text-sm font-medium text-muted-foreground">Google Map link</label>
                    <input name="google_map_link" value="{{ old('google_map_link', $editingProperty?->google_map_link) }}" placeholder="Paste the full Google Maps link" class="w-full rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
                </div>
                <div>
                    <label class="mb-2 block text-sm font-medium text-muted-foreground">Social media</label>
                    <div class="grid gap-2 sm:grid-cols-[160px_1fr]">
                        <select name="social_media_type" class="rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
                            @foreach (['' => 'No Social', 'instagram' => 'Instagram', 'tiktok' => 'TikTok', 'facebook' => 'Facebook'] as $value => $label)
                                <option value="{{ $value }}" @selected(old('social_media_type', $editingProperty?->social_media_type ?? '') === $value)>{{ $label }}</option>
                            @endforeach
                        </select>
                        <input name="social_media_url" value="{{ old('social_media_url', $editingProperty?->social_media_url) }}" placeholder="Paste Instagram or TikTok listing/video URL" class="rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
                    </div>
                </div>
            </div>

            <div>
                <label class="mb-2 block text-sm font-medium text-muted-foreground">Description</label>
                <textarea name="description" placeholder="Describe the property, nearby landmarks, house rules, standout amenities, and who it is best for." class="min-h-28 w-full rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">{{ old('description', $editingProperty?->description) }}</textarea>
            </div>

            <div>
                <label class="mb-2 block text-sm font-medium text-muted-foreground">Amenities</label>
                @php($selectedAmenities = old('amenities', $editingProperty?->amenities ?? []))
                <div class="grid gap-2 rounded-lg bg-muted p-3 sm:grid-cols-2 lg:grid-cols-4">
                    @foreach ($amenities as $amenity)
                        <label class="flex cursor-pointer items-center gap-2 rounded-md bg-white px-3 py-2 text-sm transition hover:bg-[#dff7f4]">
                            <input type="checkbox" name="amenities[]" value="{{ $amenity->name }}" @checked(in_array($amenity->name, $selectedAmenities, true)) class="rounded border-border accent-[#00bfb3]">
                            {{ $amenity->name }}
                        </label>
                    @endforeach
                </div>
            </div>

            <div>
                <label class="mb-1 block text-sm font-medium text-muted-foreground">Property Images</label>
                <p class="mb-3 text-xs text-muted-foreground">Upload clear room, exterior, and amenity photos. The first selected cover image appears on listings.</p>
                @if ($editingProperty?->images)
                    <div class="mb-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                        @foreach ($editingProperty->images as $image)
                            <img src="{{ $image }}" alt="{{ $editingProperty->title }}" class="h-28 w-full rounded-lg object-cover">
                        @endforeach
                    </div>
                    <p class="mb-3 text-xs text-muted-foreground">Uploading new images replaces the current image order.</p>
                @endif
                <input type="hidden" name="cover_image_index" value="0" data-cover-image-index>
                <label class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-muted px-4 py-3 text-sm font-semibold transition hover:bg-[#dff7f4]">
                    <i data-lucide="upload" class="h-4 w-4"></i>
                    Upload Images
                    <input name="images[]" type="file" multiple accept="image/*" class="sr-only" data-property-images-input>
                </label>
                <div class="mt-4 hidden rounded-lg border border-border bg-muted p-3" data-property-images-panel>
                    <p class="mb-3 text-xs font-semibold text-muted-foreground">Drag images to reorder. Select one as the cover.</p>
                    <div class="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" data-property-images-preview></div>
                </div>
            </div>

            <label class="inline-flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" name="featured" value="1" @checked(old('featured', $editingProperty?->featured ?? false)) class="rounded border-border">
                Featured Property
            </label>

            <div class="flex gap-3">
                <button type="submit" class="rounded-lg bg-[#00bfb3] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#00aaa0]">{{ $editingProperty ? 'Save Update' : 'Create' }}</button>
                <a href="{{ route('admin.section', 'properties') }}" class="rounded-lg border border-border px-6 py-3 text-sm font-semibold transition hover:bg-muted">Cancel</a>
            </div>
        </form>
    </section>
@endif

@if ($section === 'reviews')
    @php($editingReview = $editItem)
    <section id="new-review" class="mb-6 rounded-lg bg-white p-6 shadow-card">
        <form method="POST" action="{{ $editingReview ? route('admin.reviews.update', $editingReview) : route('admin.reviews.store') }}" class="space-y-4">
            @csrf
            @if ($editingReview)
                @method('PUT')
            @endif
            <div class="grid gap-4 md:grid-cols-2">
                <input name="name" value="{{ old('name', $editingReview?->name) }}" placeholder="Name" class="rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
                <input name="avatar" value="{{ old('avatar', $editingReview?->avatar) }}" placeholder="Avatar (initials e.g. JD)" class="rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
                <select name="rating" class="rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
                    @for ($rating = 5; $rating >= 1; $rating--)
                        <option value="{{ $rating }}" @selected((int) old('rating', $editingReview?->rating ?? 5) === $rating)>{{ $rating }} {{ $rating === 1 ? 'Star' : 'Stars' }}</option>
                    @endfor
                </select>
                <input name="date" value="{{ old('date', $editingReview?->date ?? now()->format('d/m/Y')) }}" placeholder="02/07/2026" class="rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
            </div>
            <textarea name="comment" placeholder="Comment" class="min-h-24 w-full rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">{{ old('comment', $editingReview?->comment) }}</textarea>
            <div class="flex gap-3">
                <button type="submit" class="rounded-lg bg-[#00bfb3] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#00aaa0]">{{ $editingReview ? 'Save Update' : 'Create' }}</button>
                <a href="{{ route('admin.section', 'reviews') }}" class="rounded-lg border border-border px-6 py-3 text-sm font-semibold transition hover:bg-muted">Cancel</a>
            </div>
        </form>
    </section>
@endif

@if ($section === 'offers')
    @php($offer = $singleOffer)
    <section id="new-offer" class="mb-6 rounded-lg bg-white p-6 shadow-card">
        <form method="POST" action="{{ route('admin.offers.store') }}" enctype="multipart/form-data" class="space-y-5">
            @csrf
            <input name="title" value="{{ old('title', $offer?->title) }}" placeholder="Title" class="w-full rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">

            <div>
                <label class="mb-2 block text-sm font-semibold">Banner Image</label>
                <div class="flex items-center gap-3">
                    @if ($offer?->image)
                        <img src="{{ $offer->image }}" alt="{{ $offer->title }}" class="h-16 w-24 rounded-lg border border-border object-cover">
                    @else
                        <div class="flex h-16 w-24 items-center justify-center rounded-lg border border-border bg-muted text-muted-foreground">
                            <i data-lucide="image" class="h-6 w-6"></i>
                        </div>
                    @endif
                    <label class="inline-flex cursor-pointer items-center gap-2 rounded-lg bg-muted px-4 py-3 text-sm font-semibold transition hover:bg-[#dff7f4]">
                        <i data-lucide="upload" class="h-4 w-4"></i>
                        Upload Image
                        <input name="banner_image" type="file" accept="image/*" class="sr-only">
                    </label>
                    <input name="image" value="{{ old('image', $offer?->image) }}" placeholder="or paste image URL" class="min-w-0 flex-1 rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
                </div>
            </div>

            <textarea name="description" placeholder="Description" class="min-h-20 w-full rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">{{ old('description', $offer?->description) }}</textarea>

            <div data-offer-type-group>
                <label class="mb-2 block text-sm font-semibold">Offer Type</label>
                <div class="flex flex-wrap gap-2">
                    <label class="cursor-pointer">
                        <input type="radio" name="offer_type" value="cta_button" @checked(old('offer_type', $offer?->offer_type ?? 'cta_button') === 'cta_button') class="peer sr-only" data-offer-type>
                        <span class="inline-flex rounded-lg bg-muted px-4 py-3 text-sm font-semibold transition peer-checked:bg-[#00bfb3] peer-checked:text-white">Button with URL</span>
                    </label>
                    <label class="cursor-pointer">
                        <input type="radio" name="offer_type" value="promo_code" @checked(old('offer_type', $offer?->offer_type) === 'promo_code') class="peer sr-only" data-offer-type>
                        <span class="inline-flex rounded-lg bg-muted px-4 py-3 text-sm font-semibold transition peer-checked:bg-[#00bfb3] peer-checked:text-white">Promo Code</span>
                    </label>
                </div>
            </div>

            <div class="grid gap-4 md:grid-cols-2" data-offer-cta-fields>
                <input name="cta_text" value="{{ old('cta_text', $offer?->cta_text ?: 'View Now') }}" placeholder="Button name (e.g. View Now)" class="rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
                <input name="cta_link" value="{{ old('cta_link', $offer?->cta_link ?: '/') }}" placeholder="Button URL (e.g. /properties)" class="rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
            </div>

            <div class="hidden" data-offer-promo-fields>
                <input name="promo_code" value="{{ old('promo_code', $offer?->promo_code) }}" placeholder="Promo Code (e.g. SAVE20)" class="w-full rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
                <p class="mt-1 text-xs text-muted-foreground">Users will see a copy button next to this code</p>
            </div>

            <label class="inline-flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" name="active" value="1" @checked(old('active', $offer?->active ?? true)) class="rounded border-border accent-[#00bfb3]">
                Active
            </label>

            <div class="flex gap-3">
                <button type="submit" class="rounded-lg bg-[#00bfb3] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#00aaa0]">{{ $offer ? 'Save Offer' : 'Create' }}</button>
                <a href="{{ route('admin.section', 'offers') }}" class="rounded-lg border border-border px-6 py-3 text-sm font-semibold transition hover:bg-muted">Cancel</a>
            </div>
        </form>
    </section>
@endif

@if ($section === 'orders')
    <section id="new-order" class="mb-6 rounded-lg bg-white p-6 shadow-card">
        <form method="POST" action="{{ route('admin.orders.store') }}" class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            @csrf
            <input name="visitor_name" placeholder="Guest name" class="rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
            <input name="phone" placeholder="Phone" class="rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
            <select name="property_id" class="rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
                <option value="">Select property</option>
                @foreach ($properties as $property)
                    <option value="{{ $property->id }}">{{ $property->title }}</option>
                @endforeach
            </select>
            <input name="price_per_night" type="number" min="0" step="1" placeholder="Price per night" class="rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
            <input name="num_days" type="number" min="1" value="1" placeholder="Days" class="rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
            <input name="discount_amount" type="number" min="0" step="1" value="0" placeholder="Discount" class="rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
            <select name="payment_method" class="rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
                <option value="cash">Cash</option>
                <option value="mpesa">M-Pesa</option>
                <option value="card">Card</option>
                <option value="bank">Bank</option>
            </select>
            <select name="status" class="rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
                <option value="pending">Pending</option>
                <option value="paid">Paid</option>
                <option value="cancelled">Cancelled</option>
            </select>
            <button type="submit" class="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90">Create</button>
            <textarea name="notes" placeholder="Notes" class="md:col-span-2 xl:col-span-4 min-h-24 rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30"></textarea>
        </form>
    </section>
@endif

@if ($section === 'expenses')
    @php($editingExpense = $editItem)
    <section id="new-expense" class="mb-6 rounded-lg bg-white p-6 shadow-card">
        <form method="POST" action="{{ $editingExpense ? route('admin.expenses.update', $editingExpense->id) : route('admin.expenses.store') }}" class="grid gap-4 md:grid-cols-4">
            @csrf
            @if ($editingExpense)
                @method('PUT')
            @endif
            <input name="title" value="{{ old('title', $editingExpense?->title) }}" placeholder="Title" class="rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
            <select name="category" class="rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
                @foreach (['maintenance', 'utilities', 'cleaning', 'repairs', 'marketing', 'supplies', 'staff', 'transport', 'tax', 'other'] as $category)
                    <option value="{{ $category }}" @selected(old('category', $editingExpense?->category ?? 'maintenance') === $category)>{{ str($category)->title() }}</option>
                @endforeach
            </select>
            <input name="amount" type="number" min="0" step="1" value="{{ old('amount', $editingExpense?->amount) }}" placeholder="Amount" class="rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
            <button type="submit" class="rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90">{{ $editingExpense ? 'Save Update' : 'Add Expense' }}</button>
            <textarea name="description" placeholder="Description" class="md:col-span-4 min-h-24 rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">{{ old('description', $editingExpense?->description) }}</textarea>
        </form>
    </section>
@endif

@if ($section === 'blogs')
    @php($editingBlog = $editItem)
    <section id="new-blog" class="mb-6 rounded-lg bg-white p-6 shadow-card">
        <form method="POST" action="{{ $editingBlog ? route('admin.blogs.update', $editingBlog) : route('admin.blogs.store') }}" enctype="multipart/form-data" class="space-y-4">
            @csrf
            @if ($editingBlog)
                @method('PUT')
            @endif
            <div class="grid gap-4 md:grid-cols-2">
                <input name="title" value="{{ old('title', $editingBlog?->title) }}" placeholder="Title" class="rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
                <input name="category" value="{{ old('category', $editingBlog?->category) }}" placeholder="Category" class="rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
                <input name="author" value="{{ old('author', $editingBlog?->author ?? 'Pelek Properties') }}" placeholder="Author" class="rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
                <input name="date" value="{{ old('date', $editingBlog?->date ?? now()->format('j M Y')) }}" placeholder="Date" class="rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
                <input name="read_time" value="{{ old('read_time', $editingBlog?->read_time ?? '5 min read') }}" placeholder="Read time" class="rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
                <input name="image" value="{{ old('image', $editingBlog?->image) }}" placeholder="Image URL or /images/file.jpg" class="rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">
            </div>
            <label class="block">
                <span class="mb-2 block text-sm font-semibold">Cover Image</span>
                @if ($editingBlog?->image)
                    <img src="{{ $editingBlog->image }}" alt="{{ $editingBlog->title }}" class="mb-3 h-32 w-48 rounded-lg border border-border object-cover">
                @endif
                <span class="flex min-h-32 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground transition hover:border-[#00bfb3]">
                    <i data-lucide="upload" class="mb-2 h-5 w-5"></i>
                    Click to upload cover image
                    <input type="file" name="cover_image" accept="image/*" class="sr-only">
                </span>
                @error('cover_image')
                    <span class="mt-2 block text-sm text-red-600">{{ $message }}</span>
                @enderror
            </label>
            <textarea name="excerpt" placeholder="Excerpt" class="min-h-20 w-full rounded-lg border-0 bg-muted px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-[#00bfb3]/30">{{ old('excerpt', $editingBlog?->excerpt) }}</textarea>
            <div>
                <label class="mb-2 block text-sm font-semibold">Content</label>
                <div class="rounded-lg border border-border bg-muted">
                    <div class="flex flex-wrap gap-1 border-b border-border bg-white px-3 py-2 text-muted-foreground">
                        @foreach (['H1', 'H2', 'H3', 'B', 'I', 'U', 'S', 'align-left', 'align-center', 'align-right', 'list', 'list-ordered', 'quote', 'minus', 'link', 'image', 'undo', 'redo'] as $tool)
                            <span class="flex h-7 min-w-7 items-center justify-center rounded text-xs font-semibold">{{ strlen($tool) <= 3 ? $tool : '' }}@if(strlen($tool) > 3)<i data-lucide="{{ $tool }}" class="h-4 w-4"></i>@endif</span>
                        @endforeach
                    </div>
                    <textarea name="content" placeholder="Write your blog content here..." class="min-h-52 w-full resize-y border-0 bg-transparent px-4 py-3 text-sm outline-none">{{ old('content', $editingBlog?->content) }}</textarea>
                </div>
            </div>
            <label class="inline-flex items-center gap-2 text-sm font-medium">
                <input type="checkbox" name="show_on_homepage" value="1" @checked(old('show_on_homepage', $editingBlog?->show_on_homepage ?? false)) class="rounded border-border">
                Show on homepage
            </label>
            <div class="flex gap-3">
                <button type="submit" class="rounded-lg bg-[#00bfb3] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#00aaa0]">{{ $editingBlog ? 'Save Update' : 'Create' }}</button>
                <a href="{{ route('admin.section', 'blogs') }}" class="rounded-lg border border-border px-6 py-3 text-sm font-semibold transition hover:bg-muted">Cancel</a>
            </div>
        </form>
    </section>
@endif

@if (in_array($section, ['orders', 'expenses'], true))
    <form method="GET" action="{{ route('admin.section', $section) }}" class="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label class="flex items-center gap-3 text-sm text-muted-foreground">
            Filter by month:
            <input name="month" type="month" value="{{ $month }}" class="rounded-lg border border-border bg-white px-4 py-2 text-sm outline-none focus:border-[#00bfb3] focus:ring-2 focus:ring-[#00bfb3]/20">
        </label>
        @if ($section === 'expenses')
            <div class="text-sm text-muted-foreground">Total: <strong class="text-foreground">KES {{ number_format((float) $expensesTotal) }}</strong></div>
        @endif
    </form>
@endif

@unless ($section === 'settings')
<section class="rounded-lg bg-white shadow-card">
    <div class="flex items-center gap-3 border-b border-border px-5 py-4">
        <i data-lucide="{{ $icon }}" class="h-5 w-5 text-[#00bfb3]"></i>
        <h2 class="font-semibold">{{ $title }} Data</h2>
    </div>

    @if ($rows->isEmpty())
        <div class="flex min-h-[112px] items-center justify-center px-5 py-12 text-sm text-muted-foreground">
            @if ($section === 'orders')
                No orders found.
            @elseif ($section === 'expenses')
                No expenses recorded
            @elseif ($section === 'blogs')
                No blogs yet
            @elseif ($section === 'amenities')
                No amenities yet
            @else
                No {{ strtolower($title) }} data yet
            @endif
        </div>
    @else
        <div class="overflow-x-auto">
            <table class="w-full min-w-[720px] text-left text-sm">
                <thead class="bg-muted text-xs uppercase tracking-wide text-muted-foreground">
                    <tr>
                        @foreach ($columns as $column)
                            <th class="px-5 py-3 font-semibold">{{ str($column)->replace('_', ' ')->title() }}</th>
                        @endforeach
                        <th class="px-5 py-3 font-semibold">Actions</th>
                    </tr>
                </thead>
                <tbody class="divide-y divide-border">
                    @foreach ($rows as $row)
                        <?php
                            $openUrl = match ($section) {
                                'properties' => route('property.show', $row),
                                'blogs' => route('blog.show', $row),
                                'orders' => route('orders.receipt', $row),
                                default => null,
                            };
                        ?>
                        <tr class="transition hover:bg-muted/70">
                            @foreach ($columns as $column)
                                <td class="max-w-[280px] truncate px-5 py-4">
                                    @php($value = data_get($row, $column))
                                    @if ($section === 'amenities' && $column === 'name')
                                        <form id="amenity-edit-{{ $row->id }}" method="POST" action="{{ route('admin.amenities.update', $row->id) }}" class="flex min-w-[260px] gap-2">
                                            @csrf
                                            @method('PUT')
                                            <input name="name" value="{{ $value }}" class="w-full rounded-md border border-border px-3 py-2 text-sm outline-none focus:border-[#00bfb3] focus:ring-2 focus:ring-[#00bfb3]/20">
                                        </form>
                                    @elseif (is_bool($value))
                                        {{ $value ? 'Yes' : 'No' }}
                                    @elseif (is_numeric($value) && (str_contains($column, 'amount') || str_contains($column, 'price')))
                                        KES {{ number_format((float) $value) }}
                                    @else
                                        {{ filled($value) ? $value : '-' }}
                                    @endif
                                </td>
                            @endforeach
                            <td class="px-5 py-4">
                                <?php if ($section === 'amenities'): ?>
                                    <div class="flex gap-2">
                                        <button type="submit" form="amenity-edit-{{ $row->id }}" class="inline-flex items-center gap-1 rounded-md bg-[#dff7f4] px-3 py-1.5 text-xs font-semibold text-[#008f86] transition hover:bg-[#c9f1ed]">
                                            <i data-lucide="pencil" class="h-3.5 w-3.5"></i>
                                            Edit
                                        </button>
                                        <form method="POST" action="{{ route('admin.amenities.delete', $row->id) }}" onsubmit="return confirm('Delete this amenity?');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="inline-flex items-center gap-1 rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100">
                                                <i data-lucide="trash-2" class="h-3.5 w-3.5"></i>
                                                Delete
                                            </button>
                                        </form>
                                    </div>
                                <?php endif; ?>

                                <?php if ($section === 'offers'): ?>
                                    <a href="#new-offer" class="inline-flex items-center gap-1 rounded-md bg-[#dff7f4] px-3 py-1.5 text-xs font-semibold text-[#008f86] transition hover:bg-[#c9f1ed]">
                                        <i data-lucide="pencil" class="h-3.5 w-3.5"></i>
                                        Edit
                                    </a>
                                <?php endif; ?>

                                <?php if ($section === 'expenses'): ?>
                                    <div class="flex gap-2">
                                        <a href="{{ route('admin.section', ['section' => 'expenses', 'edit' => $row->id]) }}#new-expense" class="inline-flex items-center gap-1 rounded-md bg-[#dff7f4] px-3 py-1.5 text-xs font-semibold text-[#008f86] transition hover:bg-[#c9f1ed]">
                                            <i data-lucide="pencil" class="h-3.5 w-3.5"></i>
                                            Edit
                                        </a>
                                        <form method="POST" action="{{ route('admin.expenses.delete', $row->id) }}" onsubmit="return confirm('Delete this expense?');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="inline-flex items-center gap-1 rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100">
                                                <i data-lucide="trash-2" class="h-3.5 w-3.5"></i>
                                                Delete
                                            </button>
                                        </form>
                                    </div>
                                <?php endif; ?>

                                <?php if ($section === 'properties'): ?>
                                    <div class="flex gap-2">
                                        <a href="{{ $openUrl }}" class="inline-flex items-center gap-1 rounded-md bg-[#dff7f4] px-3 py-1.5 text-xs font-semibold text-[#008f86] transition hover:bg-[#c9f1ed]">
                                            <i data-lucide="external-link" class="h-3.5 w-3.5"></i>
                                            Open
                                        </a>
                                        <a href="{{ route('admin.section', ['section' => 'properties', 'edit' => $row->id]) }}#new-property" class="inline-flex items-center gap-1 rounded-md bg-[#dff7f4] px-3 py-1.5 text-xs font-semibold text-[#008f86] transition hover:bg-[#c9f1ed]">
                                            <i data-lucide="pencil" class="h-3.5 w-3.5"></i>
                                            Edit
                                        </a>
                                        <form method="POST" action="{{ route('admin.properties.delete', $row) }}" onsubmit="return confirm('Delete this property?');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="inline-flex items-center gap-1 rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100">
                                                <i data-lucide="trash-2" class="h-3.5 w-3.5"></i>
                                                Delete
                                            </button>
                                        </form>
                                    </div>
                                <?php endif; ?>

                                <?php if ($section === 'blogs'): ?>
                                    <div class="flex gap-2">
                                        <a href="{{ $openUrl }}" class="inline-flex items-center gap-1 rounded-md bg-[#dff7f4] px-3 py-1.5 text-xs font-semibold text-[#008f86] transition hover:bg-[#c9f1ed]">
                                            <i data-lucide="external-link" class="h-3.5 w-3.5"></i>
                                            Open
                                        </a>
                                        <a href="{{ route('admin.section', ['section' => 'blogs', 'edit' => $row->id]) }}#new-blog" class="inline-flex items-center gap-1 rounded-md bg-[#dff7f4] px-3 py-1.5 text-xs font-semibold text-[#008f86] transition hover:bg-[#c9f1ed]">
                                            <i data-lucide="pencil" class="h-3.5 w-3.5"></i>
                                            Edit
                                        </a>
                                        <form method="POST" action="{{ route('admin.blogs.delete', $row) }}" onsubmit="return confirm('Delete this blog?');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="inline-flex items-center gap-1 rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100">
                                                <i data-lucide="trash-2" class="h-3.5 w-3.5"></i>
                                                Delete
                                            </button>
                                        </form>
                                    </div>
                                <?php endif; ?>

                                <?php if ($section === 'reviews'): ?>
                                    <div class="flex gap-2">
                                        <a href="{{ route('admin.section', ['section' => 'reviews', 'edit' => $row->id]) }}#new-review" class="inline-flex items-center gap-1 rounded-md bg-[#dff7f4] px-3 py-1.5 text-xs font-semibold text-[#008f86] transition hover:bg-[#c9f1ed]">
                                            <i data-lucide="pencil" class="h-3.5 w-3.5"></i>
                                            Edit
                                        </a>
                                        <form method="POST" action="{{ route('admin.reviews.delete', $row->id) }}" onsubmit="return confirm('Delete this review?');">
                                            @csrf
                                            @method('DELETE')
                                            <button type="submit" class="inline-flex items-center gap-1 rounded-md bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 transition hover:bg-red-100">
                                                <i data-lucide="trash-2" class="h-3.5 w-3.5"></i>
                                                Delete
                                            </button>
                                        </form>
                                    </div>
                                <?php endif; ?>

                                <?php if (! in_array($section, ['amenities', 'offers', 'expenses', 'reviews', 'properties', 'blogs'], true) && $openUrl): ?>
                                    <a href="{{ $openUrl }}" class="inline-flex items-center gap-1 rounded-md bg-[#dff7f4] px-3 py-1.5 text-xs font-semibold text-[#008f86] transition hover:bg-[#c9f1ed]">
                                        <i data-lucide="external-link" class="h-3.5 w-3.5"></i>
                                        {{ $section === 'orders' ? 'Receipt' : 'Open' }}
                                    </a>
                                <?php endif; ?>

                                <?php if (! in_array($section, ['amenities', 'offers', 'expenses', 'reviews', 'properties', 'blogs'], true) && ! $openUrl): ?>
                                    <span class="text-muted-foreground">-</span>
                                <?php endif; ?>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        </div>
    @endif
</section>
@endunless
@endsection
