<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Document extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "documents";

    protected $fillable = [
        'doc_id',
        'clientid',
        'doc_name',
        'doc_limit',
        'days_process',
        'status',
        'created_by',
        'updated_by'
    ];
}
