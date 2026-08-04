<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ContactMessage extends Model
{
    use HasUuids;

    public $timestamps = false;

    protected $fillable = ['full_name', 'email', 'phone', 'subject', 'message', 'read'];

    protected $casts = [
        'read' => 'boolean',
    ];
}
