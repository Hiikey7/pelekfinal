@extends('layouts.app')
@section('content')
<section class="container max-w-md py-16">
    <div class="rounded-xl bg-white p-6 shadow-card">
        <h1 class="mb-2 text-2xl font-bold">Admin Login</h1>
        <p class="mb-6 text-sm text-muted-foreground">Sign in to manage Pelek Properties content.</p>

        @if ($errors->any())
            <div class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {{ $errors->first() }}
            </div>
        @endif

        <form method="POST" action="{{ route('admin.authenticate') }}" class="space-y-4">
            @csrf
            <div>
                <label for="email" class="mb-2 block text-sm font-semibold">Email</label>
                <input
                    id="email"
                    name="email"
                    type="email"
                    value="{{ old('email') }}"
                    required
                    autofocus
                    class="w-full rounded-lg border border-border px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
            </div>

            <div>
                <label for="password" class="mb-2 block text-sm font-semibold">Password</label>
                <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    class="w-full rounded-lg border border-border px-4 py-3 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
            </div>

            <button type="submit" class="w-full rounded-lg bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-primary/90">
                Sign in
            </button>
        </form>
    </div>
</section>
@endsection
