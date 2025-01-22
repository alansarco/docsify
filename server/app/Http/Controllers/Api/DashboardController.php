<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Calendar;
use App\Models\Client;
use App\Models\RequestDoc;
use App\Models\SystemIncome;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    //returns data of Ither Statistics
    public function OtherStatistics() 
    {
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
        
        $otherStats = [
            'data1' => $data1,
            'data2' => $data2,
            'data3' => $data3,
            'data4' => $data4,
            'data5' => $activeclients,
            'data6' => $inactiveclients,
            'data7' => $income,
            'totalIncome' => $totalIncome,
        ];

        return response()->json([
            'otherStats' => $otherStats,
        ]);
    }

    //returns counts of AdminNotifications
    public function AdminNotifications() 
    {
        $adminnotifs = User::select('*', 
            DB::raw("CONCAT(COALESCE(first_name, ''),' ',COALESCE(middle_name, ''),' ',COALESCE(last_name, '')) AS fullname"),
            DB::raw("TO_BASE64(id_picture) as id_picture"),
            DB::raw("DATE_FORMAT(created_at, '%M %d, %Y %h:%i %p') AS created_date"))
            ->where('account_status', '!=', 1)
            ->where('notify_indicator', '!=', 1)
            ->get();

        if($adminnotifs) {
            return response()->json([
                'message' => 'Admin notifications retrieved!',
                'adminnotifs' => $adminnotifs,
            ]);
        }
        return response()->json([
            'message' => "No admin notifications!"
        ]);
    }
}
