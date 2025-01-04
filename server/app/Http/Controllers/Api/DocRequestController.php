<?php

namespace App\Http\Controllers\Api;

use Exception;
use App\Http\Controllers\Controller;
use App\Mail\OtpStringsRequest;
use App\Models\Document;
use App\Models\RequestDoc;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Mail;

class DocRequestController extends Controller
{
    public function index(Request $request) {
        $query = RequestDoc::select('*', 
            DB::raw("DATE_FORMAT(date_needed, '%M %d, %Y') AS date_needed"),
            DB::raw("DATE_FORMAT(created_at, '%M %d, %Y') AS created_date"),
            DB::raw("
            CASE 
                WHEN status = 2 THEN 'claimed'
                WHEN status = 1 THEN 'finish/pick-up'
                ELSE 'pending'
            END AS req_status
            "));
        if($request->filter) {
            $requests = $query->where('doc_name', $request->filter)->paginate(2);
        }
        else{
            $requests = $query->orderBy('status')->paginate(20);
        }

        if($requests) {
            return response()->json([
                'requests' => $requests,
                'message' => 'Requests retrieved!',
            ]);
        }   
        else {
            return response()->json([
                'requests' => $requests,
                'message' => 'No requests  found!'
            ]);
        }
    }

    public function availabledate() {
        $events = RequestDoc::select(DB::raw('DATE(date_needed) as date_needed'), DB::raw('COUNT(*) as count'))
        ->groupBy('date_needed')
        ->get()
        ->map(function ($event) {
            return [
                'title' => $event->count . ' Request/s',
                'start' => Carbon::parse($event->date_needed)->toIso8601String(), // Start of the day
                'end' => Carbon::parse($event->date_needed)->toIso8601String(), // End of the day
                'color' => $event->count >= 20 ? '#FF0000' : '#198754', // Optional: set a default color for the count display
            ];
        });

        $calendars = [
            'events' => $events,
        ];

        return response()->json([
            'calendars' => $calendars,
        ]);
    }

    public function docselect() {
        $documents = Document::get();

        if($documents->count() > 0) {
            return response()->json([
                'documents' => $documents,
                'message' => 'Documents retrieved!',
            ]);
        }   
        else {
            return response()->json([
                'message' => 'No docs found!'
            ]);
        }
    }

    public function addrequest(Request $request) {
        $authUser = User::where('username', Auth::user()->username)->first();

        $limit = RequestDoc::where('date_needed', $request->date_needed)->count();

        if ($limit > 2) {
            return response()->json([
                'message' => 'Maximum request for this day is reached! Please select another date.'
            ]);
        }

        $addDoc = RequestDoc::create([
            'username' => $authUser->username,
            'contact' => $authUser->contact,
            'type' => $request->type,
            'purpose' => $request->purpose,
            'status' => 0,
            'date_needed' => $request->date_needed,
            'created_by' => $authUser->first_name,
        ]);

        if($addDoc) {
            return response()->json([
                'status' => 200,
                'message' => 'Request added successfully!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }

    public function deleterequest(Request $request) {
        $requestor = RequestDoc::where('id', $request->id)->first();
        $message = "Hello $requestor->username! Your request document for $requestor->type has been rejected!";
        if ($requestor->contact) {
            Http::asForm()->post('https://semaphore.co/api/v4/messages', [
                'apikey' => '191998cd60101ec1f81b319a063fb06a',
                'number' => $requestor->contact,
                'message' => $message,
                'sender_name' => '',
            ]);
        }

        $otp = $message;
        Mail::to($requestor->username)->send(new OtpStringsRequest($otp));

        $delete = RequestDoc::where('id', $request->id)->delete();
        if($delete) {
            return response()->json([
                'status' => 200,
                'message' => 'Requested document has been rejected!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }
    public function finishedrequest(Request $request) {
        $requestor = RequestDoc::where('id', $request->id)->first();
        $message = "Hello $requestor->username! Your request document for $requestor->type is now ready for pick-up!";
        if ($requestor->contact) {
            Http::asForm()->post('https://semaphore.co/api/v4/messages', [
                'apikey' => '191998cd60101ec1f81b319a063fb06a',
                'number' => $requestor->contact,
                'message' => $message,
                'sender_name' => '',
            ]);
        }
        
        $otp = $message;
        Mail::to($requestor->username)->send(new OtpStringsRequest($otp));

        $update = RequestDoc::where('id', $request->id)->update([ 'status' => 1]);
        if($update) {
            return response()->json([
                'status' => 200,
                'message' => 'Requested document is finish and ready for pick-up!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }
    public function claimedrequest(Request $request) {
        $requestor = RequestDoc::where('id', $request->id)->first();
        $message = "Hello $requestor->username! Your request document for $requestor->type is now claimed!";
        if ($requestor->contact) {
            Http::asForm()->post('https://semaphore.co/api/v4/messages', [
                'apikey' => '191998cd60101ec1f81b319a063fb06a',
                'number' => $requestor->contact,
                'message' => $message,
                'sender_name' => '',
            ]);
        }
        
        $otp = $message;
        Mail::to($requestor->username)->send(new OtpStringsRequest($otp));

        $update = RequestDoc::where('id', $request->id)->update([ 'status' => 2]);
        if($update) {
            return response()->json([
                'status' => 200,
                'message' => 'Requested document has been claimed!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }

}
