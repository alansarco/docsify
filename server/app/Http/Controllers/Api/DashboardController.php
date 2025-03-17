<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Utilities\Utils;
use App\Models\Client;
use App\Models\DocRequest;
use App\Models\SystemIncome;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    //returns data of Ither Statistics
    public function OtherStatistics() 
    {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();

        $currentYear = Carbon::now()->format('Y');
        $today = Carbon::today();
        $totalIncome = [];
        
        for ($x = 0; $x <= 10; $x++) {
            $income = SystemIncome::where('year_sold',   $currentYear)->sum('price');
            $totalIncome[$currentYear] = $income;
            $currentYear--;
        }

        $income = SystemIncome::sum('price');

        $activeclients = Client::where('subscription_end', '>=', $today)->count();
        $inactiveclients = Client::where('subscription_end', '<', $today)->count();

        $data1 = User::where('role', "ADMIN")->count();
        $data2 = User::where('role', "REPRESENTATIVE")->count();
        $data3 = User::where('role', "REGISTRAR")->count();
        $data4 = User::where('role', "USER")->count();

        $gradeCounts = User::select(
            DB::raw("IFNULL(SUM(CASE WHEN grade = 7 THEN 1 ELSE 0 END), 0) as grade7"),
            DB::raw("IFNULL(SUM(CASE WHEN grade = 8 THEN 1 ELSE 0 END), 0) as grade8"),
            DB::raw("IFNULL(SUM(CASE WHEN grade = 9 THEN 1 ELSE 0 END), 0) as grade9"),
            DB::raw("IFNULL(SUM(CASE WHEN grade = 10 THEN 1 ELSE 0 END), 0) as grade10"),
            DB::raw("IFNULL(SUM(CASE WHEN grade = 11 THEN 1 ELSE 0 END), 0) as grade11"),
            DB::raw("IFNULL(SUM(CASE WHEN grade = 12 THEN 1 ELSE 0 END), 0) as grade12"),
            DB::raw("IFNULL(SUM(CASE WHEN grade < 7 AND grade > 12 THEN 1 ELSE 0 END), 0) as others"),
        )
        ->where('role', "USER")
        ->where('clientid', $authUser->clientid)
        ->first();

        $registrarCounts = User::select(
            DB::raw("IFNULL(SUM(CASE WHEN role = 'REGISTRAR' AND account_status = 1 THEN 1 ELSE 0 END), 0) as active"),
            DB::raw("IFNULL(SUM(CASE WHEN role = 'REGISTRAR' AND account_status != 1 THEN 1 ELSE 0 END), 0) as inactive")
        )
        ->where('clientid', $authUser->clientid)
        ->first();

        $taskDistribution = DocRequest::select(
            DB::raw("IFNULL(SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END), 0) as pending"),
            DB::raw("IFNULL(SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END), 0) as queue"),
            DB::raw("IFNULL(SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END), 0) as processing"),
            DB::raw("IFNULL(SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END), 0) as releasing"),
            DB::raw("IFNULL(SUM(CASE WHEN status = 4 AND DATE(date_completed) = '$today' THEN 1 ELSE 0 END), 0) as completed"),
            DB::raw("IFNULL(SUM(CASE WHEN status = 5 AND DATE(date_completed) = '$today' THEN 1 ELSE 0 END), 0) as rejected"),
            DB::raw("
                IFNULL(SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END), 0) +
                IFNULL(SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END), 0) +
                IFNULL(SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END), 0) +
                IFNULL(SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END), 0) +
                IFNULL(SUM(CASE WHEN status = 4 AND DATE(date_completed) = '$today' THEN 1 ELSE 0 END), 0) +
                IFNULL(SUM(CASE WHEN status = 5 AND DATE(date_completed) = '$today' THEN 1 ELSE 0 END), 0) as maximum
            ")
        )
        ->where('clientid', $authUser->clientid)
        ->first();

        $mytask = DocRequest::leftJoin('users', 'requests.username', 'users.username')
            ->leftJoin('documents', 'requests.doc_id', 'documents.doc_id')
            ->leftJoin('students_section', 'users.section', 'students_section.section_id')
            ->leftJoin('students_program', 'users.program', 'students_program.program_id')
            ->select(
                'requests.status',
                'requests.reference_no',
                'documents.doc_name',
                DB::raw("CONCAT(IFNULL(users.first_name, ''), ' ', IFNULL(users.middle_name, ''), ' ', IFNULL(users.last_name, '')) as fullname"),
                DB::raw("DATE_FORMAT(requests.created_at, '%M %d, %Y') AS date_added"),
                DB::raw("DATE_FORMAT(requests.date_needed, '%M %d, %Y') AS date_needed"),
                DB::raw("CASE WHEN CURDATE() > requests.date_needed THEN DATEDIFF(CURDATE(), requests.date_needed) ELSE 0 END AS days_overdue")
            )
            ->where('requests.status', '<', 4)
            ->where('requests.clientid', $authUser->clientid)
            ->where('requests.task_owner', $authUser->username)
            ->orderBy('requests.created_at')
            ->get();

        $myRequests = DocRequest::select(
            DB::raw("IFNULL(SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END), 0) as pending"),
            DB::raw("IFNULL(SUM(CASE WHEN status > 0 AND status < 4 THEN 1 ELSE 0 END), 0) as ongoing"),
            DB::raw("IFNULL(SUM(CASE WHEN status = 4 THEN 1 ELSE 0 END), 0) as completed"),
            DB::raw("IFNULL(SUM(CASE WHEN status = 5 THEN 1 ELSE 0 END), 0) as rejected"),
        )
        ->where('clientid', $authUser->clientid)
        ->where('username', $authUser->username)
        ->first();

        $myTaskCard = DocRequest::select(
            DB::raw("IFNULL(SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END), 0) as pending"),
            DB::raw("IFNULL(SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END), 0) as queue"),
            DB::raw("IFNULL(SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END), 0) as processing"),
            DB::raw("IFNULL(SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END), 0) as releasing"),
            DB::raw("IFNULL(SUM(CASE WHEN status = 4 THEN 1 ELSE 0 END), 0) as completed"),
            DB::raw("IFNULL(SUM(CASE WHEN status = 5 THEN 1 ELSE 0 END), 0) as rejected"),
            DB::raw("IFNULL(SUM(CASE WHEN status > 0 AND status < 4 
                AND DATE(date_needed) < '$today'
                THEN 1 ELSE 0 END), 0) as overdue"),
        )
        ->where('clientid', $authUser->clientid)
        ->where('task_owner', $authUser->username)
        ->first();

        $myRecentRequests = DocRequest::leftJoin('documents', 'requests.doc_id', 'documents.doc_id')
            ->select('documents.doc_name', 'requests.reference_no', 'requests.updated_by', 'requests.updated_at', 'requests.status',
                    DB::raw("DATE_FORMAT(requests.updated_at, '%M %d, %Y %h:%i %p') AS updated_date")
                )
        ->where('requests.clientid', $authUser->clientid)
        ->where('requests.username', $authUser->username)
        ->orderBy('requests.updated_at', 'DESC')
        ->limit(5)
        ->get();
        
        $otherStats = [
            'data1' => $data1,
            'data2' => $data2,
            'data3' => $data3,
            'data4' => $data4,
            'data5' => $activeclients,
            'data6' => $inactiveclients,
            'data7' => $income,
            'totalIncome' => $totalIncome,
            'gradeCounts' => $gradeCounts,
            'registrarCounts' => $registrarCounts,
            'taskDistribution' => $taskDistribution,
            'mytask' => $mytask,
            'myRequests' => $myRequests,
            'myTaskCard' => $myTaskCard,
            'myRecentRequests' => $myRecentRequests,
        ];


        return response()->json([
            'otherStats' => $otherStats,
        ]);
    }

    //returns counts of AdminNotifications
    public function AdminNotifications() 
    {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();

        $adminnotifs = Client::leftJoin('users', 'clients.client_representative', 'users.username')
            ->select('clients.clientid', 'clients.client_name',
            DB::raw("CONCAT(COALESCE(users.first_name, ''),' ',COALESCE(users.middle_name, ''),' ',COALESCE(users.last_name, '')) AS representative"),
            DB::raw("DATE_FORMAT(clients.created_at, '%M %d, %Y %h:%i %p') AS created_date"))
            ->whereDate('clients.created_at', Carbon::today())
            ->orderBy('clients.created_at', 'DESC')
            ->limit(10)
            ->get();

        $repnotifs = User::leftJoin('clients', 'users.clientid', 'clients.clientid')
            ->select('users.username', 'users.clientid', 'users.account_status',
                DB::raw("CONCAT(COALESCE(users.first_name, ''),' ',COALESCE(users.middle_name, ''),' ',COALESCE(users.last_name, '')) AS fullname"),
                DB::raw("DATE_FORMAT(users.created_at, '%M %d, %Y %h:%i %p') AS created_date"))
            ->where('users.clientid', $authUser->clientid)
            ->where('users.account_status', 0)
            ->whereRaw('users.created_at = users.updated_at') 
            ->orderBy('users.created_at', 'DESC')
            ->limit(10)
            ->get();

        $regnotifs = DocRequest::leftJoin('documents', 'requests.doc_id', 'documents.doc_id')
            ->leftJoin('users', 'requests.task_owner', 'users.username')
            ->select('requests.reference_no', 'requests.clientid', 'requests.username', 
                'requests.status', 'requests.notify_indicator', 'documents.doc_name', 
                DB::raw("CONCAT(COALESCE(users.first_name, ''),' ',COALESCE(users.middle_name, ''),' ',COALESCE(users.last_name, '')) AS task_owner"),
                DB::raw("DATE_FORMAT(requests.updated_at, '%M %d, %Y %h:%i %p') AS updated_date"),
                DB::raw("DATE_FORMAT(requests.date_needed, '%M %d, %Y') AS date_needed"),
                )
            ->where('requests.clientid', $authUser->clientid)
            ->where('requests.notify_indicator', 1)
            ->where('requests.status', 1)
            ->whereDate('requests.updated_at', Carbon::today())
            ->orderBy('requests.updated_at', 'DESC')
            ->limit(10)
            ->get();

        $studentnotifs = DocRequest::leftJoin('documents', 'requests.doc_id', 'documents.doc_id')
            ->select('requests.reference_no', 'requests.clientid', 'requests.username', 
                'requests.status', 'requests.notify_indicator', 'documents.doc_name', 
            DB::raw("DATE_FORMAT(requests.updated_at, '%M %d, %Y %h:%i %p') AS updated_date"))
            ->where('requests.clientid', $authUser->clientid)
            ->where('requests.username', $authUser->username)
            ->where('requests.notify_indicator', 1)
            ->where('requests.status', '>=', 0)
            ->where('requests.status', '<', 4)
            ->whereDate('requests.updated_at', Carbon::today())
            ->orderBy('requests.updated_at', 'DESC')
            ->limit(10)
            ->get();

        
        $adminnotifs = [
            'adminnotifs' => $adminnotifs,
            'repnotifs' => $repnotifs,
            'regnotifs' => $regnotifs,
            'studentnotifs' => $studentnotifs,
        ];
        if($adminnotifs) {
            return response()->json([
                'message' => 'Notifications retrieved!',
                'adminnotifs' => $adminnotifs,
            ]);
        }
        return response()->json([
            'message' => "No Notifications!"
        ]);
    }
}
