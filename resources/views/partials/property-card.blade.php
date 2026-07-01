<article class="group overflow-hidden rounded-xl bg-card shadow-card transition-all hover:shadow-card-hover">
    <a href="{{ route('property.show', $property) }}" class="block aspect-[16/11] overflow-hidden bg-muted">
        <img src="{{ $property->image ?: '/images/property-1.jpg' }}" alt="{{ $property->title }}" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105">
    </a>
    <div class="p-5">
        <div class="mb-2 flex items-center justify-between gap-3">
            <span class="rounded-full bg-secondary/10 px-3 py-1 text-xs font-semibold capitalize text-secondary">{{ str_replace('_', ' ', $property->category) }}</span>
            <span class="flex items-center gap-1 text-sm font-semibold"><i data-lucide="star" class="h-4 w-4 fill-[#06c6b6] text-[#06c6b6]"></i>{{ $property->rating ?: '4.8' }}</span>
        </div>
        <h3 class="mb-2 line-clamp-2 font-semibold text-card-foreground">{{ $property->title }}</h3>
        <p class="mb-4 flex items-center gap-1 text-sm text-muted-foreground"><i data-lucide="map-pin" class="h-4 w-4"></i>{{ $property->location }}</p>
        <div class="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
            <span>{{ $property->bedrooms }} beds</span><span>{{ $property->bathrooms }} baths</span><span>{{ $property->guests ?: 2 }} guests</span>
        </div>
        <div class="flex items-center justify-between">
            <div><span class="text-lg font-bold">KES {{ number_format((float) $property->price) }}</span><span class="text-xs text-muted-foreground"> {{ $property->price_label }}</span></div>
            <a href="{{ route('property.show', $property) }}" class="text-sm font-semibold text-secondary">View</a>
        </div>
    </div>
</article>
