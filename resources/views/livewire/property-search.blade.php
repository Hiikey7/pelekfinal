<div>
    <div class="mb-8 space-y-3 rounded-xl bg-white p-3 shadow-card sm:p-4">
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
        <div class="grid gap-3 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_9.5rem_auto]">
        <input wire:model.live.debounce.350ms="location" placeholder="Location" class="rounded-lg border border-gray-200 px-3 py-2">
        <input wire:model.live.debounce.350ms="maxPrice" placeholder="Max price" class="rounded-lg border border-gray-200 px-3 py-2">
        <div class="relative" data-multiselect>
            <button type="button" class="flex min-h-10 w-full items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-left text-sm outline-none transition focus:border-[#06c6b6] focus:ring-2 focus:ring-[#06c6b6]/20" data-multiselect-trigger>
                <span data-multiselect-label data-placeholder="Bedrooms">
                    {{ count($selectedBedrooms) ? count($selectedBedrooms).' selected' : 'Bedrooms' }}
                </span>
                <i data-lucide="chevron-down" class="h-4 w-4 text-secondary"></i>
            </button>
            <div class="absolute right-0 top-[calc(100%+0.35rem)] z-30 hidden w-44 rounded-lg border border-secondary/20 bg-white p-1.5 shadow-card" data-multiselect-panel>
                @foreach ([['0', 'Studio'], ['1', '1 Bedroom'], ['2', '2 Bedrooms'], ['3', '3 Bedrooms'], ['4', '4 Bedrooms'], ['5', '5 Bedrooms'], ['6', '6 Bedrooms'], ['7', '7 Bedrooms']] as [$value, $label])
                    <label class="flex cursor-pointer items-center gap-2 rounded-md px-2 py-1 text-xs font-semibold text-primary transition hover:bg-secondary/10">
                        <input type="checkbox" wire:model.live="bedrooms" value="{{ $value }}" data-multiselect-option-label="{{ $label }}" class="h-3.5 w-3.5 rounded border-border accent-[#06c6b6]">
                        <span class="whitespace-nowrap">{{ $label }}</span>
                    </label>
                @endforeach
            </div>
        </div>
        <button type="button" class="rounded-lg bg-secondary px-5 py-2 font-semibold text-white">Filter</button>
        </div>
    </div>
    @if ($showingSimilar)
        <div class="mb-5 rounded-xl border border-secondary/20 bg-secondary/10 px-4 py-3 text-sm font-medium text-primary">
            No exact matches found. Showing similar properties that match some of your filters.
        </div>
    @endif
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
