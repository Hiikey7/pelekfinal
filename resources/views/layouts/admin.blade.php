<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="theme-color" content="#00332c">
    <title>{{ $title ?? 'Admin Dashboard' }} | Pelek Properties</title>
    <link rel="icon" href="/favicon.ico">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700&family=Space+Grotesk:wght@600;700&display=swap" rel="stylesheet">
    @vite(['resources/css/app.css', 'resources/js/app.js'])
</head>
<body class="min-h-screen bg-[#eef3f1] text-foreground">
    <div class="min-h-screen lg:grid lg:grid-cols-[256px_1fr]">
        <aside class="border-b border-border bg-white lg:sticky lg:top-0 lg:h-screen lg:border-b-0 lg:border-r">
            <div class="flex h-full flex-col">
                <div class="px-6 py-7">
                    <a href="{{ route('admin.dashboard') }}" class="block">
                        <span class="text-lg font-bold text-primary">Pelek Properties</span>
                        <span class="mt-1 block text-xs text-muted-foreground">Admin Dashboard</span>
                    </a>
                </div>

                @php
                    $navItems = [
                        ['key' => 'dashboard', 'label' => 'Dashboard', 'icon' => 'layout-dashboard', 'url' => route('admin.dashboard')],
                        ['key' => 'properties', 'label' => 'Properties', 'icon' => 'home', 'url' => route('admin.section', 'properties')],
                        ['key' => 'blogs', 'label' => 'Blogs', 'icon' => 'file-text', 'url' => route('admin.section', 'blogs')],
                        ['key' => 'reviews', 'label' => 'Reviews', 'icon' => 'star', 'url' => route('admin.section', 'reviews')],
                        ['key' => 'expenses', 'label' => 'Expenses', 'icon' => 'receipt', 'url' => route('admin.section', 'expenses')],
                        ['key' => 'offers', 'label' => 'Offers', 'icon' => 'gift', 'url' => route('admin.section', 'offers')],
                        ['key' => 'orders', 'label' => 'Orders', 'icon' => 'shopping-cart', 'url' => route('admin.section', 'orders')],
                        ['key' => 'amenities', 'label' => 'Amenities', 'icon' => 'list-checks', 'url' => route('admin.section', 'amenities')],
                        ['key' => 'settings', 'label' => 'Settings', 'icon' => 'settings', 'url' => route('admin.section', 'settings')],
                    ];
                @endphp

                <nav class="grid gap-1 px-4 pb-6">
                    @foreach ($navItems as $item)
                        <a href="{{ $item['url'] }}" class="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition {{ ($currentSection ?? '') === $item['key'] ? 'bg-[#dff7f4] text-[#00bfb3]' : 'text-muted-foreground hover:bg-muted hover:text-primary' }}">
                            <i data-lucide="{{ $item['icon'] }}" class="h-4 w-4"></i>
                            {{ $item['label'] }}
                        </a>
                    @endforeach
                </nav>

                <div class="mt-auto border-t border-border p-4">
                    <a href="{{ route('home') }}" class="flex items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-primary">
                        <i data-lucide="external-link" class="h-4 w-4"></i>
                        View Website
                    </a>
                    <form method="POST" action="{{ route('admin.logout') }}">
                        @csrf
                        <button type="submit" class="flex w-full items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium text-muted-foreground transition hover:bg-muted hover:text-primary">
                            <i data-lucide="log-out" class="h-4 w-4"></i>
                            Sign Out
                        </button>
                    </form>
                </div>
            </div>
        </aside>

        <main class="min-w-0 px-4 py-8 sm:px-8 lg:px-8">
            @yield('content')
        </main>
    </div>
</body>
</html>
