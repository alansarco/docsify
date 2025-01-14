<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class App_Info extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "app_info";

    protected $fillable = [
        'system_id',
        'system_name',
        'acronym',
        'org_structure',
        'system_info',
        'event_notif',
        'subscription',
        'security_code',
        'email',
        'contact',
        'requirements_link',
        'times_subscribe',
        'logo',
        'starts_at',
        'expires_at',
        'created_by'
    ];
}
