<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Utilities\Utils;
use App\Models\LogRepresentative;
use App\Models\StudentProgram;
use Illuminate\Support\Str;

class ProgramController extends Controller
{
    public function index(Request $request) {
        $query = StudentProgram::select('*',
            DB::raw("CAST((
                SELECT COUNT(*)
                FROM users
                WHERE 
                    users.program = students_program.program_id
                    AND users.role = 'USER'
                    AND users.account_status = 1
            ) AS CHAR) AS studentCount"),
            DB::raw("DATE_FORMAT(created_at, '%M %d, %Y %h:%i %p') AS date_added"));

        if($request->filter) {
            $query->where('program_name', 'LIKE' , '%'.$request->filter.'%');
        }

        if($request->status != '') {
            $query->where('status', $request->status);
        }
        
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        $query->where('clientid', $authUser->clientid);

        $programs = $query->orderBy('created_at', 'DESC')->paginate(50);

        if($programs) {
            return response()->json([
                'status' => 200,
                'programs' => $programs,
                'message' => 'Programs retrieved!',
            ]);
        }   
        else {
            return response()->json([
                'programs' => $programs,
                'message' => 'No programs found!'
            ]);
        }
    }

    public function addprogram(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "REPRESENTATIVE" || $authUser->access_level != 30) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $validator = Validator::make($request->all(), [ 
            'program_name' => 'required',
            'program_acr' => 'required',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }

        // Generate a unique 10-character id
        do {
            $GeneratedID = Str::upper(Str::random(10)); // Generate a random string of 15 characters
        } while (DB::table('students_program')->where('program_id', $GeneratedID)->exists());

        $addprogram = StudentProgram::create([
            'program_id' => $GeneratedID,
            'clientid' => $authUser->clientid,
            'program_name' => $request->program_name,
            'program_acr' => strtoupper($request->program_acr),
            'status' => 1,
            'created_by' => $authUser->fullname
        ]);

        if($addprogram) {
            LogRepresentative::create([
                'clientid' => $authUser->clientid,
                'module' => 'Programs',
                'action' => 'ADD',
                'details' => $authUser->fullname .' added new program ' .$GeneratedID. ' - ' .$request->program_name,
                'created_by' => $authUser->fullname,
            ]);
            return response()->json([
                'status' => 200,
                'message' => 'Program added successfully!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }

    public function retrieveprogram(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();

        $dataRetrieved = StudentProgram::leftJoin('clients', 'students_program.clientid', 'clients.clientid')
            ->select('students_program.*',
            DB::raw("CAST((
                SELECT COUNT(*)
                FROM users
                WHERE 
                    users.program = students_program.program_id
                    AND users.role = 'USER'
                    AND users.account_status = 1
            ) AS CHAR) AS studentCount"),
            DB::raw("DATE_FORMAT(students_program.created_at, '%M %d, %Y %h:%i %p') AS created_date"),
            DB::raw("DATE_FORMAT(students_program.updated_at, '%M %d, %Y %h:%i %p') AS updated_date"),
            DB::raw("TO_BASE64(clients.client_logo) as client_logo"),
            DB::raw("TO_BASE64(clients.client_banner) as client_banner"),
            )
            ->where('students_program.clientid', $authUser->clientid)
            ->where('students_program.program_id', $request->data)
            ->first();
        
        if($dataRetrieved) {
            return response()->json([
                'status' => 200,
                'dataRetrieved' => $dataRetrieved,
                'message' => 'Program data retrieved!',
            ]);
        }
        return response()->json([
            'dataRetrieved' => $dataRetrieved,
            'message' => 'Error retrieving data!',
        ]);
    }

    public function updateprogram(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "REPRESENTATIVE" || $authUser->access_level != 30) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $validator = Validator::make($request->all(), [
            'program_id' => 'required',
            'program_name' => 'required',
            'program_acr' => 'required',
            'status' => 'required',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }
        $updateData = [
            'program_name' => $request->program_name,
            'program_acr' => strtoupper($request->program_acr),
            'status' => $request->status,
            'updated_by' => $authUser->fullname,
        ];

        $existingKeys = StudentProgram::where('program_id', $request->program_id)->first();
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

        $update = StudentProgram::where('program_id', $request->program_id)->update($updateData);

        if($update) {
            if (!empty($changes)) {
                LogRepresentative::create([
                    'clientid' => $authUser->clientid,
                    'module' => 'Programs',
                    'action' => 'UPDATE',
                    'details' => $authUser->fullname .' updated program '.$request->program_id. ' with the following changes: ' . json_encode($changes),
                    'created_by' => $authUser->fullname,
                ]);
            }
            return response()->json([
                'status' => 200,
                'message' => 'Program updated successfully!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }

    public function deleteprogram(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "REPRESENTATIVE" || $authUser->access_level != 30) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $delete = StudentProgram::where('program_id', $request->program_id)->delete();
        
        if($delete) {
            LogRepresentative::create([
                'clientid' => $authUser->clientid,
                'module' => 'Programs',
                'action' => 'DELETE',
                'details' => $authUser->fullname .' deleted program '.$request->license_key,
                'created_by' => $authUser->fullname,
            ]);
            return response()->json([
                'status' => 200,
                'message' => 'Program deleted successfully!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }

}
