<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class LicenseKey extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "license_keys";

    protected $fillable = [
        'license_key',
        'license_price',
        'license_duration',
        'license_client',
        'license_date_use',
        'created_by', 
        'updated_by'
    ];
}
