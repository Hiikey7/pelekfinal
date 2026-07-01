<?php

namespace App\Livewire;

use App\Models\Property;
use Livewire\Component;
use Livewire\WithPagination;

class PropertySearch extends Component
{
    use WithPagination;

    public string $category = '';
    public string $location = '';
    public string $maxPrice = '';

    protected $queryString = ['category', 'location', 'maxPrice'];

    public function updating($name): void
    {
        $this->resetPage();
    }

    public function render()
    {
        $properties = Property::query()
            ->when($this->category !== '', fn ($query) => $query->whereIn('category', explode(',', $this->category)))
            ->when($this->location !== '', fn ($query) => $query->where('location', 'like', "%{$this->location}%"))
            ->when($this->maxPrice !== '', fn ($query) => $query->where('price', '<=', (float) $this->maxPrice))
            ->latest()
            ->paginate(9);

        return view('livewire.property-search', ['properties' => $properties]);
    }
}
