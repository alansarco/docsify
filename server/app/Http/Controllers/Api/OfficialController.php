<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Admin;
use App\Models\App_Info;
use App\Models\Calendar;
use App\Models\Official;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Http;

class OfficialController extends Controller
{
    public function index() {
        $officials = Official::select('*',
            DB::raw("TO_BASE64(id_picture) as id_picture"),
            )
            ->get();

        $officials = [
            'officials' => $officials,
        ];

        return response()->json([
            'officials' => $officials,
        ]);
    }

    // retrieve specific event's information
    public function retrieve(Request $request) {
        $event = Official::select('*',
            DB::raw("TO_BASE64(id_picture) as id_picture"),
            )
            ->where('id', $request->id)
            ->first();
        
        if($event) {
            return response()->json([
                'status' => 200,
                'calendar' => $event,
                'message' => "Announcement data retrieved!"
            ], 200);
        }
        else {
            return response()->json([
                'calendar' => $event,
                'message' => "Announcement not found!"
            ]);
        }
    }

    // update specific admin's information
    public function updateofficial(Request $request) {
        $authUser = User::select('name')->where('username', Auth::user()->username)->first();

        $validator = Validator::make($request->all(), [
            'name' => 'required',
            'biography' => 'required',
            'position' => 'required',
            'id_picture' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }
        else {
            try {
                // Process the validated data, like storing the file, etc.
                $pictureData = null; // Initialize the variable to hold the file path
                if ($request->hasFile('id_picture')) {
                    $file = $request->file('id_picture');
                    $pictureData = file_get_contents($file->getRealPath()); // Get the file content as a string
                }
                $update = Official::where('id', $request->id)
                ->update([
                    'name' => strtoupper($request->name),
                    'position_name' => $request->position,
                    'biography' => $request->biography,
                    'id_picture' => $pictureData,
                    'updated_by' => $authUser->name,
                ]);

            if($update) {
                return response()->json([
                    'status' => 200,
                    'message' => 'Official updated successfully!'
                ], 200);
            }
            else {
                return response()->json([
                    'message' => 'Something went wrong!'
                ]);
            }
            } catch (Exception $e) {
                return response()->json([
                    'message' => $e->getMessage()
                ]);
            }
        }
    }

    public function addofficial(Request $request) {
        $authUser = User::select('name')->where('username', Auth::user()->username)->first();

        $validator = Validator::make($request->all(), [ 
            'name' => 'required',
            'biography' => 'required',
            'position' => 'required',
            'id_picture' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }

        // Process the validated data, like storing the file, etc.
        $pictureData = null; // Initialize the variable to hold the file path
        if ($request->hasFile('id_picture')) {
            $file = $request->file('id_picture');
            $pictureData = file_get_contents($file->getRealPath()); // Get the file content as a string
        }
        
        $add = Official::create([
            'name' => strtoupper($request->name),
            'position_name' => $request->position,
            'biography' => $request->biography,
            'id_picture' => $pictureData,
            'created_by' => $authUser->name,
        ]);

        if($add) {
            return response()->json([
                'status' => 200,
                'message' => 'Official added successfully!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }

    public function deleteofficial(Request $request) {
        $authUser = Auth::user();

        if($authUser->role !== "ADMIN" || $authUser->access_level < 10) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $delete = Official::where('id', $request->id)->delete();

        if($delete) {
            return response()->json([
                'status' => 200,
                'message' => 'official removed successfully!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }
    
}
