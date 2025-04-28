<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Utilities\Utils;
use App\Models\Client;
use App\Models\StudentStorage;
use Illuminate\Support\Str;

class StorageController extends Controller
{
    public function index() {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();

        $filedata = StudentStorage::select('*',
            DB::raw("TO_BASE64(file_data) as file_data"),
            DB::raw("DATE_FORMAT(created_at, '%M %d, %Y %h:%i %p') AS date_added")
            )
            ->where('username', $authUser->username)
            ->orderBy('created_at', 'DESC')->paginate(50);

        if($filedata) {
            return response()->json([
                'status' => 200,
                'filedata' => $filedata,
                'message' => 'Personal storage retrieved!',
            ]);
        }   
        else {
            return response()->json([
                'filedata' => $filedata,
                'message' => 'Personal storage empty!'
            ]);
        }
    }

    public function deletestoragedata(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "USER" || $authUser->access_level != 5) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $delete = DB::table('students_storage')->where('id', $request->id)->delete();
        
        if($delete) {
            return response()->json([
                'status' => 200,
                'message' => 'File deleted successfully!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }

    public function downloadstoragedata(Request $request) {
        $application = StudentStorage::where('id', $request->fileid)->first();
    
        if (!$application || !$application->file_data) {
            return response()->json(['message' => 'File not found!'], 404);
        }
    
        // Determine the MIME type of the file data
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->buffer($application->file_data) ?: 'octet-stream';

        return response()->stream(function () use ($application) {
            echo $application->file_data;
        }, 200, [
            'Content-Type' => $mimeType,
        ]);
    }

    public function uploadstoragedata(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "USER" || $authUser->access_level != 5) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $validator = Validator::make($request->all(), [
            'fileName' => 'required',
            'fileType' => 'required',
            'fileData' => 'required|file|mimes:jpeg,png,jpg,gif,pdf,xlsx,xls,csv,ppt,pptx,doc,docx,zip|max:5120',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }

        $getCompanyLimit = Client::select('file_limit')->where('clientid', $authUser->clientid)->first();
        $getUserTotalFile = StudentStorage::where('username', $authUser->username)->count();

        if ($getCompanyLimit && $getCompanyLimit->file_limit <= $getUserTotalFile) {
            return response()->json([
                'message' => 'You reached the maximum file limit!'
            ]);
        }

        $fileData = null; // Initialize the variable to hold the file path
        if ($request->hasFile('fileData')) {
            $file = $request->file('fileData');
            $fileData = file_get_contents($file->getRealPath()); // Get the file content as a string
        }
        $add = StudentStorage::create([
            'username' => $authUser->username,
            'file_name' => $request->fileName,
            'file_type' => $request->fileType,
            'file_data' => $fileData
        ]);
        
        if($add) {
            return response()->json([
                'status' => 200,
                'message' => 'File uploaded successfully!'
            ], 200);
        }
        else {
            return response()->json([
                'message' => 'Failed to upload file!'
            ]);
        }
    
    }
}
