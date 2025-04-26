<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Utilities\Utils;
use App\Models\Client;
use App\Models\DocReqTimeline;
use App\Models\DocRequest;
use App\Models\Document;
use App\Models\LogRepresentative;
use Carbon\Carbon;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class StudentRequestController extends Controller
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
                ->orWhere('requests.reference_no', 'LIKE' , '%'.$request->filter.'%')
                ->orWhere('documents.doc_name', 'LIKE' , '%'.$request->filter.'%');
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

        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        $query->where('requests.clientid', $authUser->clientid);
        $query->where('requests.username', $authUser->username);

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

    public function studenthistoryrequests(Request $request) {
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
                ->orWhere('requests.reference_no', 'LIKE' , '%'.$request->filter.'%')
                ->orWhere('documents.doc_name', 'LIKE' , '%'.$request->filter.'%');
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

        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        $query->where('requests.clientid', $authUser->clientid);
        $query->where('requests.username', $authUser->username);

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

    public function cancelrequest(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "USER" || $authUser->access_level != 5) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }
        $checkStatus = DocRequest::select('status')->where('reference_no', $request->reference_no)->first();

        if($checkStatus->status > 1) {
            return response()->json([
                'message' => 'Your request is ongoing process and cannot be cancelled!'
            ]);
        }

        $updateData = [
            'status' => 6,
            'updated_by' => $authUser->fullname,
        ];

        $update = DocRequest::where('reference_no', $request->reference_no)->update($updateData);

        if($update) {
            DocReqTimeline::create([
                'clientid' => $authUser->clientid,
                'reference_no' => $request->reference_no,
                'status' => 6,
                'status_name' => "CANCELLED",
                'status_details' => 'Request has been cancelled',
                'created_by' => $authUser->fullname,
            ]);

            LogRepresentative::create([
                'clientid' => $authUser->clientid,
                'module' => 'Requests',
                'action' => 'UPDATE',
                'details' => $authUser->name .' cancelled the request with reference number of '.$request->reference_no,
                'created_by' => $authUser->fullname,
            ]);
            return response()->json([
                'status' => 200,
                'message' => 'Requested cancelled successfully!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }

    public function documentselect() {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        $documents = Document::select('doc_id', 'doc_name', 'status', 'doc_requirements', 'doc_limit', 'days_process')
            ->where('status', 1)
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

    public function addrequest(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        $getRegistrar = new Utils;
        $getRegistrar = $getRegistrar->assignAdmin();

        $today = Carbon::today();
        $hour = Carbon::now()->format('H:i:s');

        if($authUser->role !== "USER" || $authUser->access_level != 5) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $validator = Validator::make($request->all(), [ 
            'doc_id' => 'required',
            'purpose' => 'required',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }
        $getCampusLimit = Client::select('request_limit', 'request_timeout')
            ->where('clientid', $authUser->clientid)
            ->first();

        $assignedRegistrar = null;
        if(!$getRegistrar) {
            return response()->json([
                'message' => 'Sorry we cannot proceed with your request as no registrar is available!'
            ]);
        }
        else if(!$getCampusLimit) {
            return response()->json([
                'message' => 'Something went wrong retrieving school records!'
            ]);
        }
        else if($getRegistrar->request_count >= $getCampusLimit->request_limit) {
            return response()->json([
                'message' => 'Sorry we cannot proceed your request. Registrar has acquired a high volume of request today. Please try again later!'
            ]);
        }
        else if ($hour >= $getCampusLimit->request_timeout) {
            $formattedTime = Carbon::createFromFormat('H:i:s', $getCampusLimit->request_timeout)->format('h:i A'); 
            return response()->json([
                'message' => "Requests can only be made until $formattedTime!"
            ]);
        }
        else {
            $assignedRegistrar = $getRegistrar->username;
        }

        //Check if you have active request on this document
        $requestExist = DocRequest::where('username', $authUser->username)
            ->where('doc_id', $request->doc_id)
            ->where('status', '<', 4)
            ->first();
        
        if($requestExist) {
            return response()->json([
                'message' => 'You have ongoing request with this document!'
            ]);
        }

        $docInfo = Document::where('doc_id', $request->doc_id)->first();
        $checkLimit = DocRequest::where('username', $authUser->username)
            ->where('status', '!=', 5)
            ->where('status', '!=', 6)
            ->where('doc_id', $request->doc_id)
            ->whereYear('created_at', now()->year)
            ->count();
        
        if($checkLimit > $docInfo->doc_limit) {
            return response()->json([
                'message' => 'You have reached the limit of requesting this document!'
            ]);
        }


        if(!$docInfo) {
            return response()->json([
                'message' => 'Document not found or no longer active!'
            ]);
        }


        $date_needed = Carbon::parse(Carbon::today());

        if($docInfo->days_process) {
            $date_needed = Carbon::parse(Carbon::today())->addDays($docInfo->days_process);
        }

        // Generate a unique 10-character id
        do {
            $GeneratedID = Str::upper(Str::random(10)); // Generate a random string of 15 characters
        } while (DB::table('requests')->where('reference_no', $GeneratedID)->exists());

        $add = DocRequest::create([
            'reference_no' => $GeneratedID,
            'clientid' => $authUser->clientid,
            'username' => $authUser->username,
            'purpose' => $request->purpose,
            'task_owner' => $assignedRegistrar,
            'doc_id' => $request->doc_id,
            'contact' => $authUser->contact,
            'date_needed' => $date_needed,
            'status' => 1,
            'created_by' => $authUser->fullname
        ]);

        if($add) {
            $createTimeline = [
                'clientid' => $authUser->clientid,
                'reference_no' => $GeneratedID,
                'status' => 0,
                'status_name' => 'PENDING',
                'status_details' => 'Requested a document',
                'created_at' => $today,
                'created_by' => $authUser->name,
            ];
            DocReqTimeline::create($createTimeline);

            $createTimeline = [
                'clientid' => $authUser->clientid,
                'reference_no' => $GeneratedID,
                'status' => 1,
                'status_name' => 'ON QUEUE',
                'status_details' => 'Request document assigned to '.$getRegistrar->name,
                'created_at' => $today,
            ];
            DocReqTimeline::create($createTimeline);

            LogRepresentative::create([
                'clientid' => $authUser->clientid,
                'module' => 'Requests',
                'action' => 'ADD',
                'details' => $authUser->name .' added new request ' .$GeneratedID. ' - ' .$docInfo->doc_name,
                'created_by' => $authUser->fullname,
            ]);
            LogRepresentative::create([
                'clientid' => $authUser->clientid,
                'module' => 'Requests',
                'action' => 'UPDATE',
                'details' => 'Request ' .$GeneratedID. ' - ' .$docInfo->doc_name. ' has been assigned to '.$getRegistrar->fullname,
                'created_by' => $authUser->fullname,
            ]);
            return response()->json([
                'status' => 200,
                'message' => 'Request added successfully!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }
}