<?php

namespace App\Http\Controllers;

use App\Models\Blog;
use App\Models\ContactMessage;
use App\Models\Offer;
use App\Models\Order;
use App\Models\Property;
use App\Models\Review;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\QueryException;
use Illuminate\Http\Response;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Carbon;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;

class AdminController extends Controller
{
    public function login(): View|RedirectResponse
    {
        if (session('admin_authenticated')) {
            return redirect()->route('admin.dashboard');
        }

        return view('admin.login');
    }

    public function authenticate(Request $request): RedirectResponse
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required', 'string'],
        ]);

        $adminEmail = (string) config('admin.email');
        $adminPassword = (string) config('admin.password');

        if (
            hash_equals($adminEmail, $credentials['email']) &&
            hash_equals($adminPassword, $credentials['password'])
        ) {
            $request->session()->regenerate();
            session(['admin_authenticated' => true]);

            return redirect()->route('admin.dashboard');
        }

        return back()
            ->withErrors(['email' => 'The provided admin credentials are incorrect.'])
            ->onlyInput('email');
    }

    public function dashboard(): View|RedirectResponse
    {
        if (! session('admin_authenticated')) {
            return redirect()->route('admin.login');
        }

        return view('admin.dashboard', $this->dashboardData());
    }

    public function section(Request $request, string $section): View|RedirectResponse
    {
        if (! session('admin_authenticated')) {
            return redirect()->route('admin.login');
        }

        abort_unless(array_key_exists($section, $this->sections()), 404);

        return view('admin.section', [
            'section' => $section,
            'currentSection' => $section,
            ...$this->sectionData($request, $section),
        ]);
    }

    public function updateSettings(Request $request): RedirectResponse
    {
        $this->requireAdmin();

        $settings = $request->validate([
            'whatsapp' => ['nullable', 'string', 'max:80'],
            'instagram' => ['nullable', 'url', 'max:255'],
            'tiktok' => ['nullable', 'url', 'max:255'],
            'facebook' => ['nullable', 'url', 'max:255'],
        ]);

        foreach ($settings as $key => $value) {
            DB::table('site_settings')->updateOrInsert(
                ['key' => $key],
                ['id' => (string) Str::uuid(), 'value' => (string) $value, 'updated_at' => now()]
            );
        }

        return back()->with('status', 'Settings saved.');
    }

    public function storeAmenity(Request $request): RedirectResponse
    {
        $this->requireAdmin();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
        ]);

        DB::table('amenities')->updateOrInsert(
            ['name' => $data['name']],
            ['id' => (string) Str::uuid(), 'created_at' => now()]
        );

        return back()->with('status', 'Amenity added.');
    }

    public function updateAmenity(Request $request, string $id): RedirectResponse
    {
        $this->requireAdmin();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:120'],
        ]);

        DB::table('amenities')->where('id', $id)->update([
            'name' => $data['name'],
        ]);

        return redirect()->route('admin.section', 'amenities')->with('status', 'Amenity updated.');
    }

    public function deleteAmenity(string $id): RedirectResponse
    {
        $this->requireAdmin();

        DB::table('amenities')->where('id', $id)->delete();

        return redirect()->route('admin.section', 'amenities')->with('status', 'Amenity deleted.');
    }

    public function storeExpense(Request $request): RedirectResponse
    {
        $this->requireAdmin();

        $data = $request->validate([
            'title' => ['required', 'string', 'max:180'],
            'category' => ['nullable', 'string', 'max:120'],
            'amount' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
        ]);

        DB::table('expenses')->insert([
            'id' => (string) Str::uuid(),
            'title' => $data['title'],
            'category' => $data['category'] ?: 'other',
            'amount' => $data['amount'],
            'description' => $data['description'] ?? '',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        return back()->with('status', 'Expense added.');
    }

    public function updateExpense(Request $request, string $id): RedirectResponse
    {
        $this->requireAdmin();

        $data = $request->validate([
            'title' => ['required', 'string', 'max:180'],
            'category' => ['required', 'string', 'max:120'],
            'amount' => ['required', 'numeric', 'min:0'],
            'description' => ['nullable', 'string'],
        ]);

        DB::table('expenses')->where('id', $id)->update([
            'title' => $data['title'],
            'category' => $data['category'],
            'amount' => $data['amount'],
            'description' => $data['description'] ?? '',
            'updated_at' => now(),
        ]);

        return redirect()->route('admin.section', 'expenses')->with('status', 'Expense updated.');
    }

    public function deleteExpense(string $id): RedirectResponse
    {
        $this->requireAdmin();

        DB::table('expenses')->where('id', $id)->delete();

        return redirect()->route('admin.section', 'expenses')->with('status', 'Expense deleted.');
    }

    public function storeOrder(Request $request): RedirectResponse
    {
        $this->requireAdmin();

        $data = $request->validate([
            'visitor_name' => ['required', 'string', 'max:180'],
            'phone' => ['nullable', 'string', 'max:80'],
            'property_id' => ['nullable', 'exists:properties,id'],
            'price_per_night' => ['required', 'numeric', 'min:0'],
            'num_days' => ['required', 'integer', 'min:1'],
            'discount_amount' => ['nullable', 'numeric', 'min:0'],
            'payment_method' => ['required', 'string', 'max:80'],
            'status' => ['required', 'string', 'max:80'],
            'notes' => ['nullable', 'string'],
        ]);

        $property = filled($data['property_id'] ?? null)
            ? Property::query()->find($data['property_id'])
            : null;
        $subtotal = (float) $data['price_per_night'] * (int) $data['num_days'];
        $discount = min((float) ($data['discount_amount'] ?? 0), $subtotal);

        Order::query()->create([
            'visitor_name' => $data['visitor_name'],
            'phone' => $data['phone'] ?? '',
            'property_id' => $property?->id,
            'property_title' => $property?->title ?? '',
            'price_per_night' => $data['price_per_night'],
            'num_days' => $data['num_days'],
            'discount_amount' => $discount,
            'total_amount' => $subtotal - $discount,
            'payment_method' => $data['payment_method'],
            'status' => $data['status'],
            'notes' => $data['notes'] ?? '',
        ]);

        return back()->with('status', 'Order added.');
    }

    public function storeBlog(Request $request): RedirectResponse
    {
        $this->requireAdmin();

        $data = $request->validate([
            'title' => ['required', 'string', 'max:220'],
            'category' => ['nullable', 'string', 'max:120'],
            'author' => ['nullable', 'string', 'max:120'],
            'date' => ['nullable', 'string', 'max:80'],
            'read_time' => ['nullable', 'string', 'max:80'],
            'image' => ['nullable', 'string', 'max:500'],
            'cover_image' => ['nullable', 'image', 'max:4096'],
            'excerpt' => ['required', 'string'],
            'content' => ['required', 'string'],
            'show_on_homepage' => ['nullable', 'boolean'],
        ]);

        Blog::query()->create([
            'title' => $data['title'],
            'category' => $data['category'] ?? '',
            'author' => $data['author'] ?: 'Pelek Properties',
            'date' => $data['date'] ?: now()->format('j M Y'),
            'read_time' => $data['read_time'] ?: '5 min read',
            'image' => $this->storedImagePath($request, 'cover_image', $data['image'] ?? '', 'blogs'),
            'excerpt' => $data['excerpt'],
            'content' => $data['content'],
            'show_on_homepage' => $request->boolean('show_on_homepage'),
        ]);

        return back()->with('status', 'Blog created.');
    }

    public function updateBlog(Request $request, Blog $blog): RedirectResponse
    {
        $this->requireAdmin();

        $data = $request->validate([
            'title' => ['required', 'string', 'max:220'],
            'category' => ['nullable', 'string', 'max:120'],
            'author' => ['nullable', 'string', 'max:120'],
            'date' => ['nullable', 'string', 'max:80'],
            'read_time' => ['nullable', 'string', 'max:80'],
            'image' => ['nullable', 'string', 'max:500'],
            'cover_image' => ['nullable', 'image', 'max:4096'],
            'excerpt' => ['required', 'string'],
            'content' => ['required', 'string'],
            'show_on_homepage' => ['nullable', 'boolean'],
        ]);

        $blog->update([
            'title' => $data['title'],
            'category' => $data['category'] ?? '',
            'author' => $data['author'] ?: 'Pelek Properties',
            'date' => $data['date'] ?: now()->format('j M Y'),
            'read_time' => $data['read_time'] ?: '5 min read',
            'image' => $this->storedImagePath($request, 'cover_image', $data['image'] ?: $blog->image, 'blogs'),
            'excerpt' => $data['excerpt'],
            'content' => $data['content'],
            'show_on_homepage' => $request->boolean('show_on_homepage'),
        ]);

        return redirect()->route('admin.section', 'blogs')->with('status', 'Blog updated.');
    }

    public function deleteBlog(Blog $blog): RedirectResponse
    {
        $this->requireAdmin();

        $blog->delete();

        return redirect()->route('admin.section', 'blogs')->with('status', 'Blog deleted.');
    }

    public function storeReview(Request $request): RedirectResponse
    {
        $this->requireAdmin();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'avatar' => ['nullable', 'string', 'max:20'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'date' => ['nullable', 'string', 'max:80'],
            'comment' => ['required', 'string'],
        ]);

        Review::query()->create([
            'name' => $data['name'],
            'avatar' => $data['avatar'] ?? '',
            'rating' => $data['rating'],
            'date' => $data['date'] ?: now()->format('d/m/Y'),
            'comment' => $data['comment'],
        ]);

        return back()->with('status', 'Review created.');
    }

    public function updateReview(Request $request, Review $review): RedirectResponse
    {
        $this->requireAdmin();

        $data = $request->validate([
            'name' => ['required', 'string', 'max:160'],
            'avatar' => ['nullable', 'string', 'max:20'],
            'rating' => ['required', 'integer', 'min:1', 'max:5'],
            'date' => ['nullable', 'string', 'max:80'],
            'comment' => ['required', 'string'],
        ]);

        $review->update([
            'name' => $data['name'],
            'avatar' => $data['avatar'] ?? '',
            'rating' => $data['rating'],
            'date' => $data['date'] ?: now()->format('d/m/Y'),
            'comment' => $data['comment'],
        ]);

        return redirect()->route('admin.section', 'reviews')->with('status', 'Review updated.');
    }

    public function deleteReview(Review $review): RedirectResponse
    {
        $this->requireAdmin();

        $review->delete();

        return redirect()->route('admin.section', 'reviews')->with('status', 'Review deleted.');
    }

    public function storeOffer(Request $request): RedirectResponse
    {
        $this->requireAdmin();

        $data = $request->validate([
            'title' => ['required', 'string', 'max:220'],
            'description' => ['required', 'string'],
            'image' => ['nullable', 'string', 'max:500'],
            'banner_image' => ['nullable', 'image', 'max:4096'],
            'offer_type' => ['required', 'in:cta_button,promo_code'],
            'cta_text' => ['required_if:offer_type,cta_button', 'nullable', 'string', 'max:120'],
            'cta_link' => ['required_if:offer_type,cta_button', 'nullable', 'string', 'max:500'],
            'promo_code' => ['required_if:offer_type,promo_code', 'nullable', 'string', 'max:120'],
            'active' => ['nullable', 'boolean'],
        ]);

        $isPromo = $data['offer_type'] === 'promo_code';

        $offer = Offer::query()->latest()->first() ?? new Offer();
        $image = $this->storedImagePath($request, 'banner_image', $data['image'] ?: ($offer->image ?? ''));

        $offer->fill([
            'title' => $data['title'],
            'description' => $data['description'],
            'image' => $image,
            'cta_text' => $isPromo ? 'Copy Code' : ($data['cta_text'] ?: 'View Now'),
            'cta_link' => $isPromo ? '' : ($data['cta_link'] ?: '/'),
            'active' => $request->boolean('active'),
            'promo_code' => $isPromo ? ($data['promo_code'] ?? '') : '',
            'offer_type' => $data['offer_type'],
        ])->save();

        Offer::query()->where('id', '!=', $offer->id)->delete();

        return back()->with('status', 'Offer saved.');
    }

    public function storeProperty(Request $request): RedirectResponse
    {
        $this->requireAdmin();

        $data = $request->validate([
            'title' => ['required', 'string', 'max:220'],
            'location' => ['required', 'string', 'max:180'],
            'price' => ['required', 'numeric', 'min:0'],
            'price_label' => ['nullable', 'string', 'max:120'],
            'category' => ['required', 'string', 'max:80'],
            'type' => ['nullable', 'string', 'max:120'],
            'bedrooms' => ['required', 'integer', 'min:0'],
            'bathrooms' => ['required', 'integer', 'min:0'],
            'guests' => ['nullable', 'integer', 'min:0'],
            'whatsapp' => ['nullable', 'string', 'max:80'],
            'lat' => ['nullable', 'numeric'],
            'lng' => ['nullable', 'numeric'],
            'google_map_link' => ['nullable', 'string'],
            'social_media_type' => ['nullable', 'string', 'max:80'],
            'social_media_url' => ['nullable', 'string', 'max:500'],
            'description' => ['required', 'string'],
            'amenities' => ['nullable', 'array'],
            'amenities.*' => ['string', 'max:120'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'max:4096'],
            'cover_image_index' => ['nullable', 'integer', 'min:0'],
            'featured' => ['nullable', 'boolean'],
        ]);

        $images = $this->storedImagePaths($request, 'images');
        $images = $this->orderedImagesWithCover($images, (int) ($data['cover_image_index'] ?? 0));
        $coverImage = $images[0] ?? '/images/property-1.jpg';

        Property::query()->create([
            'title' => $data['title'],
            'location' => $data['location'],
            'price' => $data['price'],
            'price_label' => $data['price_label'] ?? '',
            'rating' => 0,
            'reviews_count' => 0,
            'category' => $data['category'],
            'type' => $data['type'] ?? '',
            'image' => $coverImage,
            'images' => $images ?: [$coverImage],
            'description' => $data['description'],
            'amenities' => $data['amenities'] ?? [],
            'bedrooms' => $data['bedrooms'],
            'bathrooms' => $data['bathrooms'],
            'guests' => $data['guests'] ?? null,
            'featured' => $request->boolean('featured'),
            'whatsapp' => $data['whatsapp'] ?: '+254711614099',
            'lat' => $data['lat'] ?? 0,
            'lng' => $data['lng'] ?? 0,
            'google_map_link' => $data['google_map_link'] ?? '',
            'social_media_url' => $data['social_media_url'] ?? '',
            'social_media_type' => $data['social_media_type'] ?? '',
        ]);

        return back()->with('status', 'Property created.');
    }

    public function updateProperty(Request $request, Property $property): RedirectResponse
    {
        $this->requireAdmin();

        $data = $request->validate([
            'title' => ['required', 'string', 'max:220'],
            'location' => ['required', 'string', 'max:180'],
            'price' => ['required', 'numeric', 'min:0'],
            'price_label' => ['nullable', 'string', 'max:120'],
            'category' => ['required', 'string', 'max:80'],
            'type' => ['nullable', 'string', 'max:120'],
            'bedrooms' => ['required', 'integer', 'min:0'],
            'bathrooms' => ['required', 'integer', 'min:0'],
            'guests' => ['nullable', 'integer', 'min:0'],
            'whatsapp' => ['nullable', 'string', 'max:80'],
            'lat' => ['nullable', 'numeric'],
            'lng' => ['nullable', 'numeric'],
            'google_map_link' => ['nullable', 'string'],
            'social_media_type' => ['nullable', 'string', 'max:80'],
            'social_media_url' => ['nullable', 'string', 'max:500'],
            'description' => ['required', 'string'],
            'amenities' => ['nullable', 'array'],
            'amenities.*' => ['string', 'max:120'],
            'images' => ['nullable', 'array'],
            'images.*' => ['image', 'max:4096'],
            'cover_image_index' => ['nullable', 'integer', 'min:0'],
            'featured' => ['nullable', 'boolean'],
        ]);

        $images = $this->storedImagePaths($request, 'images');
        $images = $this->orderedImagesWithCover($images, (int) ($data['cover_image_index'] ?? 0));
        $existingImages = $property->images ?: [$property->image];
        $finalImages = $images ?: $existingImages;
        $coverImage = $finalImages[0] ?? $property->image ?: '/images/property-1.jpg';

        $property->update([
            'title' => $data['title'],
            'location' => $data['location'],
            'price' => $data['price'],
            'price_label' => $data['price_label'] ?? '',
            'category' => $data['category'],
            'type' => $data['type'] ?? '',
            'image' => $coverImage,
            'images' => $finalImages,
            'description' => $data['description'],
            'amenities' => $data['amenities'] ?? [],
            'bedrooms' => $data['bedrooms'],
            'bathrooms' => $data['bathrooms'],
            'guests' => $data['guests'] ?? null,
            'featured' => $request->boolean('featured'),
            'whatsapp' => $data['whatsapp'] ?: '+254711614099',
            'lat' => $data['lat'] ?? 0,
            'lng' => $data['lng'] ?? 0,
            'google_map_link' => $data['google_map_link'] ?? '',
            'social_media_url' => $data['social_media_url'] ?? '',
            'social_media_type' => $data['social_media_type'] ?? '',
        ]);

        return redirect()->route('admin.section', 'properties')->with('status', 'Property updated.');
    }

    public function deleteProperty(Property $property): RedirectResponse
    {
        $this->requireAdmin();

        $property->delete();

        return redirect()->route('admin.section', 'properties')->with('status', 'Property deleted.');
    }

    public function exportOrders(Request $request): Response
    {
        $this->requireAdmin();

        $orders = $this->filteredOrders($request)->get();
        $csv = "Date,Guest,Property,Days,Total,Payment,Status\n";

        foreach ($orders as $order) {
            $csv .= implode(',', array_map(fn ($value) => '"'.str_replace('"', '""', (string) $value).'"', [
                $order->created_at,
                $order->visitor_name,
                $order->property_title,
                $order->num_days,
                $order->total_amount,
                $order->payment_method,
                $order->status,
            ]))."\n";
        }

        return response($csv, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="pelek-orders.csv"',
        ]);
    }

    public function logout(Request $request): RedirectResponse
    {
        $request->session()->forget('admin_authenticated');
        $request->session()->regenerateToken();

        return redirect()->route('admin.login');
    }

    private function dashboardData(): array
    {
        $stats = [
            'properties' => $this->countModel(Property::class),
            'orders' => $this->countModel(Order::class),
            'blogs' => $this->countModel(Blog::class),
            'reviews' => $this->countModel(Review::class),
            'offers' => Offer::query()->exists() ? 1 : 0,
            'expenses' => $this->countTable('expenses'),
        ];

        $orders = $this->recentModel(Order::class, 5);
        $properties = $this->recentModel(Property::class, 5);
        $messages = $this->recentModel(ContactMessage::class, 5);

        return [
            'currentSection' => 'dashboard',
            'stats' => $stats,
            'totalEarnings' => $this->sumTable('orders', 'total_amount'),
            'monthlyEarnings' => $this->sumOrdersByMonth(),
            'popularProperties' => $this->popularProperties(),
            'recentOrders' => $orders,
            'recentProperties' => $properties,
            'recentMessages' => $messages,
            'paymentMethods' => $this->groupedCount('orders', 'payment_method'),
        ];
    }

    private function sectionData(Request $request, string $section): array
    {
        $config = $this->sections()[$section];

        if ($section === 'orders') {
            $rows = $this->filteredOrders($request)->limit(25)->get();
        } elseif ($section === 'expenses') {
            $rows = $this->filteredExpenses($request)->limit(25)->get();
        } elseif ($config['source'] === 'model') {
            $rows = $this->recentModel($config['model'], 25);
        } else {
            $rows = $this->recentTable($config['table'], 25);
        }

        return [
            'title' => $config['title'],
            'description' => $config['description'],
            'icon' => $config['icon'],
            'rows' => $rows,
            'columns' => $config['columns'],
            'month' => $request->query('month'),
            'properties' => $section === 'orders' ? Property::query()->orderBy('title')->get(['id', 'title', 'price']) : collect(),
            'amenities' => $section === 'properties' ? DB::table('amenities')->orderBy('name')->get() : collect(),
            'settings' => $section === 'settings' ? $this->settingsValues() : [],
            'expensesTotal' => $section === 'expenses' ? $this->filteredExpenses($request)->sum('amount') : 0,
            'singleOffer' => $section === 'offers' ? Offer::query()->latest()->first() : null,
            'editItem' => $this->editItem($request, $section),
        ];
    }

    private function sections(): array
    {
        return [
            'properties' => [
                'title' => 'Properties',
                'description' => 'Live property listings from the database.',
                'icon' => 'home',
                'source' => 'model',
                'model' => Property::class,
                'columns' => ['title', 'location', 'category', 'price'],
            ],
            'blogs' => [
                'title' => 'Blogs',
                'description' => 'Published articles and market updates.',
                'icon' => 'file-text',
                'source' => 'model',
                'model' => Blog::class,
                'columns' => ['title', 'category', 'author', 'date'],
            ],
            'reviews' => [
                'title' => 'Reviews',
                'description' => 'Customer reviews and ratings.',
                'icon' => 'star',
                'source' => 'model',
                'model' => Review::class,
                'columns' => ['name', 'rating', 'comment', 'date'],
            ],
            'expenses' => [
                'title' => 'Expenses',
                'description' => 'Recorded operating expenses.',
                'icon' => 'receipt',
                'source' => 'table',
                'table' => 'expenses',
                'columns' => ['title', 'category', 'amount', 'created_at'],
            ],
            'offers' => [
                'title' => 'Offers & Banners',
                'description' => 'The single popup offer shown to website visitors.',
                'icon' => 'gift',
                'source' => 'model',
                'model' => Offer::class,
                'columns' => ['title', 'promo_code', 'offer_type', 'active'],
            ],
            'orders' => [
                'title' => 'Orders',
                'description' => 'Bookings, receipts, and order totals.',
                'icon' => 'shopping-cart',
                'source' => 'model',
                'model' => Order::class,
                'columns' => ['visitor_name', 'property_title', 'total_amount', 'status'],
            ],
            'amenities' => [
                'title' => 'Amenities',
                'description' => 'Amenities available for property listings.',
                'icon' => 'list-checks',
                'source' => 'table',
                'table' => 'amenities',
                'columns' => ['name', 'created_at'],
            ],
            'settings' => [
                'title' => 'Settings',
                'description' => 'Site settings stored for the public website.',
                'icon' => 'settings',
                'source' => 'table',
                'table' => 'site_settings',
                'columns' => ['key', 'value', 'updated_at'],
            ],
        ];
    }

    private function countModel(string $model): int
    {
        try {
            /** @var class-string<Model> $model */
            return $model::query()->count();
        } catch (QueryException) {
            return 0;
        }
    }

    private function countTable(string $table): int
    {
        try {
            return Schema::hasTable($table) ? DB::table($table)->count() : 0;
        } catch (QueryException) {
            return 0;
        }
    }

    private function sumTable(string $table, string $column): float
    {
        try {
            return Schema::hasTable($table) ? (float) DB::table($table)->sum($column) : 0;
        } catch (QueryException) {
            return 0;
        }
    }

    private function recentModel(string $model, int $limit)
    {
        try {
            /** @var class-string<Model> $model */
            return $model::query()->latest('created_at')->limit($limit)->get();
        } catch (QueryException) {
            return collect();
        }
    }

    private function recentTable(string $table, int $limit)
    {
        try {
            if (! Schema::hasTable($table)) {
                return collect();
            }

            $query = DB::table($table);

            if (Schema::hasColumn($table, 'created_at')) {
                $query->latest('created_at');
            }

            return $query->limit($limit)->get();
        } catch (QueryException) {
            return collect();
        }
    }

    private function sumOrdersByMonth()
    {
        try {
            if (! Schema::hasTable('orders')) {
                return collect();
            }

            return DB::table('orders')
                ->selectRaw("DATE_FORMAT(created_at, '%b %Y') as label, SUM(total_amount) as total")
                ->groupByRaw("DATE_FORMAT(created_at, '%Y-%m'), DATE_FORMAT(created_at, '%b %Y')")
                ->orderByRaw("MIN(created_at)")
                ->limit(6)
                ->get();
        } catch (QueryException) {
            return collect();
        }
    }

    private function popularProperties()
    {
        try {
            if (! Schema::hasTable('orders')) {
                return collect();
            }

            return DB::table('orders')
                ->select('property_title', DB::raw('COUNT(*) as bookings'))
                ->where('property_title', '!=', '')
                ->groupBy('property_title')
                ->orderByDesc('bookings')
                ->limit(5)
                ->get();
        } catch (QueryException) {
            return collect();
        }
    }

    private function groupedCount(string $table, string $column)
    {
        try {
            if (! Schema::hasTable($table)) {
                return collect();
            }

            return DB::table($table)
                ->select($column, DB::raw('COUNT(*) as total'))
                ->groupBy($column)
                ->orderByDesc('total')
                ->limit(5)
                ->get();
        } catch (QueryException) {
            return collect();
        }
    }

    private function requireAdmin(): void
    {
        abort_unless(session('admin_authenticated'), 403);
    }

    private function settingsValues(): array
    {
        return DB::table('site_settings')->pluck('value', 'key')->all();
    }

    private function editItem(Request $request, string $section)
    {
        if (! $request->filled('edit')) {
            return null;
        }

        return match ($section) {
            'properties' => Property::query()->find($request->query('edit')),
            'blogs' => Blog::query()->find($request->query('edit')),
            'expenses' => DB::table('expenses')->where('id', $request->query('edit'))->first(),
            'reviews' => Review::query()->find($request->query('edit')),
            default => null,
        };
    }

    private function filteredOrders(Request $request)
    {
        $query = Order::query()->latest('created_at');

        if ($request->filled('month')) {
            $query->whereDate('created_at', '>=', $request->query('month').'-01')
                ->whereDate('created_at', '<=', Carbon::parse($request->query('month').'-01')->endOfMonth()->toDateString());
        }

        return $query;
    }

    private function filteredExpenses(Request $request)
    {
        $query = DB::table('expenses')->latest('created_at');

        if ($request->filled('month')) {
            $query->whereDate('created_at', '>=', $request->query('month').'-01')
                ->whereDate('created_at', '<=', Carbon::parse($request->query('month').'-01')->endOfMonth()->toDateString());
        }

        return $query;
    }

    private function storedImagePath(Request $request, string $fileKey, string $fallback, string $subfolder = 'admin'): string
    {
        if (! $request->hasFile($fileKey)) {
            return $fallback;
        }

        return $this->storeUploadedImage($request->file($fileKey), $subfolder, $fileKey);
    }

    private function storedImagePaths(Request $request, string $fileKey): array
    {
        if (! $request->hasFile($fileKey)) {
            return [];
        }

        return collect($request->file($fileKey))
            ->map(fn ($file) => $this->storeUploadedImage($file, 'properties', 'images'))
            ->all();
    }

    private function storeUploadedImage($file, string $subfolder, string $errorKey = 'image'): string
    {
        if ($this->cloudinaryConfigured()) {
            return $this->uploadToCloudinary($file, $subfolder, $errorKey);
        }

        return $this->publicStorageUrl($file->store($subfolder, 'public'));
    }

    private function cloudinaryConfigured(): bool
    {
        return filled(config('cloudinary.cloud_name'))
            && filled(config('cloudinary.api_key'))
            && filled(config('cloudinary.api_secret'));
    }

    private function uploadToCloudinary($file, string $subfolder, string $errorKey): string
    {
        if (! function_exists('curl_init') || ! class_exists(\CURLFile::class)) {
            throw ValidationException::withMessages([
                $errorKey => 'Cloudinary uploads require the PHP cURL extension.',
            ]);
        }

        $timestamp = time();
        $folder = trim(config('cloudinary.folder'), '/').'/'.$subfolder;
        $signaturePayload = "folder={$folder}&timestamp={$timestamp}".config('cloudinary.api_secret');
        $signature = sha1($signaturePayload);

        $curl = curl_init("https://api.cloudinary.com/v1_1/".config('cloudinary.cloud_name')."/image/upload");
        $curlOptions = [
            CURLOPT_POST => true,
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POSTFIELDS => [
                'file' => new \CURLFile($file->getRealPath(), $file->getMimeType(), $file->getClientOriginalName()),
                'api_key' => config('cloudinary.api_key'),
                'timestamp' => $timestamp,
                'folder' => $folder,
                'signature' => $signature,
            ],
            CURLOPT_TIMEOUT => 45,
        ];

        $caBundle = base_path('storage/certs/cacert.pem');
        if (is_file($caBundle)) {
            $curlOptions[CURLOPT_CAINFO] = $caBundle;
        }

        curl_setopt_array($curl, $curlOptions);

        $response = curl_exec($curl);
        $error = curl_error($curl);
        $status = curl_getinfo($curl, CURLINFO_HTTP_CODE);
        curl_close($curl);

        if ($response === false || $status < 200 || $status >= 300) {
            throw ValidationException::withMessages([
                $errorKey => 'Cloudinary upload failed. '.$error,
            ]);
        }

        $payload = json_decode($response, true);

        if (! is_array($payload) || empty($payload['secure_url'])) {
            throw ValidationException::withMessages([
                $errorKey => 'Cloudinary upload failed: invalid response.',
            ]);
        }

        return $payload['secure_url'];
    }

    private function orderedImagesWithCover(array $images, int $coverIndex): array
    {
        if ($images === []) {
            return [];
        }

        if (! array_key_exists($coverIndex, $images)) {
            return $images;
        }

        $cover = $images[$coverIndex];
        unset($images[$coverIndex]);

        return array_values([$cover, ...$images]);
    }

    private function publicStorageUrl(string $path): string
    {
        return '/storage/'.ltrim($path, '/');
    }
}
