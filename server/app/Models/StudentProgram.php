<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class StudentProgram extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "students_program";

    protected $fillable = [
        'program_name',
        'program_acr',
        'created_by',
        'updated_by'
    ];
}
