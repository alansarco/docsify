<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Candidate extends Model
{
    use HasFactory;
    use SoftDeletes;

    protected $table = "candidates";

    protected $fillable = [
        'candidateid',
        'pollid',
        'positionid',
        'candidate_name',
        'party',
        'id_picture',
        'organization',
        'grade',
        'requirements',
        'platform',
        'candidacy_status',
        'votes',
        'created_by', 
        'updated_by'
    ];
}
