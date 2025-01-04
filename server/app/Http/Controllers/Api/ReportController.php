<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Report;
use App\Models\ReportComment;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    public function index() {
        $pendingreports = Report::leftJoin('users', 'reports.created_by', '=', 'users.username')
            ->select('reports.*', 'users.first_name as reported_by', 'users.contact', 
            DB::raw("DATE_FORMAT(reports.created_at, '%M %d, %Y %h:%i %p') AS report_datetime"),
            DB::raw("DATE_FORMAT(reports.date_happen, '%M %d, %Y') AS date_happen"),
            DB::raw("TIME_FORMAT(reports.time_happen, '%h:%i %p') AS time_happen"),
            DB::raw("
                CASE 
                    WHEN reports.priority_level = 3 THEN 'urgent'
                    WHEN reports.priority_level = 2 THEN 'important'
                    ELSE 'normal'
                END AS priority
            "))
            ->where('reports.status', 0)
            ->orderBy('reports.created_at', 'DESC')
            ->get();

        $resolvedreports = Report::leftJoin('users', 'reports.created_by', '=', 'users.username')
            ->select('reports.*', 'users.first_name as reported_by', 'users.contact', 
            DB::raw("DATE_FORMAT(reports.created_at, '%M %d, %Y %h:%i %p') AS report_datetime"),
            DB::raw("DATE_FORMAT(reports.date_happen, '%M %d, %Y') AS date_happen"),
            DB::raw("TIME_FORMAT(reports.time_happen, '%h:%i %p') AS time_happen"),
            DB::raw("
                CASE 
                    WHEN reports.priority_level = 3 THEN 'urgent'
                    WHEN reports.priority_level = 2 THEN 'important'
                    ELSE 'normal'
                END AS priority
            "))
            ->where('reports.status', 1)
            ->orderBy('reports.created_at', 'DESC')
            ->get();

        $reports = [
            'pendingreports' => $pendingreports,
            'resolvedreports' => $resolvedreports,
        ];

        return response()->json([
            'reports' => $reports,
        ]);
    }

    // retrieve specific event's information
    public function retrieve(Request $request) {
        $report = Report::where('id', $request->id)->first();
        $comments = ReportComment::select('*',
            DB::raw("DATE_FORMAT(created_at, '%M %d, %Y %h:%i %p') AS comment_date"))
            ->where('report_id', $request->id)->get();
        
        if($report) {
            return response()->json([
                'status' => 200,
                'report' => $report,
                'comments' => $comments,
                'message' => "Report data retrieved!"
            ], 200);
        }
        else {
            return response()->json([
                'report' => $report,
                'comments' => $comments,
                'message' => "Report not found!"
            ]);
        }
    }

    public function submitcomment(Request $request) {
        $authUser = User::select('first_name')->where('username', Auth::user()->username)->first();

        ReportComment::create([
            'report_id' => $request->id,
            'comment' => $request->comment,
            'first_name' => $authUser->first_name,
            'created_by' => $authUser->first_name,
        ]);

        $comments = ReportComment::select('*',
            DB::raw("DATE_FORMAT(created_at, '%M %d, %Y %h:%i %p') AS comment_date"))
            ->where('report_id', $request->id)->get();
        
        if($comments) {
            return response()->json([
                'status' => 200,
                'comments' => $comments,
            ], 200);
        }
        else {
            return response()->json([
                'comments' => $comments,
                'message' => "Something went wrong! Try again later."
            ]);
        }
    }

    // update specific admin's information
    public function updatereport(Request $request) {
        $authUser = User::select('first_name')->where('username', Auth::user()->username)->first();

        $validator = Validator::make($request->all(), [
            'title' => 'required',
            'location' => 'required',
            'description' => 'required',
            'priority_level' => 'required',
            'status' => 'required',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }
        else {
            try {
                $update = Report::where('id', $request->id)
                ->update([
                    'title' => strtoupper($request->title),
                    'description' => $request->description,
                    'location' => $request->location,
                    'priority_level' => $request->priority_level,
                    'date_happen' => $request->date_happen,
                    'time_happen' => $request->time_happen,
                    'status' => $request->status,
                    'updated_by' => $authUser->first_name,
                ]);

            if($update) {
                return response()->json([
                    'status' => 200,
                    'message' => 'Report updated successfully!'
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

    public function addreport(Request $request) {
        $authUser = User::where('username', Auth::user()->username)->first();

        $validator = Validator::make($request->all(), [ 
            'title' => 'required',
            'location' => 'required',
            'description' => 'required',
            'priority_level' => 'required',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }

        $add = Report::create([
            'title' => strtoupper($request->title),
            'description' => $request->description,
            'location' => $request->location,
            'contact' => $authUser->contact,
            'priority_level' => $request->priority_level,
            'date_happen' => $request->date_happen,
            'time_happen' => $request->time_happen,
            'status' => 0,
            'created_by' => Auth::user()->username,
        ]);

        if($add) {
            return response()->json([
                'status' => 200,
                'message' => 'Report added successfully!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }

    public function deletereport(Request $request) {
        $delete = Report::where('id', $request->id)->delete();

        if($delete) {
            return response()->json([
                'status' => 200,
                'message' => 'Report removed successfully!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }

    public function resolvereport(Request $request) {
        $authUser = Auth::user();

        if($authUser->role !== "ADMIN" || $authUser->access_level < 10) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $update = Report::where('id', $request->id)->update([ 'status' => 1]);
        if($update) {
            return response()->json([
                'status' => 200,
                'message' => 'Report is now Resolved!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }

    public function reopenreport(Request $request) {
        $authUser = Auth::user();

        if($authUser->role !== "ADMIN" || $authUser->access_level < 10) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $update = Report::where('id', $request->id)->update([ 'status' => 0]);
        if($update) {
            return response()->json([
                'status' => 200,
                'message' => 'Report is now Re-opened!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }
    
}
