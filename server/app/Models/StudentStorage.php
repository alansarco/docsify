<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentStorage extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "students_storage";

    protected $fillable = [
        'username',
        'file_name',
        'file_data',
        'file_type',
    ];
}
