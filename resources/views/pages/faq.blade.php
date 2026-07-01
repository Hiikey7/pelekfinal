@extends('layouts.app')
@section('content')
<section class="bg-muted py-14"><div class="container"><h1 class="text-4xl font-bold">FAQ</h1></div></section>
<section class="py-12"><div class="container max-w-3xl space-y-3">@foreach($faqs as $faq)<div class="rounded-lg bg-white p-4 shadow-card" data-faq-item><button class="flex w-full items-center justify-between text-left font-medium" data-faq-trigger>{{ is_array($faq) ? $faq['question'] : $faq->question }}<i data-lucide="chevron-down" class="h-4 w-4"></i></button><p class="mt-3 hidden text-muted-foreground" data-faq-panel>{{ is_array($faq) ? $faq['answer'] : $faq->answer }}</p></div>@endforeach</div></section>
@endsection
