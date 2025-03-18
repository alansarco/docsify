<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Utilities\Utils;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsRegistrarController extends Controller
{
    //returns data of Ither Statistics
    public function registraranalyticschart(Request $request) 
    {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        $currentYear = Carbon::now()->format('Y');
        $today = Carbon::today();

        $totalusers = [];
        $chartLabel = [];
        $totalusersprev = 0;
        $totaluserscurr = 0;
        $totaluserscount = 0;

        //All Registrar
        if ($request->registrar_time == 4) {
            for ($x = 0; $x <= 10; $x++) {
                $totaluserscount = DB::table('users')
                    ->whereYear('created_at',   $currentYear)
                    ->where('access_level', 10)
                    ->where('clientid', $authUser->clientid)
                    ->count();
                $totalusers[$currentYear] = $totaluserscount;
                if($x == 1) {
                    $totalusersprev = $totaluserscount;
                } else if($x == 0) {
                    $totaluserscurr = $totaluserscount;
                }
                $chartLabel[$currentYear] = $currentYear;
                $currentYear--;
            }
        }
        else if ($request->registrar_time == 1) {
            $currentWeekStart = Carbon::now()->startOfWeek(); // Get Monday of current week
            $today = Carbon::now(); // Get today's date
        
            for ($x = 0; $x <= $today->dayOfWeek - 1; $x++) { // Loop only from Monday to today
                $day = $currentWeekStart->copy()->addDays($x);
                $dayName = $day->format('l'); // Get full day name (e.g., "Monday")
        
                $totaluserscount = DB::table('users')
                    ->whereDate('created_at', $day)
                    ->where('access_level', 10)
                    ->where('clientid', $authUser->clientid)
                    ->count();
        
                $totalusers[$dayName] = $totaluserscount;
                $chartLabel[$dayName] = $dayName;
                if ($x == $today->dayOfWeek-2) { 
                    $totalusersprev = $totaluserscount; // Previous month
                }  else if ($x == $today->dayOfWeek-1) { 
                    $totaluserscurr = $totaluserscount; // Current month
                }
            }
        }
        else if ($request->registrar_time == 2) {
            $currentMonthStart = Carbon::now()->startOfMonth(); // Get the 1st day of the month
            $today = Carbon::now(); // Get today's date
        
            for ($x = 0; $x < $today->day; $x++) { // Loop from 1st of the month up to today
                $day = $currentMonthStart->copy()->addDays($x);
                $dayNumber = $day->format('j'); // Get day number (e.g., "1", "2", ..., "15")
        
                $totaluserscount = DB::table('users')
                    ->whereDate('created_at', $day)
                    ->where('access_level', 10)
                    ->where('clientid', $authUser->clientid)
                    ->count();
        
                $totalusers[$dayNumber] = $totaluserscount;
                $chartLabel[$dayNumber] = $dayNumber;

                if ($x == $today->day - 2) { 
                    $totalusersprev = $totaluserscount; // Previous month
                }  else if ($x == $today->day - 1) { 
                    $totaluserscurr = $totaluserscount; // Current month
                }
            }
        }
        else if ($request->registrar_time == 3) {
            $currentYear = Carbon::now()->year; // Get current year
            $currentMonth = Carbon::now()->month; // Get current month (1 = Jan, 2 = Feb, etc.)

            for ($x = 1; $x <= $currentMonth; $x++) { // Loop from January (1) to current month
                $monthName = Carbon::create($currentYear, $x, 1)->format('F'); // Get full month name (e.g., "January")

                $totaluserscount = DB::table('users')
                    ->whereYear('created_at', $currentYear)
                    ->whereMonth('created_at', $x)
                    ->where('access_level', 10)
                    ->where('clientid', $authUser->clientid)
                    ->count();

                $totalusers[$monthName] = $totaluserscount;
                $chartLabel[$monthName] = $monthName;
                if ($x == $currentMonth - 1) { 
                    $totalusersprev = $totaluserscount; // Previous month
                }  else if ($x == $currentMonth) { 
                    $totaluserscurr = $totaluserscount; // Current month
                }
            }
        }

        $totalregistrars = DB::table('users')
            ->where('access_level', 10)
            ->where('clientid', $authUser->clientid)
            ->count();

        $percentageChange = $totalusersprev != 0  ? 
            number_format((($totaluserscurr - $totalusersprev) / abs($totalusersprev)) * 100, 2) : 0;

        $registraranalyticschart = [
            'totaluserscount' => $totaluserscount,
            'totalusersprev' => $totalusersprev,
            'totaluserscurr' => $totaluserscurr,
            'totalusers' => $totalusers,
            'chartLabel' => $chartLabel,
            'totalregistrars' => $totalregistrars,
            'percentageChange' => $percentageChange,
        ];

        return response()->json([
            'registraranalyticschart' => $registraranalyticschart,
        ]);
    }

    public function registrargendercounts() 
    {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        $registrargendercounts = User::select(
            DB::raw("IFNULL(SUM(CASE WHEN gender = 'M' THEN 1 ELSE 0 END), 0) as male"),
            DB::raw("IFNULL(SUM(CASE WHEN gender = 'F' THEN 1 ELSE 0 END), 0) as female"),
        )
        ->where('access_level', 10)
        ->where('clientid', $authUser->clientid)
        ->first();

        $registrargendercounts = [
            'registrargendercounts' => $registrargendercounts,
        ];

        return response()->json([
            'registrargendercounts' => $registrargendercounts,
        ]);
    }
}
