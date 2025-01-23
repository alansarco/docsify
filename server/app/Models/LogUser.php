<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LogUser extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $table = 'logs_user';

    protected $fillable = [
        'id',
        'clientid',
        'module',
        'action',
        'details',
        'created_by'
    ];
}
