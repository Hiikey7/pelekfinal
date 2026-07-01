<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Order extends Model
{
    use HasUuids;

    protected $fillable = [
        'visitor_name', 'phone', 'property_id', 'property_title',
        'price_per_night', 'num_days', 'total_amount', 'payment_method',
        'status', 'notes',
    ];
}
