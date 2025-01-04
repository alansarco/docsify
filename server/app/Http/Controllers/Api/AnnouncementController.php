<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Admin;
use App\Models\App_Info;
use App\Models\Calendar;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;
use Illuminate\Support\Facades\Http;

class AnnouncementController extends Controller
{
    public function index() {
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

        $upcomingevents = DB::select('CALL GET_UPCOMING_EVENTS()');
        $pastevents = DB::select('CALL GET_PAST_EVENTS()');

        $calendars = [
            'upcomingevents' => $upcomingevents,
            'pastevents' => $pastevents,
            'events' => $events,
        ];

        return response()->json([
            'calendars' => $calendars,
        ]);
    }

    // retrieve specific event's information
    public function retrieve(Request $request) {
        $event = Calendar::where('id', $request->id)->first();
        
        if($event) {
            return response()->json([
                'status' => 200,
                'calendar' => $event,
                'message' => "Announcement data retrieved!"
            ], 200);
        }
        else {
            return response()->json([
                'calendar' => $event,
                'message' => "Announcement not found!"
            ]);
        }
    }

    // update specific admin's information
    public function updateannouncement(Request $request) {
        $authUser = User::select('first_name')->where('username', Auth::user()->username)->first();

        $validator = Validator::make($request->all(), [
            'event_name' => 'required',
            'description' => 'required',
            'hashtag1' => 'required',
            'hashtag2' => 'required',
            'hashtag3' => 'required',
            'color' => 'required',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }
        else {
            try {
                $update = Calendar::where('id', $request->id)
                ->update([
                    'event_name' => strtoupper($request->event_name),
                    'description' => $request->description,
                    'details' => $request->details,
                    'event_date' => $request->event_date,
                    'event_date_end' => $request->event_date_end,
                    'time' => $request->time,
                    'time_end' => $request->time_end,
                    'hashtag1' => $request->hashtag1,
                    'hashtag2' => $request->hashtag2,
                    'hashtag3' => $request->hashtag3,
                    'color' => $request->color,
                    'updated_by' => $authUser->first_name,
                ]);

            if($update) {
                return response()->json([
                    'status' => 200,
                    'message' => 'Announcement updated successfully!'
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

    public function addannouncement(Request $request) {
        $authUser = User::select('first_name')->where('username', Auth::user()->username)->first();

        $validator = Validator::make($request->all(), [ 
            'event_name' => 'required',
            'description' => 'required',
            'hashtag1' => 'required',
            'hashtag2' => 'required',
            'hashtag3' => 'required',
            'color' => 'required',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }

        $add = Calendar::create([
            'event_name' => strtoupper($request->event_name),
            'description' => $request->description,
            'details' => $request->details,
            'event_date' => $request->event_date,
            'event_date_end' => $request->event_date_end,
            'time' => $request->time,
            'time_end' => $request->time_end,
            'hashtag1' => $request->hashtag1,
            'hashtag2' => $request->hashtag2,
            'hashtag3' => $request->hashtag3,
            'color' => $request->color,
            'created_by' => $authUser->first_name,
        ]);

        if($add) {
            $event_notif = App_Info::select('event_notif')->first();
            if($event_notif->event_notif == 1) {
                $distinctNumbers = User::select('contact')
                ->where('status', 1)
                ->distinct()
                ->pluck('contact');

                // Step 2: Filter valid phone numbers and normalize them to "639xxxxxxxxx" format
                $validNumbers = $distinctNumbers->filter(function ($number) {
                // Remove any spaces or special characters
                $number = preg_replace('/\D/', '', $number);

                // Check if it starts with "09" and convert to "639xxxxxxxxx"
                if (preg_match('/^09\d{9}$/', $number)) {
                    return '63' . substr($number, 1);
                }
                // Check if it starts with "+639" or "639"
                elseif (preg_match('/^(\+639|639)\d{9}$/', $number)) {
                    return preg_replace('/^\+/', '', $number); // Remove "+" if present
                }

                // If none of the formats match, return false (invalid)
                return false;
                });

                // Step 3: Convert the filtered numbers into a comma-separated string
                $numbers = $validNumbers->implode(',');

                // Step 4: Prepare the SMS message with event details
                $eventName = strtoupper($request->event_name);
                $eventDate = date('F j, Y', strtotime($request->event_date)); // Format: November 10, 2024
                $eventTime = date('h:i A', strtotime($request->time)); // Format: 10:30 AM

                $message = "Hello Taguigeno! A new event has been added:\n\n"
                    . "Event: $eventName\n"
                    . "Date: $eventDate\n"
                    . "Time: $eventTime\n"
                    . "Don't miss it!";

                // Step 6: Send the message via Semaphore API if there are valid numbers
                if ($numbers) {
                    $response = Http::asForm()->post('https://semaphore.co/api/v4/messages', [
                        'apikey' => '191998cd60101ec1f81b319a063fb06a',
                        'number' => $numbers,
                        'message' => $message,
                        'sender_name' => '',
                    ]);

                    if ($response->successful()) {
                        return response()->json([
                            'status' => 200,
                            'message' => 'Announcement added and SMS sent successfully!'
                        ], 200);
                    } else {
                        return response()->json([
                            'status' => 500,
                            'message' => 'Announcement added, but failed to send SMS.'
                        ], 500);
                    }
                } else {
                    return response()->json([
                    'message' => 'Something went wrong!'
                    ]);
                }
            }
            return response()->json([
                'status' => 200,
                'message' => 'Announcement added successfully!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }

    public function deleteannouncement(Request $request) {
        $authUser = Auth::user();

        if($authUser->role !== "ADMIN" || $authUser->access_level < 10) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $delete = Calendar::where('id', $request->id)->delete();

        if($delete) {
            return response()->json([
                'status' => 200,
                'message' => 'Announcement removed successfully!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }
    
}
