<?php

namespace App\Http\Controllers\Api;

use Exception;
use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class DocumentController extends Controller
{
    public function index(Request $request) {
        $query = Document::select('*', DB::raw("DATE_FORMAT(created_at, '%M %d, %Y %h:%i %p') AS created_date"));

        if($request->filter) {
            $organizations = $query->where('doc_name', $request->filter)->paginate(2);
        }
        else{
            $organizations = $query->paginate(20);
        }

        if($organizations) {
            return response()->json([
                'organizations' => $organizations,
                'message' => 'Orgs retrieved!',
            ]);
        }   
        else {
            return response()->json([
                'organizations' => $organizations,
                'message' => 'No orgs  found!'
            ]);
        }
    }

    public function orgselect() {
        $orgs = Document::get();

            if($orgs->count() > 0) {
                return response()->json([
                    'orgs' => $orgs,
                    'message' => 'Orgs retrieved!',
                ]);
            }   
            else {
                return response()->json([
                    'message' => 'No orgs  found!'
                ]);
            }
    }
    public function addorg(Request $request) {
        $authUser = User::select('first_name')->where('username', Auth::user()->username)->first();

        $validator = Validator::make($request->all(), [ 
            'doc_name' => 'required|unique:documents,doc_name',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }

        $addOrg = Document::create([
            'doc_name' => $request->doc_name,
            'created_by' => $authUser->first_name,
        ]);

        if($addOrg) {
            return response()->json([
                'status' => 200,
                'message' => 'Document added successfully!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }

    public function deleteorg(Request $request) {
        $delete = Document::where('doc_name', $request->doc_name)->delete();

        if($delete) {
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
