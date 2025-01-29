<?php

namespace App\Http\Controllers\Api;

use Exception;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Utilities\Utils;
use App\Models\DocReqTimeline;
use App\Models\DocRequest;
use App\Models\LogRepresentative;
use App\Models\Document;
use Illuminate\Support\Str;

class RequestController extends Controller
{
    public function index(Request $request) {
        $query = DocRequest::leftJoin('users as user_req', 'requests.username', 'user_req.username')
            ->leftJoin('users as user_owner', 'requests.task_owner', 'user_owner.username')
            ->leftJoin('users as user_complete', 'requests.completed_by', 'user_complete.username')
            ->leftJoin('documents', 'requests.doc_id', 'documents.doc_id')
            ->leftJoin('students_section', 'user_req.section', 'students_section.section_id')
            ->leftJoin('students_program', 'user_req.program', 'students_program.program_id')
            ->select('requests.*',
                'documents.doc_name',
                'user_req.first_name',
                'user_req.middle_name',
                'user_req.last_name',
                DB::raw("CONCAT(IFNULL(user_owner.first_name, ''), ' ', IFNULL(user_owner.middle_name, ''), ' ', IFNULL(user_owner.last_name, '')) as task_owner_name"),
                DB::raw("CONCAT(IFNULL(user_req.first_name, ''), ' ', IFNULL(user_req.middle_name, ''), ' ', IFNULL(user_req.last_name, '')) as fullname"),
                DB::raw("DATE_FORMAT(requests.created_at, '%M %d, %Y') AS date_added"),
                DB::raw("DATE_FORMAT(requests.date_needed, '%M %d, %Y') AS date_needed"),
            );

        if($request->filter) {
            $query->where(function ($query) use ($request) {
                $query->where('user_req.username', 'LIKE' , '%'.$request->filter.'%')
                ->orWhere('user_req.first_name', 'LIKE' , '%'.$request->filter.'%')
                ->orWhere('user_req.middle_name', 'LIKE' , '%'.$request->filter.'%')
                ->orWhere('user_req.last_name', 'LIKE' , '%'.$request->filter.'%')
                ->orWhere('user_owner.first_name', 'LIKE' , '%'.$request->filter.'%')
                ->orWhere('user_owner.middle_name', 'LIKE' , '%'.$request->filter.'%')
                ->orWhere('user_owner.last_name', 'LIKE' , '%'.$request->filter.'%')
                ->orWhere('requests.reference_no', 'LIKE' , '%'.$request->filter.'%');
            });
        }

        if($request->status != '') {
            $query->where('requests.status', $request->status);
        }
        else {
            $query->where('requests.status', '<', 4);
        }

        if($request->doc_id) {
            $query->where('requests.doc_id', $request->doc_id);
        }

        if($request->created_at) {
            $query->whereDate('requests.created_at', $request->created_at);
        }

        if($request->assigned === "true") {
            $query->where(function ($query) use ($request) {
                $query->where('requests.task_owner', '!=', '')
                ->orWhere('requests.task_owner', '!=', null);
            });
        }
        else if ($request->assigned === "false") {
            $query->where(function ($query) {
                $query->whereNull('requests.task_owner')
                ->orWhere('requests.task_owner',  '');
            });
        }

        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        $query->where('requests.clientid', $authUser->clientid);

        $requests = $query->orderBy('requests.created_at')->paginate(50);

        if($requests) {
            return response()->json([
                'status' => 200,
                'requests' => $requests,
                'message' => 'Requests retrieved!',
            ]);
        }   
        else {
            return response()->json([
                'requests' => $requests,
                'message' => 'No requests found!'
            ]);
        }
    }

    public function documentselect() {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        $documents = Document::select('doc_id', 'doc_name', 'status')
            ->where('clientid', $authUser->clientid)
            ->get();

        if($documents) {
            return response()->json([
                'status' => 200,
                'documents' => $documents,
                'message' => 'Documents retrieved!',
            ]);
        }   
        else {
            return response()->json([
                'documents' => $documents,
                'message' => 'No documents  found!'
            ]);
        }
    }

    public function retrieverequest(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        $dataRetrieved = DocRequest::leftJoin('users as user_req', 'requests.username', 'user_req.username')
        ->leftJoin('users as user_owner', 'requests.task_owner', 'user_owner.username')
        ->leftJoin('users as user_complete', 'requests.completed_by', 'user_complete.username')
        ->leftJoin('documents', 'requests.doc_id', 'documents.doc_id')
        ->leftJoin('clients', 'requests.clientid', 'clients.clientid')
        ->leftJoin('students_section', 'user_req.section', 'students_section.section_id')
        ->leftJoin('students_program', 'user_req.program', 'students_program.program_id')
        ->select('requests.*',
            'documents.doc_name',
            'user_req.first_name',
            'user_req.middle_name',
            'user_req.last_name',
            DB::raw("TO_BASE64(user_req.id_picture) as id_picture"),
            DB::raw("TO_BASE64(clients.client_banner) as client_banner"),
            DB::raw("CONCAT(IFNULL(user_owner.first_name, ''), ' ', IFNULL(user_owner.middle_name, ''), ' ', IFNULL(user_owner.last_name, '')) as task_owner_name"),
            DB::raw("CONCAT(IFNULL(user_req.first_name, ''), ' ', IFNULL(user_req.middle_name, ''), ' ', IFNULL(user_req.last_name, '')) as fullname"),
            DB::raw("DATE_FORMAT(requests.created_at, '%M %d, %Y %h:%i %p') AS created_date"),
            DB::raw("DATE_FORMAT(requests.updated_at, '%M %d, %Y %h:%i %p') AS updated_date"),
            DB::raw("DATE_FORMAT(requests.date_needed, '%M %d, %Y %h:%i %p') AS date_needed"),
            )

        ->where('requests.clientid', $authUser->clientid)
        ->where('requests.reference_no', $request->data)
        ->first();
              
        
        $timelineRetrieved = DocReqTimeline::select('status','status_name', 'status_details',
            DB::raw("DATE_FORMAT(created_at, '%M %d, %Y %h:%i %p') AS created_date"),
        )
        ->where('clientid', $authUser->clientid)
        ->where('reference_no', $request->data)
        ->orderBy('status', 'DESC')
        ->get();

        if($dataRetrieved) {
            return response()->json([
                'status' => 200,
                'dataRetrieved' => $dataRetrieved,
                'timelineRetrieved' => $timelineRetrieved,
                'message' => 'Request data retrieved!',
            ]);
        }
        return response()->json([
            'dataRetrieved' => $dataRetrieved,
            'timelineRetrieved' => $timelineRetrieved,
            'message' => 'Error retrieving data!',
        ]);
    }
    
