@extends('layouts.app')
@section('content')
<article class="container max-w-3xl py-12"><img src="{{ $blog->image ?: '/images/property-3.jpg' }}" class="mb-8 aspect-[16/9] w-full rounded-2xl object-cover shadow-card" alt="{{ $blog->title }}"><span class="text-sm font-semibold text-secondary">{{ $blog->category }}</span><h1 class="mt-2 text-4xl font-bold">{{ $blog->title }}</h1><p class="mt-2 text-sm text-muted-foreground">{{ $blog->date }} · {{ $blog->read_time }}</p><div class="prose mt-8 max-w-none">{!! nl2br(e($blog->content ?: $blog->excerpt)) !!}</div></article>
@endsection
