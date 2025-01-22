<?php

namespace App\Http\Controllers\Api;

use Exception;
use App\Http\Controllers\Controller;
use App\Models\LicenseKey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Utilities\Utils;
use App\Models\LogAdmin;
use App\Models\Client;
use App\Models\LogRepresentative;
use App\Models\StudentSection;
use Illuminate\Support\Str;

class SectionController extends Controller
{
    public function index(Request $request) {
        $query = StudentSection::select('*',
            DB::raw("CAST((
                SELECT COUNT(*)
                FROM users
                WHERE 
                    users.section = students_section.section_id
                    AND users.role = 'USER'
                    AND users.account_status = 1
            ) AS CHAR) AS studentCount"),
            DB::raw("DATE_FORMAT(created_at, '%M %d, %Y %h:%i %p') AS date_added"));

        if($request->filter) {
            $query->where('section_name', 'LIKE' , '%'.$request->filter.'%');
        }

        if($request->status != '') {
            $query->where('status', $request->status);
        }
        
        $sections = $query->orderBy('created_at', 'DESC')->paginate(20);

        if($sections) {
            return response()->json([
                'status' => 200,
                'sections' => $sections,
                'message' => 'Sections retrieved!',
            ]);
        }   
        else {
            return response()->json([
                'sections' => $sections,
                'message' => 'No sections found!'
            ]);
        }
    }

    public function addsection(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "REPRESENTATIVE" || $authUser->access_level != 30) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $validator = Validator::make($request->all(), [ 
            'section_name' => 'required',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }

        // Generate a unique 15-character id
        do {
            $GeneratedID = Str::upper(Str::random(10)); // Generate a random string of 15 characters
        } while (DB::table('students_section')->where('section_id', $GeneratedID)->exists());

        $addsection = StudentSection::create([
            'section_id' => $GeneratedID,
            'clientid' => $authUser->clientid,
            'status' => 1,
            'section_name' => strtoupper($request->section_name),
            'created_by' => $authUser->fullname
        ]);

        if($addsection) {
            LogRepresentative::create([
                'module' => 'Sections',
                'action' => 'ADD',
                'details' => $authUser->fullname .' added new section ' .$GeneratedID. ' - ' .$request->section_name,
                'created_by' => $authUser->fullname,
            ]);
            return response()->json([
                'status' => 200,
                'message' => 'Section added successfully!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }

    public function retrievesection(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();

        $dataRetrieved = StudentSection::leftJoin('clients', 'students_section.clientid', 'clients.clientid')
            ->select('students_section.*',
            DB::raw("CAST((
                SELECT COUNT(*)
                FROM users
                WHERE 
                    users.section = students_section.section_id
                    AND users.role = 'USER'
                    AND users.account_status = 1
            ) AS CHAR) AS studentCount"),
            DB::raw("DATE_FORMAT(students_section.created_at, '%M %d, %Y %h:%i %p') AS created_date"),
            DB::raw("DATE_FORMAT(students_section.updated_at, '%M %d, %Y %h:%i %p') AS updated_date"),
            DB::raw("TO_BASE64(clients.client_logo) as client_logo"),
            DB::raw("TO_BASE64(clients.client_banner) as client_banner"),
            )
            ->where('students_section.clientid', $authUser->clientid)
            ->where('students_section.section_id', $request->data)
            ->first();
        
        if($dataRetrieved) {
            return response()->json([
                'status' => 200,
                'dataRetrieved' => $dataRetrieved,
                'message' => 'Section data retrieved!',
            ]);
        }
        return response()->json([
            'dataRetrieved' => $dataRetrieved,
            'message' => 'Error retrieving data!',
        ]);
    }

    public function updatesection(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "REPRESENTATIVE" || $authUser->access_level != 30) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $validator = Validator::make($request->all(), [
            'section_name' => 'required',
            'status' => 'required',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }
        $updateData = [
            'section_name' => strtoupper($request->section_name),
            'status' => $request->status,
            'updated_by' => $authUser->fullname,
        ];

        $existingKeys = StudentSection::where('section_id', $request->section_id)->first();
        $changes = [];

        // Compare all fields except those related to pictures
        foreach ($updateData as $key => $value) {
            if (isset($existingKeys[$key]) && $existingKeys[$key] != $value) {
                $changes[$key] = [
                    'old' => $existingKeys[$key],
                    'new' => $value
                ];
            }
        }

        $update = StudentSection::where('section_id', $request->section_id)->update($updateData);

        if($update) {
            if (!empty($changes)) {
                LogRepresentative::create([
                    'module' => 'Sections',
                    'action' => 'UPDATE',
                    'details' => $authUser->fullname .' updated section '.$request->section_id. ' with the following changes: ' . json_encode($changes),
                    'created_by' => $authUser->fullname,
                ]);
            }
            return response()->json([
                'status' => 200,
                'message' => 'Section updated successfully!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }

    public function deletesection(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "REPRESENTATIVE" || $authUser->access_level != 30) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $delete = StudentSection::where('section_id', $request->section_id)->delete();
        
        if($delete) {
            LogRepresentative::create([
                'module' => 'Sections',
                'action' => 'DELETE',
                'details' => $authUser->fullname .' deleted section '.$request->license_key,
                'created_by' => $authUser->fullname,
            ]);
            return response()->json([
                'status' => 200,
                'message' => 'Section deleted successfully!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }

}
