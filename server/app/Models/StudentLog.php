<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentLog extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $table = 'student_logs';

    protected $fillable = [
        'clientid',
        'username',
        'type', 
        'activity', 
        'created_by',
        'updated_by',
    ];
}
