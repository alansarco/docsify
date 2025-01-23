<?php

namespace App\Http\Controllers\Api;

use Exception;
use App\Http\Controllers\Controller;
use App\Models\LicenseKey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Utilities\Utils;
use App\Models\LogRepresentative;
use App\Models\Document;
use Illuminate\Support\Str;

class DocumentController extends Controller
{
    public function index(Request $request) {
        $query = Document::select('*',
            DB::raw("DATE_FORMAT(created_at, '%M %d, %Y %h:%i %p') AS date_added"));

        if($request->filter) {
            $query->where('doc_name', 'LIKE' , '%'.$request->filter.'%');
        }

        if($request->status != '') {
            $query->where('status', $request->status);
        }

        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        $query->where('clientid', $authUser->clientid);

        $documents = $query->orderBy('created_at', 'DESC')->paginate(20);

        if($documents) {
            return response()->json([
                'status' => 200,
                'documents' => $documents,
                'message' => 'Documents retrieved!',
            ]);
        }   
        else {
            return response()->json([
                'documents' => $documents,
                'message' => 'No documents found!'
            ]);
        }
    }

    public function adddocument(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "REPRESENTATIVE" || $authUser->access_level != 30) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $validator = Validator::make($request->all(), [ 
            'doc_name' => 'required',
            'doc_limit' => 'required',
            'days_process' => 'required',
            'doc_requirements' => 'required',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }

        // Generate a unique 10-character id
        do {
            $GeneratedID = Str::upper(Str::random(10)); // Generate a random string of 15 characters
        } while (DB::table('documents')->where('doc_id', $GeneratedID)->exists());

        $add = Document::create([
            'doc_id' => $GeneratedID,
            'clientid' => $authUser->clientid,
            'doc_name' => strtoupper($request->doc_name),
            'doc_limit' => $request->doc_limit,
            'days_process' => $request->days_process,
            'doc_requirements' => $request->doc_requirements,
            'status' => 1,
            'created_by' => $authUser->fullname
        ]);

        if($add) {
            LogRepresentative::create([
                'clientid' => $authUser->clientid,
                'module' => 'Documents',
                'action' => 'ADD',
                'details' => $authUser->fullname .' added new document ' .$GeneratedID. ' - ' .$request->doc_name,
                'created_by' => $authUser->fullname,
            ]);
            return response()->json([
                'status' => 200,
                'message' => 'Document added successfully!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }

    public function retrievedocument(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();

        $dataRetrieved = Document::leftJoin('clients', 'documents.clientid', 'clients.clientid')
            ->select('documents.*',
            DB::raw("DATE_FORMAT(documents.created_at, '%M %d, %Y %h:%i %p') AS created_date"),
            DB::raw("DATE_FORMAT(documents.updated_at, '%M %d, %Y %h:%i %p') AS updated_date"),
            DB::raw("TO_BASE64(clients.client_logo) as client_logo"),
            DB::raw("TO_BASE64(clients.client_banner) as client_banner"),
            )
            ->where('documents.clientid', $authUser->clientid)
            ->where('documents.doc_id', $request->data)
            ->first();
        
        if($dataRetrieved) {
            return response()->json([
                'status' => 200,
                'dataRetrieved' => $dataRetrieved,
                'message' => 'Document data retrieved!',
            ]);
        }
        return response()->json([
            'dataRetrieved' => $dataRetrieved,
            'message' => 'Error retrieving data!',
        ]);
    }

    public function updatedocument(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "REPRESENTATIVE" || $authUser->access_level != 30) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $validator = Validator::make($request->all(), [
            'doc_id' => 'required',
            'doc_name' => 'required',
            'doc_limit' => 'required',
            'days_process' => 'required',
            'doc_requirements' => 'required',
            'status' => 'required',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }
        $updateData = [
            'doc_name' => strtoupper($request->doc_name),
            'doc_limit' => $request->doc_limit,
            'days_process' => $request->days_process,
            'doc_requirements' => $request->doc_requirements,
            'status' => $request->status,
            'updated_by' => $authUser->fullname,
        ];

        $existingKeys = Document::where('doc_id', $request->doc_id)->first();
        $changes = [];

        // Compare all fields except those related to pictures
        foreach ($updateData as $key => $value) {
            if (isset($existingKeys[$key]) && $existingKeys[$key] != $value) {
                $changes[$key] = [
                    'old' => $existingKeys[$key],
                    'new' => $value
                ];
            }
        }

        $update = Document::where('doc_id', $request->doc_id)->update($updateData);

        if($update) {
            if (!empty($changes)) {
                LogRepresentative::create([
                    'clientid' => $authUser->clientid,
                    'module' => 'Documents',
                    'action' => 'UPDATE',
                    'details' => $authUser->fullname .' updated document '.$request->doc_id. ' with the following changes: ' . json_encode($changes),
                    'created_by' => $authUser->fullname,
                ]);
            }
            return response()->json([
                'status' => 200,
                'message' => 'Document updated successfully!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }

    public function deletedocument(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "REPRESENTATIVE" || $authUser->access_level != 30) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $delete = Document::where('doc_id', $request->doc_id)->delete();
        
        if($delete) {
            LogRepresentative::create([
                'clientid' => $authUser->clientid,
                'module' => 'Documents',
                'action' => 'DELETE',
                'details' => $authUser->fullname .' deleted document '.$request->license_key,
                'created_by' => $authUser->fullname,
            ]);
            return response()->json([
                'status' => 200,
                'message' => 'Document deleted successfully!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }

}
