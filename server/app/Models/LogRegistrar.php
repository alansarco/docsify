<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LogRegistrar extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $table = 'logs_registrar';

    protected $fillable = [
        'id',
        'module',
        'action',
        'details',
        'created_by'
    ];
}
