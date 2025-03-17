<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Utilities\Utils;
use App\Models\DocRequest;
use App\Models\LogRepresentative;
use App\Models\Transferee;
use App\Models\User;
use Illuminate\Support\Str;

class TransfereeController extends Controller
{
    public function index() {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();

        $transferees = Transferee::leftJoin('users' ,'students_transfer.username', '=', 'users.username')
            ->leftJoin('clients as cf', 'students_transfer.school_from', 'cf.clientid')
            ->leftJoin('clients as ct', 'students_transfer.school_to', 'ct.clientid')
            ->select('students_transfer.*', 'cf.client_name as client_from', 'ct.client_name as client_to',
            DB::raw("CONCAT(IFNULL(users.first_name, ''), ' ', IFNULL(users.middle_name, ''), ' ', IFNULL(users.last_name, '')) as fullname"),
            DB::raw("DATE_FORMAT(students_transfer.created_at, '%M %d, %Y %h:%i %p') AS date_added"))
            ->where('school_from', $authUser->clientid)
            ->orWhere('school_to', $authUser->clientid)
            ->orderBy('students_transfer.status')
            ->orderBy('students_transfer.created_at', 'DESC')
            ->paginate(50);

        if($transferees) {
            return response()->json([
                'status' => 200,
                'transferees' => $transferees,
                'message' => 'Transferees retrieved!',
            ]);
        }   
        else {
            return response()->json([
                'transferees' => $transferees,
                'message' => 'No transferees found!'
            ]);
        }
    }

    public function studentselect() {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();

        $students = User::select('username', 'clientid',
            DB::raw("CONCAT(IFNULL(username, ''), ' - ', IFNULL(first_name, ''), ' ', IFNULL(middle_name, ''), ' ', IFNULL(last_name, '')) as fullname"),
        )
        ->where('role', 'USER')
        ->where('clientid', $authUser->clientid)
        ->get();

        if($students) {
            return response()->json([
                'students' => $students,         
                'message' => "Students Found!",
            ]);
        }
        else {
            return response()->json([
                'students' => $students,         
                'message' => "No students Found!",
            ]);
        }
    }

    public function addtransferee(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "REPRESENTATIVE" || $authUser->access_level != 30) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $validator = Validator::make($request->all(), [
            'clientid' => 'required',
            'username' => 'required',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }

        $validStudent = User::where('username', $request->username)->first();
        if($validStudent) {
            $existing = Transferee::where('username', $request->username)->where('status', 0)->first();

            if($existing) {
                $updateData = [
                    'school_to' => $request->clientid,
                    'created_by' => $authUser->username,
                    'updated_by' => $authUser->username,
                ];
                $update = Transferee::where('username', $request->username)->where('status', 0)->update($updateData);
                if($update) {
                    LogRepresentative::create([
                        'clientid' => $authUser->clientid,
                        'module' => 'Transferees',
                        'action' => 'ADD',
                        'details' => $authUser->fullname .' transfer student '. $request->username .' to ' . $request->clientid,
                        'created_by' => $authUser->fullname,
                    ]);
                    return response()->json([
                        'status' => 200,
                        'message' => 'Request to transfer student successfull!'
                    ], 200);
                }
            }
            else {
                $add = Transferee::create([
                    'username' => $request->username,
                    'school_from' => $authUser->clientid,
                    'school_to' => $request->clientid,
                    'created_by' => $authUser->username,
                    'updated_by' => $authUser->username,
                ]);
                if($add) {
                    LogRepresentative::create([
                        'clientid' => $authUser->clientid,
                        'module' => 'Transferees',
                        'action' => 'ADD',
                        'details' => $authUser->fullname .' transfer student '. $request->username .' to ' . $request->clientid,
                        'created_by' => $authUser->fullname,
                    ]);
                    return response()->json([
                        'status' => 200,
                        'message' => 'Request to transfer student successfull!'
                    ], 200);
                }
            }
            return response()->json([
                'message' => 'Error transferring student!'
            ]);

        }
        else if($validStudent && $validStudent->clientid == $request->clientid) {
            return response()->json([
                'message' => 'Transfer to campus must not the same on current campus!'
            ]);
        }
        return response()->json([
            'message' => 'Student not Found!'
        ]);
    }

    public function deletetransferrequest(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "REPRESENTATIVE" || $authUser->access_level != 30) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $checkstatus = Transferee::where('id', $request->id)->first();

        if($checkstatus->status != 0) {
            return response()->json([
                'message' => 'The request is already approved/rejected, you can no longer cancel it!'
            ]);
        }

        $delete = Transferee::where('id', $request->id)->delete();
        
        if($delete) {
            LogRepresentative::create([
                'clientid' => $authUser->clientid,
                'module' => 'Transferees',
                'action' => 'DELETE',
                'details' => $authUser->fullname .' cancelled transfer request id - '. $request->id,
                'created_by' => $authUser->fullname,
            ]);
            return response()->json([
                'status' => 200,
                'message' => 'Request cancelled successfully!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }

    public function rejecttransferrequest(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "REPRESENTATIVE" || $authUser->access_level != 30) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $checkstatus = Transferee::where('id', $request->id)->first();

        if($checkstatus->status == 1) {
            return response()->json([
                'message' => 'The request is already approved, you can no longer reject it!'
            ]);
        }

        $updateData = [
            'status' => 2,
            'updated_by' => $authUser->username,
        ];
        $update = Transferee::where('id', $request->id)->update($updateData);

        if($update) {
            LogRepresentative::create([
                'clientid' => $authUser->clientid,
                'module' => 'Transferees',
                'action' => 'UPDATE',
                'details' => $authUser->fullname .' rejected transfer request id - '. $request->id,
                'created_by' => $authUser->fullname,
            ]);
            return response()->json([
                'status' => 200,
                'message' => 'Request rejected successfully!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }

    public function approvetransferrequest(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "REPRESENTATIVE" || $authUser->access_level != 30) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }
        $checkstatus = Transferee::where('id', $request->id)->first();

        if($checkstatus->status == 2) {
            return response()->json([
                'message' => 'The request is already rejected, you can no longer approve it!'
            ]);
        }

        $getdata = Transferee::select('username', 'school_to')->where('id', $request->id)->first();
        if($getdata) {
            $updateData = [
                'status' => 1,
                'updated_by' => $authUser->username,
            ];
            $updatestudent = [
                'clientid' => $getdata->school_to,
                'updated_by' => $authUser->username,
            ];
            $update = Transferee::where('id', $request->id)->update($updateData);
            User::where('username', $getdata->username)->update($updatestudent);
    
            if($update) {
                DocRequest::where('username', $getdata->username)->where('status', '<', 2)->delete();
                LogRepresentative::create([
                    'clientid' => $authUser->clientid,
                    'module' => 'Transferees',
                    'action' => 'UPDATE',
                    'details' => $authUser->fullname .' approved transfer request id - '. $request->id,
                    'created_by' => $authUser->fullname,
                ]);
                return response()->json([
                    'status' => 200,
                    'message' => 'Request approved successfully!'
                ], 200);
            }
            return response()->json([
                'message' => 'Something went wrong!'
            ]);
        }
        return response()->json([
            'message' => 'Data not found!'
        ]);
    }
}