    public function assigntome(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->access_level < 10 || $authUser->access_level > 30) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }
        $updateData = [
            'task_owner' => $authUser->username,
            'status' => 1,
            'updated_by' => $authUser->fullname,
        ];

        $update = DocRequest::where('reference_no', $request->reference_no)->update($updateData);

        
        if($update) {
            DocReqTimeline::create([
                'clientid' => $authUser->clientid,
                'reference_no' => $request->reference_no,
                'status' => 1,
                'status_name' => "ON QUEUE",
                'status_details' => $authUser->name .' assigned the request under its name',
                'created_by' => $authUser->fullname,
            ]);

            LogRepresentative::create([
                'clientid' => $authUser->clientid,
                'module' => 'Requests',
                'action' => 'UPDATE',
                'details' => $authUser->name .' assigned the request under its name with reference number of '.$request->reference_no,
                'created_by' => $authUser->fullname,
            ]);
            return response()->json([
                'status' => 200,
                'message' => 'Requested document assigned successfully!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }




























    public function adddocument(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "REPRESENTATIVE" || $authUser->access_level != 30) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $validator = Validator::make($request->all(), [ 
            'doc_name' => 'required',
            'doc_limit' => 'required',
            'days_process' => 'required',
            'doc_requirements' => 'required',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }

        // Generate a unique 10-character id
        do {
            $GeneratedID = Str::upper(Str::random(10)); // Generate a random string of 15 characters
        } while (DB::table('documents')->where('doc_id', $GeneratedID)->exists());

        $add = Document::create([
            'doc_id' => $GeneratedID,
            'clientid' => $authUser->clientid,
            'doc_name' => strtoupper($request->doc_name),
            'doc_limit' => $request->doc_limit,
            'days_process' => $request->days_process,
            'doc_requirements' => $request->doc_requirements,
            'status' => 1,
            'created_by' => $authUser->fullname
        ]);

        if($add) {
            LogRepresentative::create([
                'clientid' => $authUser->clientid,
                'module' => 'Documents',
                'action' => 'ADD',
                'details' => $authUser->fullname .' added new document ' .$GeneratedID. ' - ' .$request->doc_name,
                'created_by' => $authUser->fullname,
            ]);
            return response()->json([
                'status' => 200,
                'message' => 'Document added successfully!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }

    public function retrievedocument(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();

        $dataRetrieved = Document::leftJoin('clients', 'documents.clientid', 'clients.clientid')
            ->select('documents.*',
            DB::raw("DATE_FORMAT(documents.created_at, '%M %d, %Y %h:%i %p') AS created_date"),
            DB::raw("DATE_FORMAT(documents.updated_at, '%M %d, %Y %h:%i %p') AS updated_date"),
            DB::raw("TO_BASE64(clients.client_logo) as client_logo"),
            DB::raw("TO_BASE64(clients.client_banner) as client_banner"),
            )
            ->where('documents.clientid', $authUser->clientid)
            ->where('documents.doc_id', $request->data)
            ->first();        

        if($dataRetrieved) {
            return response()->json([
                'status' => 200,
                'dataRetrieved' => $dataRetrieved,
                'message' => 'Document data retrieved!',
            ]);
        }
        return response()->json([
            'dataRetrieved' => $dataRetrieved,
            'message' => 'Error retrieving data!',
        ]);
    }

    public function updatedocument(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "REPRESENTATIVE" || $authUser->access_level != 30) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $validator = Validator::make($request->all(), [
            'doc_id' => 'required',
            'doc_name' => 'required',
            'doc_limit' => 'required',
            'days_process' => 'required',
            'doc_requirements' => 'required',
            'status' => 'required',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }
        $updateData = [
            'doc_name' => strtoupper($request->doc_name),
            'doc_limit' => $request->doc_limit,
            'days_process' => $request->days_process,
            'doc_requirements' => $request->doc_requirements,
            'status' => $request->status,
            'updated_by' => $authUser->fullname,
        ];

        $existingKeys = Document::where('doc_id', $request->doc_id)->first();
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

        $update = Document::where('doc_id', $request->doc_id)->update($updateData);

        if($update) {
            if (!empty($changes)) {
                LogRepresentative::create([
                    'clientid' => $authUser->clientid,
                    'module' => 'Documents',
                    'action' => 'UPDATE',
                    'details' => $authUser->fullname .' updated document '.$request->doc_id. ' with the following changes: ' . json_encode($changes),
                    'created_by' => $authUser->fullname,
                ]);
            }
            return response()->json([
                'status' => 200,
                'message' => 'Document updated successfully!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }


}
