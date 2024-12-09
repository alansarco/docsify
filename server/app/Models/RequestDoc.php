<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class RequestDoc extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "requests";

    protected $fillable = [
        'username',
        'document', 
        'date_needed', 
        'purpose', 
        'type', 
        'contact', 
        'status', 
        'created_by',
        'updated_by',
    ];
}
