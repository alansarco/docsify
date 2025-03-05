<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DocRequest extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "requests";

    protected $fillable = [
        'reference_no',
        'clientid',
        'username',
        'doc_id',
        'date_needed',
        'purpose',
        'contact',
        'status',
        'task_owner',
        'notify_indicator',
        'completed_by',
        'date_completed',
        'updated_at',
        'created_by',
        'updated_by'
    ];
}
