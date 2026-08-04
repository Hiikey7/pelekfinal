@php($activeOffer = \App\Models\Offer::query()->where('active', true)->latest()->first())

@if ($activeOffer)
    <div class="fixed inset-0 z-[100] hidden items-center justify-center bg-black/50 px-4 py-8" data-offer-popup>
        <div class="relative w-full max-w-lg overflow-hidden rounded-xl bg-white shadow-2xl">
            <button type="button" class="absolute right-3 top-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-foreground shadow transition hover:bg-muted" data-offer-close aria-label="Close offer">
                <i data-lucide="x" class="h-5 w-5"></i>
            </button>

            @if ($activeOffer->image)
                <img src="{{ $activeOffer->image }}" alt="{{ $activeOffer->title }}" class="h-52 w-full object-cover">
            @endif

            <div class="p-6">
                <p class="mb-2 text-xs font-bold uppercase tracking-wide text-[#00bfb3]">Special Offer</p>
                <h2 class="text-2xl font-bold">{{ $activeOffer->title }}</h2>
                <p class="mt-3 text-sm leading-6 text-muted-foreground">{{ $activeOffer->description }}</p>

                @if ($activeOffer->offer_type === 'promo_code')
                    <div class="mt-5 rounded-lg border border-dashed border-[#00bfb3] bg-[#e4faf8] p-4">
                        <p class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Voucher Code</p>
                        <div class="mt-2 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <code class="rounded-md bg-white px-3 py-2 text-lg font-bold text-primary">{{ $activeOffer->promo_code }}</code>
                            <button type="button" class="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-primary/90" data-copy-offer="{{ $activeOffer->promo_code }}">
                                <i data-lucide="copy" class="h-4 w-4"></i>
                                Copy Code
                            </button>
                        </div>
                    </div>
                @else
                    <a href="{{ $activeOffer->cta_link ?: '/' }}" class="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-[#00bfb3] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#00aaa0]">
                        {{ $activeOffer->cta_text ?: 'View Now' }}
                        <i data-lucide="arrow-right" class="h-4 w-4"></i>
                    </a>
                @endif
            </div>
        </div>
    </div>
@endif
