@php($links = [['/', 'Home'], ['/properties', 'Properties'], ['/blog', 'Blog'], ['/contact', 'Contact']])
<nav class="fixed inset-x-0 top-0 z-50 border-b border-gray-200 bg-white">
    <div class="mx-auto flex h-16 w-[90%] items-center justify-between">
        <a href="/" class="flex select-none items-center" aria-label="Pelek Properties home" data-admin-logo>
            <img src="/logo-nav.png" alt="Pelek Properties" class="h-20 w-auto" width="160" height="80" draggable="false">
        </a>
        <div class="hidden items-center gap-8 md:flex">
            @foreach($links as [$href, $label])
                <a href="{{ $href }}" class="text-sm font-medium transition-colors {{ request()->path() === trim($href, '/') || (request()->is('/') && $href === '/') ? 'text-[#06c6b6]' : 'text-muted-foreground hover:text-[#06c6b6]' }}">{{ $label }}</a>
            @endforeach
        </div>
        <a href="/properties?category=airbnb" class="hidden rounded-lg bg-[#06c6b6] px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-[#05b3a3] md:inline-flex">Book Now</a>
        <button type="button" class="rounded-lg p-2 text-foreground hover:bg-muted md:hidden" data-mobile-menu-button aria-label="Open menu">
            <i data-lucide="menu" class="h-5 w-5"></i>
        </button>
    </div>
    <div class="hidden border-b border-gray-200 bg-white md:hidden" data-mobile-menu>
        <div class="mx-auto flex w-[90%] flex-col gap-1 py-4">
            @foreach([...$links, ['/favorites', 'Favourites']] as [$href, $label])
                <a href="{{ $href }}" class="rounded-lg px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:text-[#06c6b6]">{{ $label }}</a>
            @endforeach
        </div>
    </div>
    <a href="/favorites" class="fixed bottom-6 right-6 z-50 hidden rounded-full bg-[#06c6b6] p-4 text-white shadow-lg transition-colors hover:bg-[#05b3a3] md:block" aria-label="Favourites">
        <i data-lucide="heart" class="h-6 w-6"></i>
    </a>
</nav>
