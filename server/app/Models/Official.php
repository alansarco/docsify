<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Official extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "officials";

    protected $fillable = [
        'name',
        'biography',
        'position_name',
        'id_picture',
        'created_by', 
        'updated_by'
    ];
}
