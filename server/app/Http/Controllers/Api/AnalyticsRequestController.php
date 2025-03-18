<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Utilities\Utils;
use App\Models\DocRequest;
use App\Models\Document;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class AnalyticsRequestController extends Controller
{
    //returns data of Ither Statistics
    public function requestanalyticschart(Request $request) 
    {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        $currentYear = Carbon::now()->format('Y');
        $today = Carbon::today();

        $grandtotalrequests = [];
        $chartLabel = [];
        $totalusersprev = 0;
        $totalrequestscurr = 0;
        $totalrequestscount = 0;

        //All Students
        if(!$request->grade || $request->grade == 13) {
            if ($request->request_time == 4) {
                for ($x = 0; $x <= 10; $x++) {
                    $totalrequestscount = DocRequest::whereYear('created_at',   $currentYear)
                        ->where('status', '>=', 0)
                        ->where('status', '<', 6)
                        ->where('clientid', $authUser->clientid)
                        ->count();
                    $grandtotalrequests[$currentYear] = $totalrequestscount;
                    if($x == 1) {
                        $totalusersprev = $totalrequestscount;
                    } else if($x == 0) {
                        $totalrequestscurr = $totalrequestscount;
                    }
                    $chartLabel[$currentYear] = $currentYear;
                    $currentYear--;
                }
            }
            else if ($request->request_time == 1) {
                $currentWeekStart = Carbon::now()->startOfWeek(); // Get Monday of current week
                $today = Carbon::now(); // Get today's date
            
                for ($x = 0; $x <= $today->dayOfWeek - 1; $x++) { // Loop only from Monday to today
                    $day = $currentWeekStart->copy()->addDays($x);
                    $dayName = $day->format('l'); // Get full day name (e.g., "Monday")
            
                    $totalrequestscount = DocRequest::whereDate('created_at', $day)
                        ->where('status', '>=', 0)
                        ->where('status', '<', 6)
                        ->where('clientid', $authUser->clientid)
                        ->count();
            
                    $grandtotalrequests[$dayName] = $totalrequestscount;
                    $chartLabel[$dayName] = $dayName;
                    if ($x == $today->dayOfWeek-2) { 
                        $totalusersprev = $totalrequestscount; // Previous month
                    }  else if ($x == $today->dayOfWeek-1) { 
                        $totalrequestscurr = $totalrequestscount; // Current month
                    }
                }
            }
            else if ($request->request_time == 2) {
                $currentMonthStart = Carbon::now()->startOfMonth(); // Get the 1st day of the month
                $today = Carbon::now(); // Get today's date
            
                for ($x = 0; $x < $today->day; $x++) { // Loop from 1st of the month up to today
                    $day = $currentMonthStart->copy()->addDays($x);
                    $dayNumber = $day->format('j'); // Get day number (e.g., "1", "2", ..., "15")
            
                    $totalrequestscount = DocRequest::whereDate('created_at', $day)
                        ->where('status', '>=', 0)
                        ->where('status', '<', 6)
                        ->where('clientid', $authUser->clientid)
                        ->count();
            
                    $grandtotalrequests[$dayNumber] = $totalrequestscount;
                    $chartLabel[$dayNumber] = $dayNumber;

                    if ($x == $today->day - 2) { 
                        $totalusersprev = $totalrequestscount; // Previous month
                    }  else if ($x == $today->day - 1) { 
                        $totalrequestscurr = $totalrequestscount; // Current month
                    }
                }
            }
            else if ($request->request_time == 3) {
                $currentYear = Carbon::now()->year; // Get current year
                $currentMonth = Carbon::now()->month; // Get current month (1 = Jan, 2 = Feb, etc.)

                for ($x = 1; $x <= $currentMonth; $x++) { // Loop from January (1) to current month
                    $monthName = Carbon::create($currentYear, $x, 1)->format('F'); // Get full month name (e.g., "January")

                    $totalrequestscount = DocRequest::whereYear('created_at', $currentYear)
                        ->whereMonth('created_at', $x)
                        ->where('status', '>=', 0)
                        ->where('status', '<', 6)
                        ->where('clientid', $authUser->clientid)
                        ->count();

                    $grandtotalrequests[$monthName] = $totalrequestscount;
                    $chartLabel[$monthName] = $monthName;
                    if ($x == $currentMonth - 1) { 
                        $totalusersprev = $totalrequestscount; // Previous month
                    }  else if ($x == $currentMonth) { 
                        $totalrequestscurr = $totalrequestscount; // Current month
                    }
                }
            }
        }

        $totalrequests = DocRequest::where('clientid', $authUser->clientid)->count();

        $percentageChange = $totalusersprev != 0  ? 
            number_format((($totalrequestscurr - $totalusersprev) / abs($totalusersprev)) * 100, 2) : 0;

        $requestanalyticschart = [
            'totalrequestscurr' => $totalrequestscurr,
            'grandtotalrequests' => $grandtotalrequests,
            'chartLabel' => $chartLabel,
            'totalrequests' => $totalrequests,
            'percentageChange' => $percentageChange,
        ];

        return response()->json([
            'requestanalyticschart' => $requestanalyticschart,
        ]);
    }

    public function requeststatuscounts() 
    {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        $today = Carbon::today();
        
        $requeststatuscounts = DocRequest::select(
            DB::raw("IFNULL(SUM(CASE WHEN status = 0 THEN 1 ELSE 0 END), 0) as pending"),
            DB::raw("IFNULL(SUM(CASE WHEN status = 1 THEN 1 ELSE 0 END), 0) as queue"),
            DB::raw("IFNULL(SUM(CASE WHEN status = 2 THEN 1 ELSE 0 END), 0) as processing"),
            DB::raw("IFNULL(SUM(CASE WHEN status = 3 THEN 1 ELSE 0 END), 0) as releasing"),
            DB::raw("IFNULL(SUM(CASE WHEN status > 0 AND status < 4 AND DATE(date_needed) < '$today'THEN 1 ELSE 0 END), 0) as overdue"),
        )
        ->where('clientid', $authUser->clientid)
        ->first();

        $requeststatuscounts = [
            'requeststatuscounts' => $requeststatuscounts,
        ];

        return response()->json([
            'requeststatuscounts' => $requeststatuscounts,
        ]);
    }

    public function documentrequestcounts() 
    {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();

        $documentList = DB::table('documents')->where('clientid', $authUser->clientid)->get();
        $documentrequestcounts = [];
        $sumrequest = 0;
        // Loop through each document
        foreach ($documentList as $document) {
            $count = DocRequest::where('doc_id', $document->doc_id)
                ->where('clientid', $authUser->clientid)
                ->count(); // Use count() instead of first()

            // Store the count per document ID
            if ($count > 0) {
                $documentrequestcounts[] = [
                    'doc_id'   => $document->doc_id,
                    'doc_name' => $document->doc_name, // Assuming 'doc_name' exists in the Document model
                    'count'    => $count
                ];
            }
            $sumrequest += $count;
        }
        
        $documentTotal = DB::table('documents')->where('clientid', $authUser->clientid)->count();

        $documentrequestcounts = [
            'documentrequestcounts' => $documentrequestcounts,
            'sumrequest' => $sumrequest,
        ];

        return response()->json([
            'documentrequestcounts' => $documentrequestcounts,
            'sumrequest' => $sumrequest,
        ]);
    }
}
