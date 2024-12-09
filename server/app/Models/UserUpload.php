<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class UserUpload extends Model
{
    use HasFactory;

    protected $table = "users";
    protected $primaryKey = 'username';

    protected $fillable = [
        'username',
        'role', 
        'access_level', 
        'name', 
        'birthdate', 
        'contact', 
        'email', 
        'gender', 
        'address', 
        'year_residency', 
        'password', 
        'password_change',
        'account_status',
        'updated_by',
        'created_by'
    ];
}
