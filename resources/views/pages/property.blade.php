@extends('layouts.app')
@section('content')
<section class="py-10">
    <div class="container">
        <img src="{{ $property->image ?: '/images/property-1.jpg' }}" alt="{{ $property->title }}" class="mb-8 h-[420px] w-full rounded-2xl object-cover shadow-card">
        <div class="grid gap-8 lg:grid-cols-[1fr_360px]">
            <div><span class="text-sm font-semibold text-secondary">{{ str_replace('_',' ',ucfirst($property->category)) }}</span><h1 class="mt-2 text-4xl font-bold">{{ $property->title }}</h1><p class="mt-3 flex items-center gap-2 text-muted-foreground"><i data-lucide="map-pin" class="h-4 w-4"></i>{{ $property->location }}</p><p class="mt-6 leading-7 text-muted-foreground">{{ $property->description ?: 'Contact Pelek Properties for more details about this listing.' }}</p></div>
            <aside class="rounded-xl bg-white p-6 shadow-card"><p class="text-2xl font-bold">KES {{ number_format((float) $property->price) }}</p><p class="text-sm text-muted-foreground">{{ $property->price_label }}</p><a href="https://wa.me/{{ preg_replace('/[^0-9]/','',$property->whatsapp) }}" class="mt-6 flex items-center justify-center gap-2 rounded-xl bg-secondary px-6 py-3 font-semibold text-white"><i data-lucide="message-circle" class="h-4 w-4"></i> WhatsApp</a></aside>
        </div>
    </div>
</section>
@endsection
