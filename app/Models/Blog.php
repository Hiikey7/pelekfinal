<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

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
}
