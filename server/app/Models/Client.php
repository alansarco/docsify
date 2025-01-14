<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Client extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "clients";

    protected $fillable = [
        'clientid',
        'client_name',
        'client_acr',
        'client_logo',
        'client_banner',
        'subscription_start',
        'subscription_end',
        'current_payment',
        'total_payment',
        'client_representative',
        'created_by', 
        'updated_by'
    ];
}
