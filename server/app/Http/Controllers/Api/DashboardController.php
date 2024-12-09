<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Calendar;
use App\Models\RequestDoc;
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
        $populationCount = [];
        
        for ($x = 0; $x <= 10; $x++) {
            $population = User::where('year_residency', '<=', $currentYear)->count();
            $populationCount[$currentYear] = $population;
            $currentYear--;
        }


        $events = Calendar::select('id', 'event_name', 'event_date','description', 'time', 'event_date_end', 'color', 'time_end')
        ->get()
        ->map(function($event) {
            // Combine date and time to create a proper start and end timestamp
            $startDateTime = Carbon::parse($event->event_date . ' ' . $event->time);
            $endDateTime = Carbon::parse($event->event_date_end . ' ' . $event->time_end);
            $title = $event->event_name . ': ' . $event->description;
            
            return [
                'title' => $title,
                'start' => $startDateTime->toIso8601String(), // Format as ISO 8601 string
                'end' => $endDateTime->toIso8601String(),     // Format as ISO 8601 string
                'color' => $event->color,
            ];
        });

        $data1 = User::where('access_level', 999)->where('account_status', 1)->count();
        $data2 = User::count();
        $male = User::where('gender', 'M')->where('account_status', 1)->count();
        $female = User::where('gender', 'F')->where('account_status', 1)->count();
        $upcomingevents = Calendar::select('*',
            DB::raw("CONCAT(DATE_FORMAT(event_date, '%M %d, %Y'), ' ', DATE_FORMAT(time, '%h:%i %p')) as event_datetime")
            )
            ->where('event_date', '>=', DB::raw('CURDATE()'))
            ->get();
            
        $pastevents = Calendar::select('*',
            DB::raw("CONCAT(DATE_FORMAT(event_date, '%M %d, %Y'), ' ', DATE_FORMAT(time, '%h:%i %p')) as event_datetime")
            )
            ->where('event_date', '<', DB::raw('CURDATE()'))
            ->get();

        $otherStats = [
            'data1' => $data1,
            'data2' => $data2,
            'male' => $male,
            'female' => $female,
            'upcomingevents' => $upcomingevents,
            'pastevents' => $pastevents,
            'populationCount' => $populationCount,
            'events' => $events,
        ];

        return response()->json([
            'otherStats' => $otherStats,
        ]);
    }

    //returns counts of polls
    public function ElectionDistribution() 
    {
        $polls = RequestDoc::select('*', 
            DB::raw("DATE_FORMAT(date_needed, '%M %d, %Y') AS date_needed"),
            DB::raw("DATE_FORMAT(created_at, '%M %d, %Y') AS created_date"),
            DB::raw("
            CASE 
                WHEN status = 2 THEN 'claimed'
                WHEN status = 1 THEN 'finish/pick-up'
                ELSE 'pending'
            END AS req_status
            "))
            ->where('status', '<', 2)
            ->get();
        if($polls) {
            return response()->json([
                'message' => 'Request retrieved!',
                'polls' => $polls,
            ]);
        }
        return response()->json([
            'message' => "No Active Request!"
        ]);
    }
}
