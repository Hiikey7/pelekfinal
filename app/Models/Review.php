<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Review extends Model
{
    use HasUuids;

    public $timestamps = false;

    protected $fillable = ['name', 'rating', 'comment', 'date', 'avatar'];
}
