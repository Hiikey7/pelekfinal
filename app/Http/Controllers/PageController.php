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
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Str;

class PageController extends Controller
{
    public function home()
    {
        return view('pages.home', [
            'featured' => Property::where('active', true)->where('featured', true)->latest()->limit(6)->get(),
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
        abort_unless($property->active, 404);

        $similar = Property::query()
            ->where('active', true)
            ->where('id', '!=', $property->id)
            ->where('category', $property->category)
            ->latest()
            ->limit(8)
            ->get();

        if ($similar->count() < 4) {
            $fallback = Property::query()
                ->where('active', true)
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
            'amenityIcons' => DB::table('amenities')->pluck('icon', 'name')->all(),
        ]);
    }

    public function bookProperty(Request $request, Property $property)
    {
        abort_unless($property->active, 404);

        $rules = [
            'visitor_name' => ['required', 'string', 'max:180'],
            'email' => ['required', 'email', 'max:255'],
            'phone' => ['required', 'string', 'max:80'],
        ];
        if ($property->category === 'airbnb') {
            $rules += [
                'booking_date' => ['required', 'date', 'after_or_equal:today'],
                'check_out_date' => ['required', 'date', 'after:booking_date'],
                'guest_count' => ['required', 'integer', 'min:1', 'max:50'],
            ];
        } elseif ($property->category === 'rental') {
            $rules['booking_date'] = ['required', 'date', 'after_or_equal:today'];
        } else {
            $rules['questions'] = ['nullable', 'string', 'max:3000'];
        }

        $data = $request->validate($rules);
        if ($property->category === 'airbnb') {
            $data['num_days'] = (new \DateTimeImmutable($data['booking_date']))
                ->diff(new \DateTimeImmutable($data['check_out_date']))->days;
        }
        $days = $property->category === 'airbnb' ? (int) $data['num_days'] : 1;
        $total = (float) $property->price * $days;
        $propertyUrl = route('property.show', $property);
        $requestedDate = $data['booking_date'] ?? null;
        $bookingDetails = match ($property->category) {
            'airbnb' => "Check-in: {$requestedDate}\nCheck-out: {$data['check_out_date']}\nGuests: {$data['guest_count']}\nNumber of days: {$days}",
            'rental' => 'Preferred move-in date: '.($requestedDate ?: 'Not specified'),
            default => 'Questions: '.(filled($data['questions'] ?? null) ? $data['questions'] : 'None provided'),
        };
        $order = Order::query()->create([
            'visitor_name' => $data['visitor_name'],
            'email' => $data['email'],
            'phone' => $data['phone'],
            'booking_date' => $requestedDate,
            'check_out_date' => $data['check_out_date'] ?? null,
            'guest_count' => $data['guest_count'] ?? null,
            'property_id' => $property->id,
            'property_title' => $property->title,
            'price_per_night' => $property->price,
            'num_days' => $days,
            'total_amount' => $total,
            'payment_method' => 'email booking request',
            'status' => 'pending',
            'notes' => "{$bookingDetails}\nProperty: {$propertyUrl}".(! empty($data['guest_count']) ? "\nGuest count: {$data['guest_count']}" : ''),
        ]);

        $details = "Booking request #{$order->id}\nGuest: {$data['visitor_name']}\nEmail: {$data['email']}\nPhone: {$data['phone']}\nProperty: {$property->title}\nProperty link: {$propertyUrl}\n{$bookingDetails}\n";
        $adminEmail = static::settings()['booking_email'];

        try {
            if ($adminEmail) {
                Mail::raw($details, function ($message) use ($adminEmail, $property) {
                    $message->to($adminEmail)->subject('New booking request: '.$property->title);
                });
            }
            Mail::raw("Hello {$data['visitor_name']},\n\nWe received your inquiry for {$property->title}. Our team will contact you shortly.\n\n{$bookingDetails}\nProperty: {$propertyUrl}\n\nThank you,\nPelek Properties", function ($message) use ($data, $property) {
                $message->to($data['email'])->subject('Booking request received: '.$property->title);
            });
        } catch (\Throwable $exception) {
            report($exception);
            return back()->withInput()->with('booking_error', 'Your request was saved, but email could not be sent. Please contact us directly.');
        }

        return back()->with('booking_success', 'Your booking request was sent. Check your email for confirmation.');
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
            'properties' => Property::where('active', true)->latest()->get(),
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
            'booking_email' => config('admin.email') ?: env('CONTACT_TO_EMAIL', 'hello@example.com'),
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
