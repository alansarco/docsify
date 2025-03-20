<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Utilities\Utils;
use App\Models\DocReqTimeline;
use App\Models\DocRequest;
use App\Models\LogRepresentative;
use App\Models\Document;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Http;

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
                DB::raw("CASE WHEN CURDATE() > requests.date_needed THEN DATEDIFF(CURDATE(), requests.date_needed) ELSE 0 END AS days_overdue")
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
            $query->where(function ($query) {
                $query->where('requests.status', '<', 4)->orWhere('requests.status', 7);
            });
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

    public function historyrequests(Request $request) {
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
                DB::raw("DATE_FORMAT(requests.date_completed, '%M %d, %Y') AS date_completed"),
                DB::raw("CASE WHEN requests.date_completed > requests.date_needed THEN DATEDIFF(requests.date_completed, requests.date_needed) ELSE 0 END AS days_overdue")
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
            $query->where('requests.status', '>', 3);
            $query->where('requests.status', '<', 7);
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
            DB::raw("DATE_FORMAT(requests.date_completed, '%M %d, %Y %h:%i %p') AS date_completed"),
            )

        ->where('requests.clientid', $authUser->clientid)
        ->where('requests.reference_no', $request->data)
        ->first();
              
        
        $timelineRetrieved = DocReqTimeline::select('status','status_name', 'status_details',
            DB::raw("DATE_FORMAT(created_at, '%M %d, %Y %h:%i %p') AS created_date"),
        )
        ->where('clientid', $authUser->clientid)
        ->where('reference_no', $request->data)
        ->orderBy('created_at', 'DESC')
        ->orderBy('status', 'DESC')
        ->get();

        $statusRetrieved = DocReqTimeline::where('clientid', $authUser->clientid)
        ->where('reference_no', $request->data)
        ->where('status', '<', 5)
        ->orderBy('status', 'DESC')
        ->value('status');

        if($dataRetrieved) {
            return response()->json([
                'status' => 200,
                'dataRetrieved' => $dataRetrieved,
                'timelineRetrieved' => $timelineRetrieved,
                'statusRetrieved' => $statusRetrieved,
                'message' => 'Request data retrieved!',
            ]);
        }
        return response()->json([
            'dataRetrieved' => $dataRetrieved,
            'timelineRetrieved' => $timelineRetrieved,
            'statusRetrieved' => $statusRetrieved,
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

    public function updaterequeststatus(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();

        $getStatus = new Utils;
        $getStatus = $getStatus->getStatus($request->status);
        
        if($authUser->role !== "REGISTRAR" || $authUser->access_level != 10) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }
        $validator = Validator::make($request->all(), [
            'reference_no' => 'required',
            'status_details' => 'required',
            'status' => 'required',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }

        $checkrequest = DocRequest::where('reference_no', $request->reference_no)->first();

        if(!$checkrequest) {
            return response()->json([
                'message' => 'Request not found!'
            ]);
        }
        else if($checkrequest->status == 4) {
            return response()->json([
                'message' => 'Cannot update request, this has already been completed!'
            ]);
        }
        else if($checkrequest->status > 4 && $checkrequest->status < 7) {
            return response()->json([
                'message' => 'Cannot update request, this has already been cancelled/rejected!'
            ]);
        }

        if($checkrequest->task_owner != $authUser->username) {
            return response()->json([
                'message' => 'You do not own this task, someone just change it. Please refresh!'
            ]);
        }

        $today = Carbon::today();

        $createTimeline = [
            'clientid' => $checkrequest->clientid,
            'reference_no' => $checkrequest->reference_no,
            'status' => $request->status,
            'status_name' => $getStatus,
            'status_details' => $request->status_details,
            'created_at' => $today,
            'updated_by' => $authUser->fullname,
        ];

        $update = DocRequest::where('reference_no', $request->reference_no)
        ->limit(1) // Ensures only one record is affected
        ->update([
            'status' => $request->status,
            'completed_by' => $request->status == 4 ? $authUser->fullname : null,
            'date_completed' => $request->status == 4 ? $today : null,
            'updated_by' => $authUser->fullname,
        ]);
    
        if($update) {
            DocReqTimeline::create($createTimeline);
            $documentName = DocRequest::leftJoin('documents', 'requests.doc_id', 'documents.doc_id')
                ->select('documents.doc_name')
                ->where('reference_no', $request->reference_no)->first();

            if($authUser->contact) {
                $details = $request->status_details;
                $reference_no = $request->reference_no;
                $documentName = $documentName->doc_name ?? '';
                $message = "Hello! your Requested Document ($documentName) with Refence Number of $reference_no is $getStatus\n\n"
                    . "Details: $details\n";

                $number = $authUser->contact;

                Http::asForm()->post('https://semaphore.co/api/v4/messages', [
                    'apikey' => '191998cd60101ec1f81b319a063fb06a',
                    'number' => $number,
                    'message' => $message,
                    'sender_name' => '',
                ]);
            }

            LogRepresentative::create([
                'clientid' => $authUser->clientid,
                'module' => 'Requests',
                'action' => 'UPDATE',
                'details' => $authUser->name .' updated the request status to '.$getStatus.', with reference number of '.$checkrequest->reference_no,
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

    public function representativeselect() {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        $representatives = User::select('username', 'access_level', 'role',
            DB::raw("CONCAT(IFNULL(first_name, ''), ' ', IFNULL(middle_name, ''), ' ', IFNULL(last_name, '')) as fullname"),
            )
            ->where('access_level', 10)
            ->where('account_status', 1)
            ->where('clientid', $authUser->clientid)
            ->get();

        if($representatives) {
            return response()->json([
                'status' => 200,
                'representatives' => $representatives,
                'message' => 'Representatives retrieved!',
            ]);
        }   
        else {
            return response()->json([
                'representatives' => $representatives,
                'message' => 'No representatives  found!'
            ]);
        }
    }

    public function assignregistrar(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "REPRESENTATIVE" || $authUser->access_level != 30) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $validator = Validator::make($request->all(), [
            'reference_no' => 'required',
            'task_owner' => 'required',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }

        $checkrequest = DocRequest::where('reference_no', $request->reference_no)->first();
        $checkuser = User::
            select(
                DB::raw("CONCAT(IFNULL(username, ''), ' - ', IFNULL(first_name, ''), ' ', IFNULL(middle_name, ''), ' ', IFNULL(last_name, '')) as fullname"))
            ->where('username', $request->task_owner)->first();

        $getStatus = new Utils;
        $getStatus = $getStatus->getStatus($checkrequest->status);

        if(!$checkrequest) {
            return response()->json([
                'message' => 'Request not found!'
            ]);
        }
        $today = Carbon::today();
        $status = $checkrequest->status;
        if($status == 0) {
            $status = 1;
            $getStatus = "ON QUEUE";
        }

        $updateRequest = [
            'status' => $status,
            'task_owner' => $request->task_owner,
            'updated_at' => $today,
            'updated_by' => $authUser->fullname,
        ];


        $createTimeline = [
            'clientid' => $checkrequest->clientid,
            'reference_no' => $checkrequest->reference_no,
            'status' => $status,
            'status_name' => $getStatus,
            'status_details' => 'Request document assigned to '.$checkuser->fullname,
            'created_at' => $today,
            'updated_by' => $authUser->fullname,
        ];

        $update = DocRequest::where('reference_no', $request->reference_no)->update($updateRequest);
        
        if($update) {
            DocReqTimeline::create($createTimeline);

            LogRepresentative::create([
                'clientid' => $authUser->clientid,
                'module' => 'Requests',
                'action' => 'UPDATE',
                'details' => $authUser->name .' assigned requested document to '.$checkuser->fullname.', with reference number of '.$checkrequest->reference_no,
                'created_by' => $authUser->fullname,
            ]);
            return response()->json([
                'status' => 200,
                'message' => 'Registrar assigned successfully!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }
}
