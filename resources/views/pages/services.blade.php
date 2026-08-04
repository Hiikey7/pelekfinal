@extends('layouts.app')
@section('content')
<section class="bg-muted py-14"><div class="container"><h1 class="text-4xl font-bold">Services</h1><p class="mt-2 text-muted-foreground">Property management, sales, valuation, rentals, Airbnb, and commercial solutions.</p></div></section>
<section class="py-12"><div class="container grid gap-6 md:grid-cols-3">@foreach(['Property Management','Real Estate Sales','Property Valuation','Rentals & Airbnb','Commercial Solutions','Guest Support'] as $service)<div class="rounded-xl bg-white p-6 shadow-card"><i data-lucide="check-circle" class="mb-4 h-6 w-6 text-secondary"></i><h2 class="font-semibold">{{ $service }}</h2><p class="mt-2 text-sm text-muted-foreground">Professional support from Pelek Properties with clear communication and reliable execution.</p></div>@endforeach</div></section>
@endsection
