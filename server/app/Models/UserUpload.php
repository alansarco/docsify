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
        'clientid',
        'role', 
        'access_level', 
        'first_name', 
        'middle_name', 
        'last_name', 
        'birthdate', 
        'contact', 
        'email', 
        'gender', 
        'address', 
        'grade', 
        'section', 
        'program', 
        'year_enrolled', 
        'password', 
        'password_change',
        'account_status',
        'new_account',
        'updated_by',
        'created_by'
    ];
}
