<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class Blog extends Model
{
    use HasUuids;

    protected $fillable = [
        'title', 'excerpt', 'content', 'image', 'author', 'date', 'category',
        'read_time', 'show_on_homepage',
    ];

    protected $casts = [
        'show_on_homepage' => 'boolean',
    ];

    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null;
        }

        if (Str::startsWith($this->image, ['http://', 'https://', '/'])) {
            return $this->image;
        }

        return Storage::url($this->image);
    }
}
