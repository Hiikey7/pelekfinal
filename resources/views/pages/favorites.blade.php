@extends('layouts.app')
@section('content')
<section class="bg-muted py-14">
    <div class="container">
        <h1 class="text-4xl font-bold">Favourites</h1>
        <p class="mt-2 text-muted-foreground">Saved properties will appear here.</p>
    </div>
</section>
<section class="py-12">
    <div class="container">
        <div data-favorites-empty class="hidden rounded-2xl border border-border bg-white p-10 text-center">
            <p class="mb-4 text-muted-foreground">No favourites yet. Start exploring properties.</p>
            <a href="/properties" class="inline-flex rounded-full bg-secondary px-6 py-3 text-white transition-colors hover:bg-secondary/90">Browse Properties</a>
        </div>

        <div data-favorites-grid class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            @foreach ($properties as $property)
                <div data-favorite-card="{{ $property->id }}" class="hidden">
                    @include('partials.property-card', ['property' => $property])
                </div>
            @endforeach
        </div>
    </div>
</section>
@endsection
