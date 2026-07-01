<div>
    <div class="mb-8 grid gap-3 rounded-xl bg-white p-4 shadow-card md:grid-cols-[1fr_1fr_1fr_auto]">
        <select wire:model.live="category" class="rounded-lg border border-gray-200 px-3 py-2">
            <option value="">All categories</option>
            <option value="airbnb">Airbnb</option>
            <option value="rental">Rental</option>
            <option value="sale">For Sale</option>
            <option value="commercial_spaces">Commercial</option>
        </select>
        <input wire:model.live.debounce.350ms="location" placeholder="Location" class="rounded-lg border border-gray-200 px-3 py-2">
        <input wire:model.live.debounce.350ms="maxPrice" placeholder="Max price" class="rounded-lg border border-gray-200 px-3 py-2">
        <button type="button" class="rounded-lg bg-secondary px-5 py-2 font-semibold text-white">Filter</button>
    </div>
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        @forelse($properties as $property)
            @include('partials.property-card', ['property' => $property])
        @empty
            <p class="col-span-full rounded-xl bg-white p-8 text-center text-muted-foreground shadow-card">No properties match your filters yet.</p>
        @endforelse
    </div>
    <div class="mt-8">{{ $properties->links() }}</div>
</div>
