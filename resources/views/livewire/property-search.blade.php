<div>
    <div class="mb-8 space-y-3 rounded-xl bg-white p-4 shadow-card">
        <div class="grid grid-cols-2 gap-2 sm:grid-cols-4">
            @foreach ([['airbnb', 'Airbnb'], ['rental', 'Rental'], ['sale', 'For Sale'], ['commercial_spaces', 'Commercial']] as [$value, $label])
                <label class="cursor-pointer">
                    <input type="checkbox" wire:model.live="category" value="{{ $value }}" class="peer sr-only">
                    <span class="flex min-h-10 items-center justify-center rounded-lg bg-secondary/10 px-4 py-2 text-sm font-semibold text-secondary transition-colors hover:bg-secondary/15 peer-checked:bg-primary peer-checked:text-white">
                        {{ $label }}
                    </span>
                </label>
            @endforeach
        </div>
        <div class="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
        <input wire:model.live.debounce.350ms="location" placeholder="Location" class="rounded-lg border border-gray-200 px-3 py-2">
        <input wire:model.live.debounce.350ms="maxPrice" placeholder="Max price" class="rounded-lg border border-gray-200 px-3 py-2">
        <button type="button" class="rounded-lg bg-secondary px-5 py-2 font-semibold text-white">Filter</button>
        </div>
    </div>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        @forelse($properties as $property)
            @include('partials.property-card', ['property' => $property])
        @empty
            <div class="col-span-full rounded-xl bg-white p-8 text-center shadow-card">
                <p class="text-muted-foreground">No properties match your filters yet.</p>
                @if ($hasFilters)
                    <button type="button" wire:click="clearFilters" class="mt-4 rounded-lg bg-secondary px-5 py-2 text-sm font-semibold text-white hover:bg-primary">
                        Clear Filter
                    </button>
                @endif
            </div>
        @endforelse
    </div>
    <div class="mt-8">{{ $properties->links() }}</div>
</div>
