<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Offer extends Model
{
    use HasUuids;

    protected $fillable = [
        'title', 'description', 'image', 'cta_text', 'cta_link', 'active',
        'promo_code', 'offer_type',
    ];

    protected $casts = [
        'active' => 'boolean',
    ];
}
