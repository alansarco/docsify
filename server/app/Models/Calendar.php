<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Calendar extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "calendars";

    protected $fillable = [
        'event_name',
        'description', 
        'details', 
        'event_date', 
        'event_date_end', 
        'time', 
        'time_end', 
        'hashtag1',
        'hashtag2',
        'hashtag3',
        'color',
        'icon',
        'created_by',
        'updated_by'
    ];
}
