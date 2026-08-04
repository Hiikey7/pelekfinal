@extends('layouts.app')
@section('content')
<section class="bg-muted py-14">
	<div class="container">
		<h1 class="text-4xl font-bold">Blog</h1>
		<p class="mt-2 text-muted-foreground">Tips, guides, and property insights.</p>
	</div>
</section>
<section class="py-12">
	<div class="container grid grid-cols-1 gap-6 md:grid-cols-3">
		@foreach($blogs as $post)
			<article class="overflow-hidden rounded-xl bg-white shadow-card">
				<img src="{{ $post->image_url ?: asset('images/property-2.jpg') }}" class="aspect-[16/10] w-full object-cover" alt="{{ $post->title }}">
				<div class="p-5">
					<span class="text-xs font-semibold text-secondary">{{ $post->category }}</span>
					<h2 class="my-2 font-semibold">{{ $post->title }}</h2>
					<p class="line-clamp-2 text-sm text-muted-foreground">{{ $post->excerpt }}</p>
					<a href="{{ route('blog.show',$post) }}" class="mt-4 inline-block text-sm font-semibold text-secondary">Read More</a>
				</div>
			</article>
		@endforeach
	</div>
	<div class="container mt-8">{{ $blogs->links() }}</div>
</section>
@endsection
