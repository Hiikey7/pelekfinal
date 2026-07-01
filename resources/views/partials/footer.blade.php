@php($settings = $settings ?? \App\Http\Controllers\PageController::settings())
<footer class="bg-primary pb-20 text-primary-foreground md:pb-0">
    <div class="container py-12">
        <div class="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div>
                <h3 class="mb-4 text-xl font-bold">Pelek Properties</h3>
                <p class="text-sm leading-relaxed opacity-80">Your trusted partner for luxury Airbnb stays, rentals, and property sales across Kenya.</p>
            </div>
            <div>
                <h4 class="mb-4 font-semibold">Quick Links</h4>
                <div class="flex flex-col gap-2 text-sm opacity-80">
                    <a href="/properties">Properties</a><a href="/blog">Blog</a><a href="/faq">FAQ</a><a href="/contact">Contact</a>
                </div>
            </div>
            <div>
                <h4 class="mb-4 font-semibold">Categories</h4>
                <div class="flex flex-col gap-2 text-sm opacity-80">
                    <a href="/properties?category=airbnb">Airbnb Stays</a><a href="/properties?category=rental">Rentals</a><a href="/properties?category=sale">For Sale</a><a href="/properties?category=commercial_spaces">Commercial spaces</a>
                </div>
            </div>
            <div>
                <h4 class="mb-4 font-semibold">Contact</h4>
                <div class="flex flex-col gap-3 text-sm opacity-80">
                    <div class="flex items-center gap-2"><i data-lucide="map-pin" class="h-4 w-4"></i> Nairobi, Kenya</div>
                    <a href="https://wa.me/{{ preg_replace('/[^0-9]/', '', $settings['whatsapp'] ?? '+254711614099') }}" class="flex items-center gap-2"><i data-lucide="phone" class="h-4 w-4"></i> {{ $settings['whatsapp'] ?? '+254711614099' }}</a>
                    <div class="flex items-center gap-2"><i data-lucide="mail" class="h-4 w-4"></i> info@pelekproperties.co.ke</div>
                </div>
            </div>
        </div>
        <div class="mt-8 flex flex-col items-center justify-center gap-2 border-t border-white/20 pt-8 text-center text-sm opacity-60 sm:flex-row">
            <span>&copy; {{ date('Y') }} Pelek Properties. All rights reserved.</span>
            <span class="hidden sm:inline">.</span>
            <a href="/terms" class="underline">Terms of Service</a>
        </div>
    </div>
</footer>
