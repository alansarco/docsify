<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ReportComment extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "comments";

    protected $fillable = [
        'report_id',
        'name',
        'comment', 
        'created_by',
    ];
}
