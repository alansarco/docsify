<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Http\Controllers\Utilities\Utils;
use App\Models\DocRequest;

class StudentRequestController extends Controller
{
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
                ->orWhere('requests.reference_no', 'LIKE' , '%'.$request->filter.'%');
            });
        }

        if($request->status != '') {
            $query->where('requests.status', $request->status);
        }
        else {
            $query->where('requests.status', '>', 3);
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
}