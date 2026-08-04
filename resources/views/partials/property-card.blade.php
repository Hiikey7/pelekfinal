<article class="group relative overflow-hidden rounded-xl bg-card shadow-card transition-all hover:shadow-card-hover">
    <a href="{{ route('property.show', $property) }}" class="block" aria-label="View {{ $property->title }}">
        <div class="relative aspect-[16/11] overflow-hidden bg-muted">
            <img src="{{ $property->image ?: '/images/property-1.jpg' }}" alt="{{ $property->title }}" class="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105">
            <span class="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold capitalize text-secondary shadow-sm backdrop-blur">{{ str_replace('_', ' ', $property->category) }}</span>
        </div>
        <div class="p-5">
            <h3 class="mb-2 line-clamp-2 text-sm font-semibold text-card-foreground">{{ $property->title }}</h3>
            <p class="mb-4 flex items-center gap-1 text-xs text-muted-foreground"><i data-lucide="map-pin" class="h-3.5 w-3.5"></i>{{ $property->location }}</p>
            @php
                $stats = collect([
                    ['value' => $property->bedrooms, 'label' => 'bed'],
                    ['value' => $property->bathrooms, 'label' => 'bath'],
                    ['value' => $property->guests, 'label' => 'guest'],
                ])->filter(fn ($stat) => filled($stat['value']) && (int) $stat['value'] > 0);
            @endphp
            @if ($stats->isNotEmpty())
                <div class="mb-4 flex items-center gap-4 text-sm text-muted-foreground">
                    @foreach ($stats as $stat)
                        <span>{{ $stat['value'] }} {{ str($stat['label'])->plural((int) $stat['value']) }}</span>
                    @endforeach
                </div>
            @endif
            <div class="flex items-center justify-between">
                <div><span class="text-lg font-bold">KES {{ number_format((float) $property->price) }}</span><span class="text-xs text-muted-foreground"> {{ $property->price_label }}</span></div>
                <span class="text-sm font-semibold text-secondary">View</span>
            </div>
        </div>
    </a>
    <button type="button" data-wishlist-toggle data-wishlist-icon data-property-id="{{ $property->id }}" class="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-secondary shadow-sm backdrop-blur transition-colors hover:bg-secondary hover:text-white" aria-label="Add to Wishlist">
        <i data-lucide="heart" class="h-4 w-4"></i>
    </button>
</article>
