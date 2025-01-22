<?php

namespace App\Http\Controllers\Api;

use Exception;
use App\Http\Controllers\Controller;
use App\Models\Document;
use App\Models\LicenseKey;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Utilities\Utils;
use App\Models\LogAdmin;
use App\Models\Client;
use Illuminate\Support\Str;

class LicenseController extends Controller
{
    public function index(Request $request) {
        $query = LicenseKey::leftJoin('clients', 'license_keys.license_client', 'clients.clientid')
            ->select('license_keys.*', 'clients.client_acr', 'clients.client_name',
                DB::raw("DATE_FORMAT(license_keys.license_date_use, '%M %d, %Y') AS license_date_use"),
                DB::raw("DATE_FORMAT(license_keys.created_at, '%M %d, %Y %h:%i %p') AS date_added"));

        if($request->filter) {
            $query->where('license_keys.license_key', 'LIKE' , '%'.$request->filter.'%')
                ->orWhere('license_keys.license_duration', 'LIKE' , '%'.$request->filter.'%')
                ->orWhere('clients.client_name', 'LIKE' , '%'.$request->filter.'%')
                ->orWhere('clients.client_acr', 'LIKE' , '%'.$request->filter.'%');
        }
        if($request->filter_price) {
            $query->where('license_keys.license_price', '>=', $request->filter_price);
        }
        
        $organizations = $query->orderBy('license_date_use')->orderBy('created_at', 'DESC')->paginate(20);

        if($organizations) {
            return response()->json([
                'status' => 200,
                'licenses' => $organizations,
                'message' => 'Licenses retrieved!',
            ]);
        }   
        else {
            return response()->json([
                'licenses' => $organizations,
                'message' => 'No licenses  found!'
            ]);
        }
    }

    public function addlicense(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "ADMIN" || $authUser->access_level < 999) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $validator = Validator::make($request->all(), [ 
            'license_price' => 'required',
            'license_duration' => 'required',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }

        // Generate a unique 15-character license key
        do {
            $GeneratedLicense = Str::upper(Str::random(15)); // Generate a random string of 15 characters
        } while (LicenseKey::where('license_key', $GeneratedLicense)->exists());

        $addLicense = LicenseKey::create([
            'license_key' => $GeneratedLicense,
            'license_price' => $request->license_price,
            'license_duration' => $request->license_duration,
        ]);

        if($addLicense) {
            LogAdmin::create([
                'module' => 'License',
                'action' => 'ADD',
                'details' => $authUser->fullname .' added new license '.$GeneratedLicense,
                'created_by' => $authUser->fullname,
            ]);
            return response()->json([
                'status' => 200,
                'message' => 'License added successfully!'
            ], 200);
        }
        return response()->json([
            'message' => 'Something went wrong!'
        ]);
    }

    public function deletelicense(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "ADMIN" || $authUser->access_level < 999) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }
        $checkLicenseUsed = Client::where('license_key', $request->license_key)->first();
        if(!$checkLicenseUsed) {
            $delete = LicenseKey::where('license_key', $request->license_key)->delete();
            if($delete) {
                LogAdmin::create([
                    'module' => 'License',
                    'action' => 'DELETE',
                    'details' => $authUser->fullname .' deleted license '.$request->license_key,
                    'created_by' => $authUser->fullname,
                ]);
                return response()->json([
                    'status' => 200,
                    'message' => 'License deleted successfully!'
                ], 200);
            }
            return response()->json([
                'message' => 'Something went wrong!'
            ]);
        }
        return response()->json([
            'message' => 'License already used, can no longer delete it!'
        ]);
    }

}
