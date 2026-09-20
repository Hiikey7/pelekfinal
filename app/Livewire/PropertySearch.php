<?php

namespace App\Livewire;

use App\Models\Property;
use Livewire\Component;
use Livewire\WithPagination;

class PropertySearch extends Component
{
    use WithPagination;

    public array $category = [];
    public array $bedrooms = [];
    public string $location = '';
    public string $maxPrice = '';

    protected $queryString = [
        'category' => ['except' => []],
        'location' => ['except' => ''],
        'maxPrice' => ['except' => ''],
        'bedrooms' => ['except' => []],
    ];

    public function mount(): void
    {
        $category = request()->query('category', []);

        if (is_string($category)) {
            $category = $category === '' ? [] : explode(',', $category);
        }

        $bedrooms = request()->query('bedrooms', []);

        if (is_string($bedrooms)) {
            $bedrooms = $bedrooms === '' ? [] : explode(',', $bedrooms);
        }

        $this->category = $this->cleanCategories($category);
        $this->bedrooms = $this->cleanBedrooms($bedrooms);
    }

    public function updating($name): void
    {
        $this->resetPage();
    }

    public function clearFilters(): void
    {
        $this->category = [];
        $this->location = '';
        $this->maxPrice = '';
        $this->bedrooms = [];
        $this->resetPage();
    }

    public function render()
    {
        $categories = $this->cleanCategories($this->category);
        $bedrooms = $this->cleanBedrooms($this->bedrooms);
        $location = trim($this->location);
        $maxPrice = trim($this->maxPrice);
        $hasFilters = $categories !== [] || $location !== '' || $maxPrice !== '' || $bedrooms !== [];

        $properties = $this->exactPropertyQuery($categories, $bedrooms, $location, $maxPrice)
            ->latest()
            ->paginate(9);
        $showingSimilar = false;

        if ($hasFilters && $properties->total() === 0) {
            $properties = $this->similarPropertyQuery($categories, $bedrooms, $location, $maxPrice)
                ->latest()
                ->paginate(9);
            $showingSimilar = $properties->total() > 0;
        }

        return view('livewire.property-search', [
            'properties' => $properties,
            'selectedBedrooms' => $bedrooms,
            'hasFilters' => $hasFilters,
            'showingSimilar' => $showingSimilar,
        ]);
    }

    private function exactPropertyQuery(array $categories, array $bedrooms, string $location, string $maxPrice)
    {
        return Property::query()
            ->where('active', true)
            ->when($categories !== [], fn ($query) => $query->whereIn('category', $categories))
            ->when($location !== '', fn ($query) => $query->where('location', 'like', "%{$location}%"))
            ->when($maxPrice !== '', fn ($query) => $query->where('price', '<=', (float) $maxPrice))
            ->when($bedrooms !== [], fn ($query) => $query->whereIn('bedrooms', $bedrooms));
    }

    private function similarPropertyQuery(array $categories, array $bedrooms, string $location, string $maxPrice)
    {
        return Property::query()
            ->where('active', true)
            ->where(function ($query) use ($categories, $bedrooms, $location, $maxPrice) {
                if ($categories !== []) {
                    $query->orWhereIn('category', $categories);
                }

                if ($location !== '') {
                    $query->orWhere('location', 'like', "%{$location}%");
                }

                if ($maxPrice !== '') {
                    $query->orWhere('price', '<=', (float) $maxPrice);
                }

                if ($bedrooms !== []) {
                    $query->orWhereIn('bedrooms', $bedrooms);
                }
            });
    }

    private function cleanCategories(array $categories): array
    {
        $allowed = ['airbnb', 'rental', 'sale', 'commercial_spaces'];

        return array_values(array_intersect($allowed, array_filter($categories)));
    }

    private function cleanBedrooms(array $bedrooms): array
    {
        $allowed = ['0', '1', '2', '3', '4', '5', '6', '7'];

        return array_map('intval', array_values(array_intersect($allowed, array_map('strval', array_filter($bedrooms, fn ($value) => $value !== '')))));
    }
}
