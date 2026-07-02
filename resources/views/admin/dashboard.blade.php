@extends('layouts.app')
@section('content')
<section class="container py-12">
    <div class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
            <h1 class="text-3xl font-bold">Admin Dashboard</h1>
            <p class="mt-2 text-muted-foreground">Manage Pelek Properties content and workflows.</p>
        </div>

        <form method="POST" action="{{ route('admin.logout') }}">
            @csrf
            <button type="submit" class="rounded-lg border border-border px-4 py-2 text-sm font-semibold transition hover:bg-muted">
                Sign out
            </button>
        </form>
    </div>

    <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div class="rounded-xl bg-white p-5 shadow-card">
            <h2 class="font-semibold">Properties</h2>
            <p class="mt-2 text-sm text-muted-foreground">Property listings management.</p>
        </div>
        <div class="rounded-xl bg-white p-5 shadow-card">
            <h2 class="font-semibold">Blog</h2>
            <p class="mt-2 text-sm text-muted-foreground">News and market updates.</p>
        </div>
        <div class="rounded-xl bg-white p-5 shadow-card">
            <h2 class="font-semibold">Orders</h2>
            <p class="mt-2 text-sm text-muted-foreground">Receipt and booking workflows.</p>
        </div>
        <div class="rounded-xl bg-white p-5 shadow-card">
            <h2 class="font-semibold">Reports</h2>
            <p class="mt-2 text-sm text-muted-foreground">Operational summaries.</p>
        </div>
    </div>
</section>
@endsection
