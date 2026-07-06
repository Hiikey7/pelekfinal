@extends('layouts.app')
@section('content')
<section class="relative flex h-screen items-center justify-center overflow-hidden">
    <img src="/images/hero-bg.jpg" alt="Luxury property" class="absolute inset-0 h-full w-full object-cover object-center">
    <div class="absolute inset-0 bg-primary/70"></div>
    <div class="container relative z-10 text-center">
        <h1 class="mb-6 text-4xl font-bold text-primary-foreground md:text-6xl lg:text-7xl">Find Your Dream <br><span class="text-secondary">Property</span></h1>
        <p class="mx-auto mb-8 max-w-2xl text-lg text-white/80 md:text-xl">Luxury Airbnb stays, premium rentals, properties for sale, and commercial spaces like offices across Kenya</p>
        <form action="/properties" class="mx-auto w-[82%] max-w-xl rounded-xl bg-white/95 p-3 shadow-card backdrop-blur-xl md:w-[78%]">
            <div class="space-y-2.5">
                <div class="grid grid-cols-2 gap-1 rounded-md bg-muted p-1 sm:grid-cols-4">
                    @foreach([['airbnb','Airbnb'],['rental','Rental'],['sale','For Sale'],['commercial_spaces','Commercial']] as [$value,$label])
                        <label class="cursor-pointer">
                            <input type="checkbox" name="category[]" value="{{ $value }}" class="peer sr-only">
                            <span class="flex min-h-7 items-center justify-center rounded bg-secondary/10 px-2 py-1 text-xs font-medium text-secondary transition-colors hover:bg-secondary/15 peer-checked:bg-primary peer-checked:text-white">
                                {{ $label }}
                            </span>
                        </label>
                    @endforeach
                </div>
                <div class="grid grid-cols-1 gap-2.5 md:grid-cols-[1fr_1fr_auto]">
                    <input name="location" placeholder="Location" class="rounded-md border border-gray-300 bg-muted px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#06c6b6]">
                    <input name="maxPrice" placeholder="Max price" class="rounded-md border border-gray-300 bg-muted px-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-[#06c6b6]">
                    <button class="flex min-h-8 items-center justify-center gap-2 rounded-md bg-secondary px-4 py-1.5 text-sm font-semibold text-white"><i data-lucide="search" class="h-4 w-4"></i> Search</button>
                </div>
            </div>
        </form>
    </div>
</section>

@if($featured->count())
<section class="py-16 md:py-24">
    <div class="container">
        <div class="mb-10 flex items-end justify-between">
            <div><h2 class="text-3xl font-bold md:text-4xl">Featured Properties</h2><p class="mt-2 text-muted-foreground">Hand-picked properties for you</p></div>
            <a href="/properties" class="hidden items-center gap-1 text-sm font-medium text-secondary hover:underline md:flex">View All <i data-lucide="arrow-right" class="h-4 w-4"></i></a>
        </div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            @foreach($featured as $property)
                @include('partials.property-card', ['property' => $property])
            @endforeach
        </div>
    </div>
</section>
@endif

<section class="bg-muted py-16 md:py-24">
    <div class="container">
        <div class="mx-auto flex max-w-5xl flex-col items-center gap-8 md:flex-row md:gap-12">
            <div class="w-full md:w-1/2"><img src="/images/property-1.jpg" alt="Our Services" class="h-64 w-full rounded-2xl object-cover shadow-card md:h-80"></div>
            <div class="w-full md:w-1/2">
                <h2 class="mb-3 text-3xl font-bold md:text-4xl">Our Services</h2>
                <p class="mb-6 leading-relaxed text-muted-foreground">Comprehensive property solutions tailored to your needs. From management to sales, we've got you covered.</p>
                <ul class="mb-8 space-y-3">
                    @foreach([['building-2','Property Management'],['home','Real Estate Sales'],['chart-column','Property Valuation'],['key','Rentals & Airbnb'],['briefcase','Commercial Solutions']] as [$icon,$text])
                        <li class="flex items-center gap-3"><i data-lucide="{{ $icon }}" class="h-5 w-5 flex-shrink-0 text-secondary"></i>{{ $text }}</li>
                    @endforeach
                </ul>
                <a href="/services" class="inline-flex items-center gap-2 rounded-lg bg-secondary px-6 py-3 font-medium text-white">View All Services <i data-lucide="arrow-right" class="h-4 w-4"></i></a>
            </div>
        </div>
    </div>
