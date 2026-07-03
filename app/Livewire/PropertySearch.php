<?php

namespace App\Livewire;

use App\Models\Property;
use Livewire\Component;
use Livewire\WithPagination;

class PropertySearch extends Component
{
    use WithPagination;

    public array $category = [];
    public string $location = '';
    public string $maxPrice = '';

    protected $queryString = [
        'category' => ['except' => []],
        'location' => ['except' => ''],
        'maxPrice' => ['except' => ''],
    ];

    public function mount(): void
    {
        $category = request()->query('category', []);

        if (is_string($category)) {
            $category = $category === '' ? [] : explode(',', $category);
        }

        $this->category = $this->cleanCategories($category);
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
        $this->resetPage();
    }

    public function render()
    {
        $categories = $this->cleanCategories($this->category);

        $properties = Property::query()
            ->when($categories !== [], fn ($query) => $query->whereIn('category', $categories))
            ->when($this->location !== '', fn ($query) => $query->where('location', 'like', "%{$this->location}%"))
            ->when($this->maxPrice !== '', fn ($query) => $query->where('price', '<=', (float) $this->maxPrice))
            ->latest()
            ->paginate(9);

        return view('livewire.property-search', [
            'properties' => $properties,
            'hasFilters' => $categories !== [] || $this->location !== '' || $this->maxPrice !== '',
        ]);
    }

    private function cleanCategories(array $categories): array
    {
        $allowed = ['airbnb', 'rental', 'sale', 'commercial_spaces'];

        return array_values(array_intersect($allowed, array_filter($categories)));
    }
}
