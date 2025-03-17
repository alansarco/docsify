<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Utilities\Utils;
use App\Models\Client;
use App\Models\DocRequest;
use App\Models\SystemIncome;
use App\Models\Transferee;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class AnalyticsController extends Controller
{
    //returns data of Ither Statistics
    public function studentanalyticschart() 
    {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();

        $currentYear = Carbon::now()->format('Y');
        $currentYear1 = Carbon::now()->format('Y');
        $today = Carbon::today();
        $totalusers = [];
        $totalusersprev = 0;
        $totaluserscount = 0;

        //All GR7
        $YearGR7 = Carbon::now()->format('Y');
        $totalusersGR7 = [];
        for ($x = 0; $x <= 10; $x++) {
            $totaluserscount = DB::table('users')
                ->where('year_enrolled',   $YearGR7)
                ->where('access_level', 5)
                ->where('grade', 7)
                ->where('clientid', $authUser->clientid)
                ->count();
            $totalusersGR7[$YearGR7] = $totaluserscount;
            $YearGR7--;
        }   

        //All GR8
        $YearGR8 = Carbon::now()->format('Y');
        $totalusersGR8 = [];
        for ($x = 0; $x <= 10; $x++) {
            $totaluserscount = DB::table('users')
                ->where('year_enrolled',   $YearGR8)
                ->where('access_level', 5)
                ->where('grade', 8)
                ->where('clientid', $authUser->clientid)
                ->count();
            $totalusersGR8[$YearGR8] = $totaluserscount;
            $YearGR8--;
        }   
               
        //All GR9
        $YearGR9 = Carbon::now()->format('Y');
        $totalusersGR9 = [];
        for ($x = 0; $x <= 10; $x++) {
            $totaluserscount = DB::table('users')
                ->where('year_enrolled',   $YearGR9)
                ->where('access_level', 5)
                ->where('grade', 9)
                ->where('clientid', $authUser->clientid)
                ->count();
            $totalusersGR9[$YearGR9] = $totaluserscount;
            $YearGR9--;
        }

        //All GR10
        $YearGR10 = Carbon::now()->format('Y');
        $totalusersGR10 = [];
        for ($x = 0; $x <= 10; $x++) {
            $totaluserscount = DB::table('users')
                ->where('year_enrolled',   $YearGR10)
                ->where('access_level', 5)
                ->where('grade', 10)
                ->where('clientid', $authUser->clientid)
                ->count();
            $totalusersGR10[$YearGR10] = $totaluserscount;
            $YearGR10--;
        }

        //All GR11
        $YearGR11 = Carbon::now()->format('Y');
        $totalusersGR11 = [];
        for ($x = 0; $x <= 10; $x++) {
            $totaluserscount = DB::table('users')
                ->where('year_enrolled',   $YearGR11)
                ->where('access_level', 5)
                ->where('grade', 11)
                ->where('clientid', $authUser->clientid)
                ->count();
            $totalusersGR11[$YearGR11] = $totaluserscount;
            $YearGR11--;
        }

        //All GR12
        $YearGR12 = Carbon::now()->format('Y');
        $totalusersGR12 = [];
        for ($x = 0; $x <= 10; $x++) {
            $totaluserscount = DB::table('users')
                ->where('year_enrolled',   $YearGR12)
                ->where('access_level', 5)
                ->where('grade', 12)
                ->where('clientid', $authUser->clientid)
                ->count();
            $totalusersGR12[$YearGR12] = $totaluserscount;
            $YearGR12--;
        }

        //All Students
        for ($x = 0; $x <= 10; $x++) {
            $totaluserscount = DB::table('users')->where('year_enrolled',   $currentYear)
                ->where('access_level', 5)
                ->where('clientid', $authUser->clientid)
                ->count();
            $totalusers[$currentYear] = $totaluserscount;
            if($x == 1) {
                $totalusersprev = $totaluserscount;
            }
            $currentYear--;
        }

        $totaluserscount = DB::table('users')
            ->where('year_enrolled',   $currentYear1)
            ->where('access_level', 5)
            ->where('clientid', $authUser->clientid)
            ->count();

        $percentageChange = $totalusersprev != 0  ? 
            number_format((($totaluserscount - $totalusersprev) / abs($totalusersprev)) * 100, 2) : 0;

        $studentanalyticschart = [
            'totaluserscount' => $totaluserscount,
            'totalusersprev' => $totalusersprev,
            'totalusers' => $totalusers,
            'percentageChange' => $percentageChange,

            'totalusersGR7' => $totalusersGR7,
            'totalusersGR8' => $totalusersGR8,
            'totalusersGR9' => $totalusersGR9,
            'totalusersGR10' => $totalusersGR10,
            'totalusersGR11' => $totalusersGR11,
            'totalusersGR12' => $totalusersGR12,
        ];

        return response()->json([
            'studentanalyticschart' => $studentanalyticschart,
        ]);
    }

    public function gradecounts() 
    {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        $gradecounts = User::select(
            DB::raw("IFNULL(SUM(CASE WHEN grade = 7 THEN 1 ELSE 0 END), 0) as grade7"),
            DB::raw("IFNULL(SUM(CASE WHEN grade = 8 THEN 1 ELSE 0 END), 0) as grade8"),
            DB::raw("IFNULL(SUM(CASE WHEN grade = 9 THEN 1 ELSE 0 END), 0) as grade9"),
            DB::raw("IFNULL(SUM(CASE WHEN grade = 10 THEN 1 ELSE 0 END), 0) as grade10"),
            DB::raw("IFNULL(SUM(CASE WHEN grade = 11 THEN 1 ELSE 0 END), 0) as grade11"),
            DB::raw("IFNULL(SUM(CASE WHEN grade = 12 THEN 1 ELSE 0 END), 0) as grade12"),
            DB::raw("IFNULL(SUM(CASE WHEN grade < 7 AND grade > 12 THEN 1 ELSE 0 END), 0) as others"),
        )
        ->where('access_level', 5)
        ->where('clientid', $authUser->clientid)
        ->first();

        $gradecounts = [
            'gradecounts' => $gradecounts,
        ];

        return response()->json([
            'gradecounts' => $gradecounts,
        ]);
    }
}
