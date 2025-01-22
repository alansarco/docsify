<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LogAdmin extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $table = 'logs_admin';

    protected $fillable = [
        'id',
        'module',
        'action',
        'details',
        'created_by'
    ];
}
