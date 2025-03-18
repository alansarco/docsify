<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Utilities\Utils;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsStudentController extends Controller
{
    //returns data of Ither Statistics
    public function studentanalyticschart(Request $request) 
    {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        $currentYear = Carbon::now()->format('Y');
        $today = Carbon::today();

        $totalusers = [];
        $studentLabel = [];
        $totalusersprev = 0;
        $totaluserscurr = 0;
        $totaluserscount = 0;

        //All GR7
        $YearGR7 = Carbon::now()->format('Y');
        $totalusersGR7 = [];
        if(!$request->grade || $request->grade == 7) {            
            if($request->student_time == 4) {
                //this is decade
                for ($x = 0; $x <= 10; $x++) {
                    $totaluserscount = DB::table('users')
                        ->whereYear('created_at',   $YearGR7)
                        ->where('access_level', 5)
                        ->where('grade', 7)
                        ->where('clientid', $authUser->clientid)
                        ->count();
                    $totalusersGR7[$YearGR7] = $totaluserscount;
                    if($x == 1) {
                        $totalusersprev = $totaluserscount;
                    } else if($x == 0) {
                        $totaluserscurr = $totaluserscount;
                    }
                    $studentLabel[$YearGR7] = $YearGR7;
                    $YearGR7--;
                }   
            }
            else if ($request->student_time == 1) {
                $currentWeekStart = Carbon::now()->startOfWeek(); // Get Monday of current week
                $today = Carbon::now(); // Get today's date
            
                for ($x = 0; $x <= $today->dayOfWeek - 1; $x++) { // Loop only from Monday to today
                    $day = $currentWeekStart->copy()->addDays($x);
                    $dayName = $day->format('l'); // Get full day name (e.g., "Monday")
            
                    $totaluserscount = DB::table('users')
                        ->whereDate('created_at', $day)
                        ->where('access_level', 5)
                        ->where('grade', 7)
                        ->where('clientid', $authUser->clientid)
                        ->count();
            
                    $totalusersGR7[$dayName] = $totaluserscount;
                    $studentLabel[$dayName] = $dayName;
                    if ($x == $today->dayOfWeek-2) { 
                        $totalusersprev = $totaluserscount; // Previous month
                    }  else if ($x == $today->dayOfWeek-1) { 
                        $totaluserscurr = $totaluserscount; // Current month
                    }
                }
            }
            else if ($request->student_time == 2) {
                $currentMonthStart = Carbon::now()->startOfMonth(); // Get the 1st day of the month
                $today = Carbon::now(); // Get today's date
            
                for ($x = 0; $x < $today->day; $x++) { // Loop from 1st of the month up to today
                    $day = $currentMonthStart->copy()->addDays($x);
                    $dayNumber = $day->format('j'); // Get day number (e.g., "1", "2", ..., "15")
            
                    $totaluserscount = DB::table('users')
                        ->whereDate('created_at', $day)
                        ->where('access_level', 5)
                        ->where('grade', 7)
                        ->where('clientid', $authUser->clientid)
                        ->count();
            
                    $totalusersGR7[$dayNumber] = $totaluserscount;
                    $studentLabel[$dayNumber] = $dayNumber;
                    if ($x == $today->day - 2) { 
                        $totalusersprev = $totaluserscount; // Previous month
                    }  else if ($x == $today->day - 1) { 
                        $totaluserscurr = $totaluserscount; // Current month
                    }
                }
            }
            else if ($request->student_time == 3) {
                $currentYear = Carbon::now()->year; // Get current year
                $currentMonth = Carbon::now()->month; // Get current month (1 = Jan, 2 = Feb, etc.)

                for ($x = 1; $x <= $currentMonth; $x++) { // Loop from January (1) to current month
                    $monthName = Carbon::create($currentYear, $x, 1)->format('F'); // Get full month name (e.g., "January")

                    $totaluserscount = DB::table('users')
                        ->whereYear('created_at', $currentYear)
                        ->whereMonth('created_at', $x)
                        ->where('access_level', 5)
                        ->where('grade', 7)
                        ->where('clientid', $authUser->clientid)
                        ->count();

                    $totalusersGR7[$monthName] = $totaluserscount;
                    $studentLabel[$monthName] = $monthName;
                    if ($x == $currentMonth - 1) { 
                        $totalusersprev = $totaluserscount; // Previous month
                    }  else if ($x == $currentMonth) { 
                        $totaluserscurr = $totaluserscount; // Current month
                    }
                }
            }
        }

        //All GR8
        $YearGR8 = Carbon::now()->format('Y');
        $totalusersGR8 = [];
        if(!$request->grade || $request->grade == 8) {
            if ($request->student_time == 4){
                for ($x = 0; $x <= 10; $x++) {
                    $totaluserscount = DB::table('users')
                        ->whereYear('created_at',   $YearGR8)
                        ->where('access_level', 5)
                        ->where('grade', 8)
                        ->where('clientid', $authUser->clientid)
                        ->count();
                    $totalusersGR8[$YearGR8] = $totaluserscount;
                    if($x == 1) {
                        $totalusersprev = $totaluserscount;
                    } else if($x == 0) {
                        $totaluserscurr = $totaluserscount;
                    }
                    $studentLabel[$YearGR8] = $YearGR8;
                    $YearGR8--;
                }   
            }
            else if ($request->student_time == 1) {
                $currentWeekStart = Carbon::now()->startOfWeek(); // Get Monday of current week
                $today = Carbon::now(); // Get today's date
            
                for ($x = 0; $x <= $today->dayOfWeek - 1; $x++) { // Loop only from Monday to today
                    $day = $currentWeekStart->copy()->addDays($x);
                    $dayName = $day->format('l'); // Get full day name (e.g., "Monday")
            
                    $totaluserscount = DB::table('users')
                        ->whereDate('created_at', $day)
                        ->where('access_level', 5)
                        ->where('grade', 8)
                        ->where('clientid', $authUser->clientid)
                        ->count();
            
                    $totalusersGR8[$dayName] = $totaluserscount;
                    $studentLabel[$dayName] = $dayName;
                    if ($x == $today->dayOfWeek-2) { 
                        $totalusersprev = $totaluserscount; // Previous month
                    }  else if ($x == $today->dayOfWeek-1) { 
                        $totaluserscurr = $totaluserscount; // Current month
                    }
                }
            }
            else if ($request->student_time == 2) {
                $currentMonthStart = Carbon::now()->startOfMonth(); // Get the 1st day of the month
                $today = Carbon::now(); // Get today's date
            
                for ($x = 0; $x < $today->day; $x++) { // Loop from 1st of the month up to today
                    $day = $currentMonthStart->copy()->addDays($x);
                    $dayNumber = $day->format('j'); // Get day number (e.g., "1", "2", ..., "15")
            
                    $totaluserscount = DB::table('users')
                        ->whereDate('created_at', $day)
                        ->where('access_level', 5)
                        ->where('grade', 8)
                        ->where('clientid', $authUser->clientid)
                        ->count();
            
                    $totalusersGR8[$dayNumber] = $totaluserscount;
                    $studentLabel[$dayNumber] = $dayNumber;
                    if ($x == $today->day - 2) { 
                        $totalusersprev = $totaluserscount; // Previous month
                    }  else if ($x == $today->day - 1) { 
                        $totaluserscurr = $totaluserscount; // Current month
                    }
                }
            }
            else if ($request->student_time == 3) {
                $currentYear = Carbon::now()->year; // Get current year
                $currentMonth = Carbon::now()->month; // Get current month (1 = Jan, 2 = Feb, etc.)

                for ($x = 1; $x <= $currentMonth; $x++) { // Loop from January (1) to current month
                    $monthName = Carbon::create($currentYear, $x, 1)->format('F'); // Get full month name (e.g., "January")

                    $totaluserscount = DB::table('users')
                        ->whereYear('created_at', $currentYear)
                        ->whereMonth('created_at', $x)
                        ->where('access_level', 5)
                        ->where('grade', 8)
                        ->where('clientid', $authUser->clientid)
                        ->count();

                    $totalusersGR8[$monthName] = $totaluserscount;
                    $studentLabel[$monthName] = $monthName;
                    if ($x == $currentMonth - 1) { 
                        $totalusersprev = $totaluserscount; // Previous month
                    }  else if ($x == $currentMonth) { 
                        $totaluserscurr = $totaluserscount; // Current month
                    }
                }
            }
        }
               
        //All GR9
        $YearGR9 = Carbon::now()->format('Y');
        $totalusersGR9 = [];
        if(!$request->grade || $request->grade == 9) {
            if ($request->student_time == 4) {
                for ($x = 0; $x <= 10; $x++) {
                    $totaluserscount = DB::table('users')
                        ->whereYear('created_at',   $YearGR9)
                        ->where('access_level', 5)
                        ->where('grade', 9)
                        ->where('clientid', $authUser->clientid)
                        ->count();
                    $totalusersGR9[$YearGR9] = $totaluserscount;
                    if($x == 1) {
                        $totalusersprev = $totaluserscount;
                    } else if($x == 0) {
                        $totaluserscurr = $totaluserscount;
                    }
                    $studentLabel[$YearGR9] = $YearGR9;
                    $YearGR9--;
                }
            }
            else if ($request->student_time == 1) {
                $currentWeekStart = Carbon::now()->startOfWeek(); // Get Monday of current week
                $today = Carbon::now(); // Get today's date
            
                for ($x = 0; $x <= $today->dayOfWeek - 1; $x++) { // Loop only from Monday to today
                    $day = $currentWeekStart->copy()->addDays($x);
                    $dayName = $day->format('l'); // Get full day name (e.g., "Monday")
            
                    $totaluserscount = DB::table('users')
                        ->whereDate('created_at', $day)
                        ->where('access_level', 5)
                        ->where('grade', 9)
                        ->where('clientid', $authUser->clientid)
                        ->count();
            
                    $totalusersGR9[$dayName] = $totaluserscount;
                    $studentLabel[$dayName] = $dayName;
                    if ($x == $today->dayOfWeek-2) { 
                        $totalusersprev = $totaluserscount; // Previous month
                    }  else if ($x == $today->dayOfWeek-1) { 
                        $totaluserscurr = $totaluserscount; // Current month
                    }
                }
            }
            else if ($request->student_time == 2) {
                $currentMonthStart = Carbon::now()->startOfMonth(); // Get the 1st day of the month
                $today = Carbon::now(); // Get today's date
            
                for ($x = 0; $x < $today->day; $x++) { // Loop from 1st of the month up to today
                    $day = $currentMonthStart->copy()->addDays($x);
                    $dayNumber = $day->format('j'); // Get day number (e.g., "1", "2", ..., "15")
            
                    $totaluserscount = DB::table('users')
                        ->whereDate('created_at', $day)
                        ->where('access_level', 5)
                        ->where('grade', 9)
                        ->where('clientid', $authUser->clientid)
                        ->count();
            
                    $totalusersGR9[$dayNumber] = $totaluserscount;
                    $studentLabel[$dayNumber] = $dayNumber;
                    if ($x == $today->day - 2) { 
                        $totalusersprev = $totaluserscount; // Previous month
                    }  else if ($x == $today->day - 1) { 
                        $totaluserscurr = $totaluserscount; // Current month
                    }
                }
            }
            else if ($request->student_time == 3) {
                $currentYear = Carbon::now()->year; // Get current year
                $currentMonth = Carbon::now()->month; // Get current month (1 = Jan, 2 = Feb, etc.)

                for ($x = 1; $x <= $currentMonth; $x++) { // Loop from January (1) to current month
                    $monthName = Carbon::create($currentYear, $x, 1)->format('F'); // Get full month name (e.g., "January")

                    $totaluserscount = DB::table('users')
                        ->whereYear('created_at', $currentYear)
                        ->whereMonth('created_at', $x)
                        ->where('access_level', 5)
                        ->where('grade', 9)
                        ->where('clientid', $authUser->clientid)
                        ->count();

                    $totalusersGR9[$monthName] = $totaluserscount;
                    $studentLabel[$monthName] = $monthName;
                    if ($x == $currentMonth - 1) { 
                        $totalusersprev = $totaluserscount; // Previous month
                    }  else if ($x == $currentMonth) { 
                        $totaluserscurr = $totaluserscount; // Current month
                    }
                }
            }
        }

        //All GR10
        $YearGR10 = Carbon::now()->format('Y');
        $totalusersGR10 = [];
        if(!$request->grade || $request->grade == 10) {
            if ($request->student_time == 4) {
                for ($x = 0; $x <= 10; $x++) {
                    $totaluserscount = DB::table('users')
                        ->whereYear('created_at',   $YearGR10)
                        ->where('access_level', 5)
                        ->where('grade', 10)
                        ->where('clientid', $authUser->clientid)
                        ->count();
                    $totalusersGR10[$YearGR10] = $totaluserscount;
                    if($x == 1) {
                        $totalusersprev = $totaluserscount;
                    } else if($x == 0) {
                        $totaluserscurr = $totaluserscount;
                    }
                    $studentLabel[$YearGR10] = $YearGR10;
                    $YearGR10--;
                }
            }
            else if ($request->student_time == 1) {
                $currentWeekStart = Carbon::now()->startOfWeek(); // Get Monday of current week
                $today = Carbon::now(); // Get today's date
            
                for ($x = 0; $x <= $today->dayOfWeek - 1; $x++) { // Loop only from Monday to today
                    $day = $currentWeekStart->copy()->addDays($x);
                    $dayName = $day->format('l'); // Get full day name (e.g., "Monday")
            
                    $totaluserscount = DB::table('users')
                        ->whereDate('created_at', $day)
                        ->where('access_level', 5)
                        ->where('grade', 10)
                        ->where('clientid', $authUser->clientid)
                        ->count();
            
                    $totalusersGR10[$dayName] = $totaluserscount;
                    $studentLabel[$dayName] = $dayName;
                    if ($x == $today->dayOfWeek-2) { 
                        $totalusersprev = $totaluserscount; // Previous month
                    }  else if ($x == $today->dayOfWeek-1) { 
                        $totaluserscurr = $totaluserscount; // Current month
                    }
                }
            }
            else if ($request->student_time == 2) {
                $currentMonthStart = Carbon::now()->startOfMonth(); // Get the 1st day of the month
                $today = Carbon::now(); // Get today's date
            
                for ($x = 0; $x < $today->day; $x++) { // Loop from 1st of the month up to today
                    $day = $currentMonthStart->copy()->addDays($x);
                    $dayNumber = $day->format('j'); // Get day number (e.g., "1", "2", ..., "15")
            
                    $totaluserscount = DB::table('users')
                        ->whereDate('created_at', $day)
                        ->where('access_level', 5)
                        ->where('grade', 10)
                        ->where('clientid', $authUser->clientid)
                        ->count();
            
                    $totalusersGR10[$dayNumber] = $totaluserscount;
                    $studentLabel[$dayNumber] = $dayNumber;
                    if ($x == $today->day - 2) { 
                        $totalusersprev = $totaluserscount; // Previous month
                    }  else if ($x == $today->day - 1) { 
                        $totaluserscurr = $totaluserscount; // Current month
                    }
                }
            }
            else if ($request->student_time == 3) {
                $currentYear = Carbon::now()->year; // Get current year
                $currentMonth = Carbon::now()->month; // Get current month (1 = Jan, 2 = Feb, etc.)

                for ($x = 1; $x <= $currentMonth; $x++) { // Loop from January (1) to current month
                    $monthName = Carbon::create($currentYear, $x, 1)->format('F'); // Get full month name (e.g., "January")

                    $totaluserscount = DB::table('users')
                        ->whereYear('created_at', $currentYear)
                        ->whereMonth('created_at', $x)
                        ->where('access_level', 5)
                        ->where('grade', 10)
                        ->where('clientid', $authUser->clientid)
                        ->count();

                    $totalusersGR10[$monthName] = $totaluserscount;
                    $studentLabel[$monthName] = $monthName;
                    if ($x == $currentMonth - 1) { 
                        $totalusersprev = $totaluserscount; // Previous month
                    }  else if ($x == $currentMonth) { 
                        $totaluserscurr = $totaluserscount; // Current month
                    }
                }
            }
        }

        //All GR11
        $YearGR11 = Carbon::now()->format('Y');
        $totalusersGR11 = [];
        if(!$request->grade || $request->grade == 11) {
            if ($request->student_time == 4) {
                for ($x = 0; $x <= 10; $x++) {
                    $totaluserscount = DB::table('users')
                        ->whereYear('created_at',   $YearGR11)
                        ->where('access_level', 5)
                        ->where('grade', 11)
                        ->where('clientid', $authUser->clientid)
                        ->count();
                    $totalusersGR11[$YearGR11] = $totaluserscount;
                    if($x == 1) {
                        $totalusersprev = $totaluserscount;
                    } else if($x == 0) {
                        $totaluserscurr = $totaluserscount;
                    }
                    $studentLabel[$YearGR11] = $YearGR11;
                    $YearGR11--;
                }
            }
            else if ($request->student_time == 1) {
                $currentWeekStart = Carbon::now()->startOfWeek(); // Get Monday of current week
                $today = Carbon::now(); // Get today's date
            
                for ($x = 0; $x <= $today->dayOfWeek - 1; $x++) { // Loop only from Monday to today
                    $day = $currentWeekStart->copy()->addDays($x);
                    $dayName = $day->format('l'); // Get full day name (e.g., "Monday")
            
                    $totaluserscount = DB::table('users')
                        ->whereDate('created_at', $day)
                        ->where('access_level', 5)
                        ->where('grade', 11)
                        ->where('clientid', $authUser->clientid)
                        ->count();
            
                    $totalusersGR11[$dayName] = $totaluserscount;
                    $studentLabel[$dayName] = $dayName;
                    if ($x == $today->dayOfWeek-2) { 
                        $totalusersprev = $totaluserscount; // Previous month
                    }  else if ($x == $today->dayOfWeek-1) { 
                        $totaluserscurr = $totaluserscount; // Current month
                    }
                }
            }
            else if ($request->student_time == 2) {
                $currentMonthStart = Carbon::now()->startOfMonth(); // Get the 1st day of the month
                $today = Carbon::now(); // Get today's date
            
                for ($x = 0; $x < $today->day; $x++) { // Loop from 1st of the month up to today
                    $day = $currentMonthStart->copy()->addDays($x);
                    $dayNumber = $day->format('j'); // Get day number (e.g., "1", "2", ..., "15")
            
                    $totaluserscount = DB::table('users')
                        ->whereDate('created_at', $day)
                        ->where('access_level', 5)
                        ->where('grade', 11)
                        ->where('clientid', $authUser->clientid)
                        ->count();
            
                    $totalusersGR11[$dayNumber] = $totaluserscount;
                    $studentLabel[$dayNumber] = $dayNumber;
                    if ($x == $today->day - 2) { 
                        $totalusersprev = $totaluserscount; // Previous month
                    }  else if ($x == $today->day - 1) { 
                        $totaluserscurr = $totaluserscount; // Current month
                    }
                }
            }
            else if ($request->student_time == 3) {
                $currentYear = Carbon::now()->year; // Get current year
                $currentMonth = Carbon::now()->month; // Get current month (1 = Jan, 2 = Feb, etc.)

                for ($x = 1; $x <= $currentMonth; $x++) { // Loop from January (1) to current month
                    $monthName = Carbon::create($currentYear, $x, 1)->format('F'); // Get full month name (e.g., "January")

                    $totaluserscount = DB::table('users')
                        ->whereYear('created_at', $currentYear)
                        ->whereMonth('created_at', $x)
                        ->where('access_level', 5)
                        ->where('grade', 11)
                        ->where('clientid', $authUser->clientid)
                        ->count();

                    $totalusersGR11[$monthName] = $totaluserscount;
                    $studentLabel[$monthName] = $monthName;
                    if ($x == $currentMonth - 1) { 
                        $totalusersprev = $totaluserscount; // Previous month
                    }  else if ($x == $currentMonth) { 
                        $totaluserscurr = $totaluserscount; // Current month
                    }
                }
            }
        }

        //All GR12
        $YearGR12 = Carbon::now()->format('Y');
        $totalusersGR12 = [];
        if(!$request->grade || $request->grade == 12) {
            if ($request->student_time == 4) {
                for ($x = 0; $x <= 10; $x++) {
                    $totaluserscount = DB::table('users')
                        ->whereYear('created_at',   $YearGR12)
                        ->where('access_level', 5)
                        ->where('grade', 12)
                        ->where('clientid', $authUser->clientid)
                        ->count();
                    $totalusersGR12[$YearGR12] = $totaluserscount;
                    if($x == 1) {
                        $totalusersprev = $totaluserscount;
                    } else if($x == 0) {
                        $totaluserscurr = $totaluserscount;
                    }
                    $studentLabel[$YearGR12] = $YearGR12;
                    $YearGR12--;
                }
            }
            else if ($request->student_time == 1) {
                $currentWeekStart = Carbon::now()->startOfWeek(); // Get Monday of current week
                $today = Carbon::now(); // Get today's date
            
                for ($x = 0; $x <= $today->dayOfWeek - 1; $x++) { // Loop only from Monday to today
                    $day = $currentWeekStart->copy()->addDays($x);
                    $dayName = $day->format('l'); // Get full day name (e.g., "Monday")
            
                    $totaluserscount = DB::table('users')
                        ->whereDate('created_at', $day)
                        ->where('access_level', 5)
                        ->where('grade', 12)
                        ->where('clientid', $authUser->clientid)
                        ->count();
            
                    $totalusersGR12[$dayName] = $totaluserscount;
                    $studentLabel[$dayName] = $dayName;
                    if ($x == $today->dayOfWeek-2) { 
                        $totalusersprev = $totaluserscount; // Previous month
                    }  else if ($x == $today->dayOfWeek-1) { 
                        $totaluserscurr = $totaluserscount; // Current month
                    }
                }
            }
            else if ($request->student_time == 2) {
                $currentMonthStart = Carbon::now()->startOfMonth(); // Get the 1st day of the month
                $today = Carbon::now(); // Get today's date
            
                for ($x = 0; $x < $today->day; $x++) { // Loop from 1st of the month up to today
                    $day = $currentMonthStart->copy()->addDays($x);
                    $dayNumber = $day->format('j'); // Get day number (e.g., "1", "2", ..., "15")
            
                    $totaluserscount = DB::table('users')
                        ->whereDate('created_at', $day)
                        ->where('access_level', 5)
                        ->where('grade', 12)
                        ->where('clientid', $authUser->clientid)
                        ->count();
            
                    $totalusersGR12[$dayNumber] = $totaluserscount;
                    $studentLabel[$dayNumber] = $dayNumber;
                    if ($x == $today->day - 2) { 
                        $totalusersprev = $totaluserscount; // Previous month
                    }  else if ($x == $today->day - 1) { 
                        $totaluserscurr = $totaluserscount; // Current month
                    }
                }
            }
            else if ($request->student_time == 3) {
                $currentYear = Carbon::now()->year; // Get current year
                $currentMonth = Carbon::now()->month; // Get current month (1 = Jan, 2 = Feb, etc.)

                for ($x = 1; $x <= $currentMonth; $x++) { // Loop from January (1) to current month
                    $monthName = Carbon::create($currentYear, $x, 1)->format('F'); // Get full month name (e.g., "January")

                    $totaluserscount = DB::table('users')
                        ->whereYear('created_at', $currentYear)
                        ->whereMonth('created_at', $x)
                        ->where('access_level', 5)
                        ->where('grade', 12)
                        ->where('clientid', $authUser->clientid)
                        ->count();

                    $totalusersGR12[$monthName] = $totaluserscount;
                    $studentLabel[$monthName] = $monthName;
                    if ($x == $currentMonth - 1) { 
                        $totalusersprev = $totaluserscount; // Previous month
                    }  else if ($x == $currentMonth) { 
                        $totaluserscurr = $totaluserscount; // Current month
                    }
                }
            }
        }

        //All Students
        if(!$request->grade || $request->grade == 13) {
            if ($request->student_time == 4) {
                for ($x = 0; $x <= 10; $x++) {
                    $totaluserscount = DB::table('users')
                        ->whereYear('created_at',   $currentYear)
                        ->where('access_level', 5)
                        ->where('clientid', $authUser->clientid)
                        ->count();
                    $totalusers[$currentYear] = $totaluserscount;
                    if($x == 1) {
                        $totalusersprev = $totaluserscount;
                    } else if($x == 0) {
                        $totaluserscurr = $totaluserscount;
                    }
                    $studentLabel[$currentYear] = $currentYear;
                    $currentYear--;
                }
            }
            else if ($request->student_time == 1) {
                $currentWeekStart = Carbon::now()->startOfWeek(); // Get Monday of current week
                $today = Carbon::now(); // Get today's date
            
                for ($x = 0; $x <= $today->dayOfWeek - 1; $x++) { // Loop only from Monday to today
                    $day = $currentWeekStart->copy()->addDays($x);
                    $dayName = $day->format('l'); // Get full day name (e.g., "Monday")
            
                    $totaluserscount = DB::table('users')
                        ->whereDate('created_at', $day)
                        ->where('access_level', 5)
                        ->where('clientid', $authUser->clientid)
                        ->count();
            
                    $totalusers[$dayName] = $totaluserscount;
                    $studentLabel[$dayName] = $dayName;
                    if ($x == $today->dayOfWeek-2) { 
                        $totalusersprev = $totaluserscount; // Previous month
                    }  else if ($x == $today->dayOfWeek-1) { 
                        $totaluserscurr = $totaluserscount; // Current month
                    }
                }
            }
            else if ($request->student_time == 2) {
                $currentMonthStart = Carbon::now()->startOfMonth(); // Get the 1st day of the month
                $today = Carbon::now(); // Get today's date
            
                for ($x = 0; $x < $today->day; $x++) { // Loop from 1st of the month up to today
                    $day = $currentMonthStart->copy()->addDays($x);
                    $dayNumber = $day->format('j'); // Get day number (e.g., "1", "2", ..., "15")
            
                    $totaluserscount = DB::table('users')
                        ->whereDate('created_at', $day)
                        ->where('access_level', 5)
                        ->where('clientid', $authUser->clientid)
                        ->count();
            
                    $totalusers[$dayNumber] = $totaluserscount;
                    $studentLabel[$dayNumber] = $dayNumber;

                    if ($x == $today->day - 2) { 
                        $totalusersprev = $totaluserscount; // Previous month
                    }  else if ($x == $today->day - 1) { 
                        $totaluserscurr = $totaluserscount; // Current month
                    }
                }
            }
            else if ($request->student_time == 3) {
                $currentYear = Carbon::now()->year; // Get current year
                $currentMonth = Carbon::now()->month; // Get current month (1 = Jan, 2 = Feb, etc.)

                for ($x = 1; $x <= $currentMonth; $x++) { // Loop from January (1) to current month
                    $monthName = Carbon::create($currentYear, $x, 1)->format('F'); // Get full month name (e.g., "January")

                    $totaluserscount = DB::table('users')
                        ->whereYear('created_at', $currentYear)
                        ->whereMonth('created_at', $x)
                        ->where('access_level', 5)
                        ->where('clientid', $authUser->clientid)
                        ->count();

                    $totalusers[$monthName] = $totaluserscount;
                    $studentLabel[$monthName] = $monthName;
                    if ($x == $currentMonth - 1) { 
                        $totalusersprev = $totaluserscount; // Previous month
                    }  else if ($x == $currentMonth) { 
                        $totaluserscurr = $totaluserscount; // Current month
                    }
                }
            }
        }

        // $totaluserscount = DB::table('users')
        //     ->where('year_enrolled', $currentYear1)
        //     ->where('access_level', 5)
        //     ->where('clientid', $authUser->clientid)
        //     ->count();

        $totalstudents = DB::table('users')
            ->where('access_level', 5)
            ->where('clientid', $authUser->clientid)
            ->count();

        $percentageChange = $totalusersprev != 0  ? 
            number_format((($totaluserscurr - $totalusersprev) / abs($totalusersprev)) * 100, 2) : 0;

        $studentanalyticschart = [
            'totaluserscount' => $totaluserscount,
            'totalusersprev' => $totalusersprev,
            'totaluserscurr' => $totaluserscurr,
            'totalusers' => $totalusers,
            'studentLabel' => $studentLabel,
            'totalstudents' => $totalstudents,
            'percentageChange' => $percentageChange,

            'totalusersGR7' => $totalusersGR7,
            'totalusersGR8' => $totalusersGR8,
            'totalusersGR9' => $totalusersGR9,
            'totalusersGR10' => $totalusersGR10,
            'totalusersGR11' => $totalusersGR11,
            'totalusersGR12' => $totalusersGR12,
            'studentLabel' => $studentLabel,
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

    public function studentgendercounts() 
    {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        $studentgendercounts = User::select(
            DB::raw("IFNULL(SUM(CASE WHEN gender = 'M' THEN 1 ELSE 0 END), 0) as male"),
            DB::raw("IFNULL(SUM(CASE WHEN gender = 'F' THEN 1 ELSE 0 END), 0) as female"),
        )
        ->where('access_level', 5)
        ->where('clientid', $authUser->clientid)
        ->first();

        $studentgendercounts = [
            'studentgendercounts' => $studentgendercounts,
        ];

        return response()->json([
            'studentgendercounts' => $studentgendercounts,
        ]);
    }
}
