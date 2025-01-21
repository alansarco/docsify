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
        'security_code',
        'email',
        'contact',
        'logo',
        'notify_campus_add',
        'notify_campus_renew',
        'notify_user_approve',
        'created_by'
    ];
}
