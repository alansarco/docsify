<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Transferee extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "students_transfer";

    protected $fillable = [
        'username',
        'school_from',
        'school_to',
        'status',
        'created_by',
        'updated_by',
        'date_transferred',
    ];
}
