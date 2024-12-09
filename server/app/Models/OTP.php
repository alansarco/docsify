<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class OTP extends Model
{
    use HasFactory;
    use SoftDeletes;
    protected $table = 'temporary_otp';

    protected $fillable = [
        'id',
        'valid_for',
        'expires_at'
    ];
}