</section>

@if($reviews->count())
<section class="bg-muted py-16">
    <div class="container">
        <h2 class="mb-4 text-center text-3xl font-bold md:text-4xl">What Our Clients Say</h2>
        <div class="mb-10 flex items-center justify-center gap-1">
            @for($i=0;$i<5;$i++)<i data-lucide="star" class="h-5 w-5 fill-[#06c6b6] text-[#06c6b6]"></i>@endfor
            <span class="ml-2 font-semibold">4.8</span><span class="text-sm text-muted-foreground">from Google Reviews</span>
        </div>
        <div class="mx-auto grid max-w-5xl gap-4 md:grid-cols-3">
            @foreach($reviews->take(3) as $review)
                <article class="rounded-xl bg-card p-6 shadow-card">
                    <div class="mb-4 flex items-center gap-3"><div class="flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-sm font-semibold text-secondary">{{ $review->avatar ?: substr($review->name,0,1) }}</div><div><p class="text-sm font-semibold">{{ $review->name }}</p><p class="text-xs text-muted-foreground">{{ $review->date }}</p></div></div>
                    <p class="text-sm leading-relaxed text-muted-foreground">{{ $review->comment }}</p>
                </article>
            @endforeach
        </div>
    </div>
</section>
@endif

@if($blogs->count())
<section class="py-16 md:py-24">
    <div class="container">
        <div class="mb-10 flex items-end justify-between"><div><h2 class="text-3xl font-bold md:text-4xl">Recent Blogs</h2><p class="mt-2 text-muted-foreground">Tips, guides, and insights</p></div><a href="/blog" class="hidden text-sm font-medium text-secondary md:flex">View All</a></div>
        <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
            @foreach($blogs as $post)
                <article class="overflow-hidden rounded-xl bg-card shadow-card"><img src="{{ $post->image ?: '/images/property-2.jpg' }}" alt="{{ $post->title }}" class="aspect-[16/10] w-full object-cover"><div class="p-5"><span class="text-xs font-medium text-secondary">{{ $post->category }}</span><h3 class="mt-1 mb-2 line-clamp-2 font-semibold">{{ $post->title }}</h3><p class="mb-3 line-clamp-2 text-sm text-muted-foreground">{{ $post->excerpt }}</p><a href="{{ route('blog.show',$post) }}" class="text-xs font-medium text-secondary">Read More</a></div></article>
            @endforeach
        </div>
    </div>
</section>
@endif

<section class="bg-hero-gradient py-16 text-center md:py-24">
    <div class="container">
        <h2 class="mb-4 text-3xl font-bold text-primary-foreground md:text-4xl">Need Help Finding a Property?</h2>
        <p class="mx-auto mb-8 max-w-xl text-white/80">Our team is ready to help you find the perfect property. Get in touch today.</p>
        <div class="flex flex-col justify-center gap-4 sm:flex-row"><a href="/contact" class="rounded-xl bg-white px-8 py-3 font-semibold">Contact Us</a><a href="https://wa.me/254711614099" class="flex items-center justify-center gap-2 rounded-xl bg-secondary px-8 py-3 font-semibold text-white"><i data-lucide="message-circle" class="h-4 w-4"></i> WhatsApp</a></div>
    </div>
</section>

<section class="bg-muted py-16">
    <div class="container max-w-3xl">
        <h2 class="mb-10 text-center text-3xl font-bold md:text-4xl">Frequently Asked Questions</h2>
        <div class="space-y-3">
            @foreach($faqs as $faq)
                <div class="rounded-lg bg-white p-4 shadow-card" data-faq-item><button class="flex w-full items-center justify-between text-left font-medium" data-faq-trigger>{{ $faq['question'] }}<i data-lucide="chevron-down" class="h-4 w-4"></i></button><p class="mt-3 hidden text-muted-foreground" data-faq-panel>{{ $faq['answer'] }}</p></div>
            @endforeach
        </div>
    </div>
</section>
@endsection
