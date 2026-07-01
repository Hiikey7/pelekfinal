@extends('layouts.app')
@section('content')
<section class="bg-muted py-14">
    <div class="container"><h1 class="text-4xl font-bold">Properties</h1><p class="mt-2 text-muted-foreground">Browse Airbnb stays, rentals, homes for sale, and commercial spaces.</p></div>
</section>
<section class="py-12"><div class="container"><livewire:property-search /></div></section>
@endsection
