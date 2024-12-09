<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Report extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "reports";

    protected $fillable = [
        'title',
        'location',
        'candidate_name',
        'description',
        'priority_level',
        'status',
        'date_happen',
        'time_happen',
        'created_by', 
        'updated_by'
    ];
}
