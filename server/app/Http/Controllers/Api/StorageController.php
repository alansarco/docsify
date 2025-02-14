<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Utilities\Utils;
use App\Models\LogRepresentative;
use App\Models\StudentSection;
use App\Models\StudentStorage;
use Illuminate\Support\Str;

class StorageController extends Controller
{
    public function index(Request $request) {
        $filedata = StudentStorage::select('*',
            DB::raw("TO_BASE64(file_date) as filepath"),
            DB::raw("DATE_FORMAT(created_at, '%M %d, %Y %h:%i %p') AS date_added")
            )
            ->orderBy('created_at', 'DESC')->paginate(50);

        if($filedata) {
            return response()->json([
                'status' => 200,
                'filedata' => $filedata,
                'message' => 'Personal storage retrieved!',
            ]);
        }   
        else {
            return response()->json([
                'filedata' => $filedata,
                'message' => 'Personal storage empty!'
            ]);
        }
    }
}
