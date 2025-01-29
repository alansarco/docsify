<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class DocReqTimeline extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "requests_timeline";

    protected $fillable = [
        'reference_no',
        'clientid',
        'status',
        'status_name',
        'status_details',
        'created_by',
    ];
}
