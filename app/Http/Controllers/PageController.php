<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\ContactMessage;
use App\Models\Faq;
use App\Models\Order;
use App\Models\Property;
use App\Models\Review;
use App\Models\SiteSetting;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Request;

class PageController extends Controller
{
    public function home()
    {
        return view('pages.home', [
            'featured' => Property::where('featured', true)->latest()->limit(6)->get(),
            'blogs' => Blog::where('show_on_homepage', true)->latest()->limit(3)->get(),
            'reviews' => Review::latest('created_at')->limit(8)->get(),
            'faqs' => $this->defaultFaqs(),
        ]);
    }

    public function properties()
    {
        return view('pages.properties');
    }

    public function property(Property $property)
    {
        $similar = Property::query()
            ->where('id', '!=', $property->id)
            ->where('category', $property->category)
            ->latest()
            ->limit(8)
            ->get();

        if ($similar->count() < 4) {
            $fallback = Property::query()
                ->where('id', '!=', $property->id)
                ->whereNotIn('id', $similar->pluck('id'))
                ->latest()
                ->limit(8 - $similar->count())
                ->get();

            $similar = $similar->concat($fallback);
        }

        return view('pages.property', [
            'property' => $property,
            'similar' => $similar,
        ]);
    }

    public function blog()
    {
        return view('pages.blog', ['blogs' => Blog::latest()->paginate(9)]);
    }

    public function blogDetail(Blog $blog)
    {
        return view('pages.blog-detail', ['blog' => $blog]);
    }

    public function faq()
    {
        $faqs = Faq::orderBy('sort_order')->get();
        return view('pages.faq', ['faqs' => $faqs->isNotEmpty() ? $faqs : collect($this->defaultFaqs())]);
    }

    public function contact()
    {
        return view('pages.contact');
    }

    public function favorites()
    {
        return view('pages.favorites', [
            'properties' => Property::latest()->get(),
        ]);
    }

    public function sendContact(Request $request)
    {
        $data = $request->validate([
            'full_name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['nullable', 'string', 'max:80'],
            'subject' => ['required', 'string', 'max:255'],
            'message' => ['required', 'string'],
        ]);

        ContactMessage::create($data + ['read' => false]);

        return back()->with('status', 'Message sent. We will get back to you shortly.');
    }

    public function services()
    {
        return view('pages.services');
    }

    public function terms()
    {
        return view('pages.terms');
    }

    public function receipt(Order $order)
    {
        return Pdf::loadView('pdf.receipt', ['order' => $order])->download("receipt-{$order->id}.pdf");
    }

    public static function settings(): array
    {
        return SiteSetting::query()->pluck('value', 'key')->all() + [
            'whatsapp' => '+254711614099',
            'facebook' => '',
            'instagram' => '',
            'tiktok' => '',
        ];
    }

    private function defaultFaqs(): array
    {
        return [
            ['question' => 'What types of properties do you offer?', 'answer' => 'We offer Airbnb stays, rentals, properties for sale, and commercial spaces across Kenya.'],
            ['question' => 'How do I book an Airbnb property?', 'answer' => 'Browse properties, open the listing you like, and contact us through WhatsApp or the contact form.'],
            ['question' => 'Do you offer property management services?', 'answer' => 'Yes, we handle tenant support, bookings, maintenance coordination, and reporting.'],
            ['question' => 'Can you help me buy or sell property?', 'answer' => 'Yes. We support valuation, marketing, viewing coordination, and closing guidance.'],
        ];
    }
}
