@extends('layouts.admin', ['title' => 'Dashboard'])

@section('content')
<div class="mb-7">
    <h1 class="text-3xl font-bold">Dashboard</h1>
</div>

@php
    $statCards = [
        ['label' => 'Properties', 'value' => $stats['properties'] ?? 0, 'icon' => 'home', 'url' => route('admin.section', 'properties')],
        ['label' => 'Orders', 'value' => $stats['orders'] ?? 0, 'icon' => 'shopping-cart', 'url' => route('admin.section', 'orders')],
        ['label' => 'Blogs', 'value' => $stats['blogs'] ?? 0, 'icon' => 'file-text', 'url' => route('admin.section', 'blogs')],
        ['label' => 'Reviews', 'value' => $stats['reviews'] ?? 0, 'icon' => 'star', 'url' => route('admin.section', 'reviews')],
        ['label' => 'Offers', 'value' => $stats['offers'] ?? 0, 'icon' => 'gift', 'url' => route('admin.section', 'offers')],
        ['label' => 'Expenses', 'value' => $stats['expenses'] ?? 0, 'icon' => 'receipt', 'url' => route('admin.section', 'expenses')],
    ];
@endphp

<section class="grid gap-4 sm:grid-cols-2 xl:grid-cols-6">
    @foreach ($statCards as $card)
        <a href="{{ $card['url'] }}" class="rounded-lg bg-white p-5 shadow-card transition hover:-translate-y-0.5 hover:shadow-card-hover">
            <i data-lucide="{{ $card['icon'] }}" class="mb-4 h-6 w-6 text-[#00bfb3]"></i>
            <div class="text-3xl font-bold">{{ number_format($card['value']) }}</div>
            <div class="mt-1 text-sm text-muted-foreground">{{ $card['label'] }}</div>
        </a>
    @endforeach
</section>

<section class="mt-6 rounded-lg bg-hero-gradient p-6 text-white shadow-card">
    <div class="flex items-start gap-4">
        <div class="flex h-10 w-10 items-center justify-center rounded-lg bg-white/10">
            <i data-lucide="dollar-sign" class="h-5 w-5"></i>
        </div>
        <div>
            <p class="text-sm font-semibold text-white/80">Total Earnings</p>
            <p class="mt-2 text-3xl font-bold">KES {{ number_format($totalEarnings ?? 0) }}</p>
            <p class="mt-1 text-sm text-white/75">{{ number_format($stats['orders'] ?? 0) }} total orders recorded</p>
        </div>
    </div>
</section>

<section class="mt-6 grid gap-6 xl:grid-cols-2">
    <article class="rounded-lg bg-white p-5 shadow-card">
        <div class="mb-4 flex items-center gap-2">
            <i data-lucide="trending-up" class="h-4 w-4 text-[#00bfb3]"></i>
            <h2 class="text-sm font-bold">Earnings Over Time</h2>
        </div>

        @if ($monthlyEarnings->isEmpty())
            <div class="flex min-h-[140px] items-center justify-center text-sm text-muted-foreground">No order data yet</div>
        @else
            <div class="space-y-3">
                @foreach ($monthlyEarnings as $month)
                    @php($percent = $totalEarnings > 0 ? min(100, (((float) $month->total / (float) $totalEarnings) * 100)) : 0)
                    <div>
                        <div class="mb-1 flex justify-between text-xs text-muted-foreground">
                            <span>{{ $month->label }}</span>
                            <span>KES {{ number_format((float) $month->total) }}</span>
                        </div>
                        <div class="h-2 rounded-full bg-muted">
                            <div class="h-2 rounded-full bg-[#00bfb3]" style="width: {{ $percent }}%"></div>
                        </div>
                    </div>
                @endforeach
            </div>
        @endif
    </article>

    <article class="rounded-lg bg-white p-5 shadow-card">
        <div class="mb-4 flex items-center gap-2">
            <i data-lucide="eye" class="h-4 w-4 text-[#00bfb3]"></i>
            <h2 class="text-sm font-bold">Most Booked Properties</h2>
        </div>

        @if ($popularProperties->isEmpty())
            <div class="flex min-h-[140px] items-center justify-center text-sm text-muted-foreground">No order data yet</div>
        @else
            <div class="space-y-3">
                @foreach ($popularProperties as $property)
                    <div class="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
                        <span class="truncate text-sm font-medium">{{ $property->property_title }}</span>
                        <span class="text-sm font-bold text-primary">{{ $property->bookings }}</span>
                    </div>
                @endforeach
            </div>
        @endif
    </article>

    <article class="rounded-lg bg-white p-5 shadow-card">
        <div class="mb-4 flex items-center gap-2">
            <i data-lucide="credit-card" class="h-4 w-4 text-[#00bfb3]"></i>
            <h2 class="text-sm font-bold">Payment Methods</h2>
        </div>

        @if ($paymentMethods->isEmpty())
            <div class="flex min-h-[140px] items-center justify-center text-sm text-muted-foreground">No payment data yet</div>
        @else
            <div class="space-y-3">
                @foreach ($paymentMethods as $method)
                    <div class="flex items-center justify-between rounded-lg bg-muted px-3 py-2">
                        <span class="capitalize text-sm font-medium">{{ $method->payment_method ?: 'Unknown' }}</span>
                        <span class="text-sm font-bold text-primary">{{ $method->total }}</span>
                    </div>
                @endforeach
            </div>
        @endif
    </article>

    <article class="rounded-lg bg-white p-5 shadow-card">
        <div class="mb-4 flex items-center justify-between gap-2">
            <div class="flex items-center gap-2">
                <i data-lucide="shopping-cart" class="h-4 w-4 text-[#00bfb3]"></i>
                <h2 class="text-sm font-bold">Recent Orders</h2>
            </div>
            <a href="{{ route('admin.section', 'orders') }}" class="text-xs font-semibold text-[#00bfb3]">View all</a>
        </div>

        @if ($recentOrders->isEmpty())
            <div class="flex min-h-[140px] items-center justify-center text-sm text-muted-foreground">No recent orders</div>
        @else
            <div class="space-y-3">
                @foreach ($recentOrders as $order)
                    <a href="{{ route('orders.receipt', $order) }}" class="flex items-center justify-between rounded-lg bg-muted px-3 py-2 transition hover:bg-[#dff7f4]">
                        <div class="min-w-0">
                            <p class="truncate text-sm font-semibold">{{ $order->visitor_name }}</p>
                            <p class="truncate text-xs text-muted-foreground">{{ $order->property_title ?: 'No property title' }}</p>
                        </div>
                        <span class="text-sm font-bold text-primary">KES {{ number_format((float) $order->total_amount) }}</span>
                    </a>
                @endforeach
            </div>
        @endif
    </article>
</section>
@endsection
