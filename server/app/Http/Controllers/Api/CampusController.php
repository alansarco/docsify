<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Carbon\Carbon;
use Exception;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Http\Controllers\Utilities\Utils;
use App\Mail\CampusAddedEmail;
use App\Mail\CampusRenewEmail;
use App\Models\LogAdmin;
use App\Models\App_Info;
use App\Models\Client;
use App\Models\LicenseKey;
use App\Models\SystemIncome;
use Illuminate\Support\Facades\Mail;

class CampusController extends Controller
{
    // Get all the list of campuses
    public function active(Request $request) {
        $filter = $request->filter ?? '';
        $minPayment = $request->min_payment ?? '';
        $maxPayment = $request->max_payment ?? '';
        $expiresAt = $request->subscription_end ?? '';
        $startsAt = $request->subscription_start ?? '';

        // Call the stored procedure
        $campus = DB::select('CALL GET_CAMPUS_ACTIVE(?, ?, ?, ?, ?)', [$filter, $minPayment, $maxPayment, $expiresAt, $startsAt]);

        // Convert the results into a collection
        $campusCollection = collect($campus);

        // Set pagination variables
        $perPage = 50; // Number of items per page
        $currentPage = LengthAwarePaginator::resolveCurrentPage(); // Get the current page

        // Slice the collection to get the items for the current page
        $currentPageItems = $campusCollection->slice(($currentPage - 1) * $perPage, $perPage)->values();

        // Create a LengthAwarePaginator instance
        $paginatedCampuses = new LengthAwarePaginator($currentPageItems, $campusCollection->count(), $perPage, $currentPage, [
            'path' => $request->url(), // Set the base URL for pagination links
            'query' => $request->query(), // Preserve query parameters in pagination links
        ]);

        // Return the response
        if ($paginatedCampuses->count() > 0) {
            return response()->json([
                'status' => 200,
                'campuses' => $paginatedCampuses,
                'message' => 'Campuses retrieved!',
            ], 200);
        } else {
            return response()->json([
                'message' => 'No Campuses found!',
                'campuses' => $paginatedCampuses
            ]);
        }
    }

    public function inactive(Request $request) {
        $filter = $request->filter ?? '';
        $minPayment = $request->min_payment ?? '';
        $maxPayment = $request->max_payment ?? '';
        $expiresAt = $request->subscription_end ?? '';
        $startsAt = $request->subscription_start ?? '';

        // Call the stored procedure
        $campus = DB::select('CALL GET_CAMPUS_INACTIVE(?, ?, ?, ?, ?)', [$filter, $minPayment, $maxPayment, $expiresAt, $startsAt]);

        // Convert the results into a collection
        $campusCollection = collect($campus);

        // Set pagination variables
        $perPage = 50; // Number of items per page
        $currentPage = LengthAwarePaginator::resolveCurrentPage(); // Get the current page

        // Slice the collection to get the items for the current page
        $currentPageItems = $campusCollection->slice(($currentPage - 1) * $perPage, $perPage)->values();

        // Create a LengthAwarePaginator instance
        $paginatedCampuses = new LengthAwarePaginator($currentPageItems, $campusCollection->count(), $perPage, $currentPage, [
            'path' => $request->url(), // Set the base URL for pagination links
            'query' => $request->query(), // Preserve query parameters in pagination links
        ]);

        // Return the response
        if ($paginatedCampuses->count() > 0) {
            return response()->json([
                'status' => 200,
                'campuses' => $paginatedCampuses,
                'message' => 'Campuses retrieved!',
            ], 200);
        } else {
            return response()->json([
                'message' => 'No Campuses found!',
                'campuses' => $paginatedCampuses
            ]);
        }
    }

    public function addcampus(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "ADMIN" || $authUser->access_level < 999) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $validator = Validator::make($request->all(), [
            'clientid' => 'required',
            'client_name' => 'required',
            'client_acr' => 'required',
            'client_email' => 'required|email',
            'client_contact' => 'required|string|regex:/^\+?[0-9]{10,15}$/',
            'client_address' => 'required',
            'license_key' => 'required',
            'subscription_start' => 'required',
            'client_logo' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:5120',
            'client_banner' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }
        $chekLicense = LicenseKey::where('license_key', $request->license_key)
            ->whereNull('license_client')
            ->orWhere('license_client', '')
            ->first();
        if(!$chekLicense) {
            return response()->json([
                'message' => 'Invalid license key!'
            ]);
        }

        $campusExist = DB::table('clients')->where('clientid', $request->clientid)->first();
        $emailExist = DB::table('clients')->where('client_email', $request->client_email)->first();
        $licenseExist = DB::table('clients')->where('license_key', $request->license_key)->first();
        $SubscriptionEnd = Carbon::parse($request->subscription_start)->addDays($chekLicense->license_duration);

        if(!$campusExist && !$emailExist && !$licenseExist) {
            try {
                $pictureLogo = null; // Initialize the variable to hold the file path
                $pictureBanner = null; // Initialize the variable to hold the file path
                if ($request->hasFile('client_logo')) {
                    $file = $request->file('client_logo');
                    $pictureLogo = file_get_contents($file->getRealPath()); // Get the file content as a string
                }
                if ($request->hasFile('client_banner')) {
                    $file = $request->file('client_banner');
                    $pictureBanner = file_get_contents($file->getRealPath()); // Get the file content as a string
                }
                $add = Client::create([
                    'clientid' => $request->clientid,
                    'client_name' => $request->client_name,   
                    'client_acr' => $request->client_acr,   
                    'client_email' => $request->client_email,   
                    'client_contact' => $request->client_contact,   
                    'client_address' => $request->client_address,   
                    'license_key' => $request->license_key,   
                    'subscription_start' => $request->subscription_start,
                    'subscription_end' => $SubscriptionEnd,   
                    'current_payment' => $chekLicense->license_price,  
                    'total_payment' => $chekLicense->license_price,  
                    'client_logo' => $pictureLogo,
                    'client_banner' => $pictureBanner,
                    'created_by' => $authUser->fullname,
                    'updated_by' => $authUser->fullname,
                ]);

            if($add) {
                $data = $request->clientid;
                $adminInfo = App_Info::first();
                $otpSent = false;
                if($adminInfo->notify_campus_add == 1) {
                    $otpSent = Mail::to($request->client_email)->send(new CampusAddedEmail($data));
                }
                LogAdmin::create([
                    'module' => 'Campus',
                    'action' => 'ADD',
                    'details' => $authUser->fullname .' added campus '.$request->clientid. '-'.$request->client_name,
                    'created_by' => $authUser->fullname,
                ]);
                LicenseKey::where('license_key', $request->license_key)
                ->update([
                    'license_client' => $request->clientid,
                    'license_date_use' => Carbon::today(),
                    'updated_by' => $authUser->fullname,
                ]);
                SystemIncome::create([
                    'price' => $chekLicense->license_price ?? 0,
                    'year_sold' => date('Y'), 
                    'sold_to' => $request->clientid,
                    'created_by' => $authUser->fullname,
                ]);
                if($otpSent) {
                    return response()->json([
                        'status' => 200,
                        'message' => 'Campus added successfully and email notification has been sent!'
                    ], 200);
                }
                return response()->json([
                    'status' => 200,
                    'message' => 'Campus added successfully!'
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
        else if($emailExist) {
            return response()->json([
                'message' => 'Email already taken!'
            ]);
        }
        else if($licenseExist) {
            return response()->json([
                'message' => 'License already taken!'
            ]);
        }
        else {
            return response()->json([
                'message' => 'Client already exist!'
            ]);
        }
    }

    public function updatecampus(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "ADMIN" || $authUser->access_level < 999) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $validator = Validator::make($request->all(), [
            'clientid' => 'required',
            'client_name' => 'required',
            'client_acr' => 'required',
            'client_email' => 'required|email',
            'client_contact' => 'required|string|regex:/^\+?[0-9]{10,15}$/',
            'client_address' => 'required',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }
        else {
            
            $today = Carbon::today();
            $campusExist = DB::table('clients')->where('clientid', $request->clientid)->first();
            $expiredLicense = DB::table('clients')
                ->where('subscription_end', '<', $today)
                ->where('clientid', $request->clientid)->first();
            $emailExist = DB::table('clients')->where('client_email', $request->client_email)->whereNot('clientid', $request->clientid)->first();

            if($campusExist && !$emailExist && !$expiredLicense) {
                try {
                    $valid_license = false;
                    if($request->new_license_key) {
                        $chekLicense = LicenseKey::where('license_key', $request->new_license_key)
                        ->whereNull('license_client')
                        ->orWhere('license_client', '')
                        ->first();
                        if(!$chekLicense) {
                            return response()->json([
                                'message' => 'Invalid license key!'
                            ]);
                        }
                    $SubscriptionEnd = Carbon::parse($campusExist->subscription_end)->addDays($chekLicense->license_duration);
                    $valid_license = true;
                    }

                    $updateData = [
                        'client_name' => $request->client_name,   
                        'client_acr' => $request->client_acr,   
                        'client_email' => $request->client_email,   
                        'client_contact' => $request->client_contact,   
                        'client_address' => $request->client_address,   
                        'updated_by' => $authUser->fullname,
                    ];
                    $pictureLogo = null;
                    $pictureBanner = null;
                    // Check if client_logo is provided and add it to the update array
                    if ($valid_license) {
                        $updateData['license_key'] = $request->new_license_key;
                        $updateData['subscription_end'] = $SubscriptionEnd;
                        $updateData['current_payment'] = $chekLicense->license_price;
                        $updateData['total_payment'] = $campusExist->total_payment + $chekLicense->license_price;
                    }
                    // Check if client_logo is provided and add it to the update array
                    if ($request->hasFile('client_logo')) {
                        $file = $request->file('client_logo');
                        $pictureLogo = file_get_contents($file->getRealPath()); // Get the file content as a string
                        $updateData['client_logo'] = $pictureLogo;
                    }

                    // Check if client_banner is provided and add it to the update array
                    if ($request->hasFile('client_banner')) {
                        $file = $request->file('client_banner');
                        $pictureBanner = file_get_contents($file->getRealPath()); // Get the file content as a string
                        $updateData['client_banner'] = $pictureBanner;
                    }
                    $existingKeys = Client::where('clientid', $request->clientid)->first();
                    $changes = [];

                    // Compare all fields except those related to pictures
                    foreach ($updateData as $key => $value) {
                        if (($key !== 'client_logo' && $key !== 'client_banner') && isset($existingKeys[$key]) && $existingKeys[$key] != $value) {
                            $changes[$key] = [
                                'old' => $existingKeys[$key],
                                'new' => $value
                            ];
                        }
                    }
                    $update = Client::where('clientid', $request->clientid)->update($updateData);
    
                    if($update) {
                        if (!empty($changes)) {
                            LogAdmin::create([
                                'module' => 'Campus',
                                'action' => 'UPDATE',
                                'details' => $authUser->fullname .' updated campus '.$request->clientid. '-'.$request->client_name.' with the following changes: ' . json_encode($changes),
                                'created_by' => $authUser->fullname,
                            ]);
                        }
                        else if($pictureBanner || $pictureLogo) {
                            if($pictureBanner && $pictureLogo) {
                                LogAdmin::create([
                                    'module' => 'Campus',
                                    'action' => 'UPDATE',
                                    'details' => $authUser->fullname .' updated campus '.$request->clientid. '-'.$request->client_name.' with the changes on campus banner and logo',
                                    'created_by' => $authUser->fullname,
                                ]);
                            }
                            else if($pictureBanner) {
                                LogAdmin::create([
                                    'module' => 'Campus',
                                    'action' => 'UPDATE',
                                    'details' => $authUser->fullname .' updated campus '.$request->clientid. '-'.$request->client_name.' with the changes on campus banner',
                                    'created_by' => $authUser->fullname,
                                ]);
                            }
                            else if($pictureLogo) {
                                LogAdmin::create([
                                    'module' => 'Campus',
                                    'action' => 'UPDATE',
                                    'details' => $authUser->fullname .' updated campus '.$request->clientid. '-'.$request->client_name.' with the changes on campus logo',
                                    'created_by' => $authUser->fullname,
                                ]);
                            }
                            
                        }
                        LicenseKey::where('license_key', $request->new_license_key)
                        ->update([
                            'license_client' => $request->clientid,
                            'license_date_use' => Carbon::today(),
                            'updated_by' => $authUser->fullname,
                        ]);
                        if($valid_license) {
                            SystemIncome::create([
                                'price' => $chekLicense->license_price ?? 0,
                                'year_sold' => date('Y'), 
                                'sold_to' => $request->clientid,
                                'created_by' => $authUser->fullname,
                            ]);
                        }
                        return response()->json([
                            'status' => 200,
                            'message' => 'Campus updated successfully!'
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
            else if($emailExist) {
                return response()->json([
                    'message' => 'Email already taken!'
                ]);
            }
            else if($expiredLicense) {
                return response()->json([
                    'message' => 'License already expired!'
                ]);
            }
            else {
                return response()->json([
                    'message' => 'Campus not exist!'
                ]);
            }
        }
    }

    public function renewcampus(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "ADMIN" || $authUser->access_level < 999) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $validator = Validator::make($request->all(), [
            'clientid' => 'required',
            'new_license_key' => 'required',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }
        else {
            $chekLicense = LicenseKey::where('license_key', $request->new_license_key)
            ->whereNull('license_client')
            ->orWhere('license_client', '')
            ->first();
            if(!$chekLicense) {
                return response()->json([
                    'message' => 'Invalid license key!'
                ]);
            }
            $SubscriptionEnd = Carbon::parse(Carbon::today())->addDays($chekLicense->license_duration);
            $campusExist = DB::table('clients')->where('clientid', $request->clientid)->first();

            if($campusExist) {
                try {
                    $updateData = [
                        'license_key' => $request->new_license_key,   
                        'subscription_end' => $SubscriptionEnd,   
                        'current_payment' => $chekLicense->license_price,   
                        'total_payment' => $campusExist->total_payment + $chekLicense->license_price,   
                        'created_by' => $authUser->fullname,
                        'updated_by' => $authUser->fullname,
                    ];

                    $update = Client::where('clientid', $request->clientid)->update($updateData);
    
                    if($update) {
                        $data = $request->clientid;
                        $adminInfo = App_Info::first();
                        $otpSent = false;
                        if($adminInfo->notify_campus_renew == 1) {
                            $otpSent = Mail::to($campusExist->client_email)->send(new CampusRenewEmail($data));
                        }
                        LogAdmin::create([
                            'module' => 'Campus',
                            'action' => 'UPDATE',
                            'details' => $authUser->fullname .' updated/renew license for campus '.$campusExist->clientid. '-'.$campusExist->client_name,
                            'created_by' => $authUser->fullname,
                        ]);
                        LicenseKey::where('license_key', $request->new_license_key)
                        ->update([
                            'license_client' => $request->clientid,
                            'license_date_use' => Carbon::today(),
                            'updated_by' => $authUser->fullname,
                        ]);
                        SystemIncome::create([
                            'price' => $chekLicense->license_price ?? 0,
                            'year_sold' => date('Y'), 
                            'sold_to' => $request->clientid,
                            'created_by' => $authUser->fullname,
                        ]);
                        if($otpSent) {
                            return response()->json([
                                'status' => 200,
                                'message' => 'Campus license renewed successfully and email notification is sent to campus email!'
                            ], 200);
                        }
                        return response()->json([
                            'status' => 200,
                            'message' => 'Campus license renewed successfully!'
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
            else {
                return response()->json([
                    'message' => 'Campus not exist!'
                ]);
            }
        }
    }

    // Delete 
    public function deletecampus(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "ADMIN" || $authUser->access_level < 999) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }
        $delete = Client::where('clientid', $request->clientid)->delete();

        if($delete) {
            LogAdmin::create([
                'module' => 'Campus',
                'action' => 'DELETE',
                'details' => $authUser->fullname .' deleted campus '. $request->clientid,
                'created_by' => $authUser->fullname,
            ]);
            return response()->json([
                'status' => 200,
                'message' => 'Campus deleted successfully!'
            ], 200);
        }
        else {
            return response()->json([
                'message' => 'Campus not found!'
            ]);
        }
    }

    // retrieve specific information
    public function retrievecampus(Request $request) {

        $dataRetrieved = Client::leftJoin('users', 'clients.client_representative', 'users.username')
            ->select('clients.*',
                DB::raw("TO_BASE64(clients.client_logo) as client_logo"),
                DB::raw("TO_BASE64(clients.client_banner) as client_banner"),
                DB::raw("CONCAT(DATE_FORMAT(clients.subscription_start, '%M %d, %Y')) as format_subscription_start"),
                DB::raw("CONCAT(DATE_FORMAT(clients.subscription_end, '%M %d, %Y')) as format_subscription_end"),
                DB::raw("CONCAT(DATE_FORMAT(clients.created_at, '%M %d, %Y %h:%i %p')) as created_date"),
                DB::raw("CONCAT(DATE_FORMAT(clients.updated_at, '%M %d, %Y %h:%i %p')) as updated_date"),
                DB::raw("CONCAT(COALESCE(users.first_name, ''), ' ', COALESCE(users.middle_name, ''), ' ', COALESCE(users.last_name, '')) AS representative_name"),
                DB::raw("CAST((
                    SELECT COUNT(*)
                    FROM users
                    WHERE 
                        users.clientid = clients.clientid
                        AND users.role = 'USER'
                        AND users.account_status = 1
                ) AS CHAR) AS studentCount"),
                DB::raw("CAST((
                    SELECT COUNT(*)
                    FROM users
                    WHERE 
                        users.clientid = clients.clientid
                        AND users.role = 'REGISTRAR'
                        AND users.account_status = 1
                ) AS CHAR) AS registrarCount"),
        )
        ->where('clients.clientid', $request->dataid)->first();

        $licenseRetrieved = LicenseKey::
            select('*', DB::raw("CONCAT(DATE_FORMAT(license_date_use, '%M %d, %Y')) as date_use"),)
            ->where('license_client', $request->dataid)
            ->orderBy('license_date_use', 'DESC')
            ->get();

        if($dataRetrieved) {
            return response()->json([
                'status' => 200,
                'dataRetrieved' => $dataRetrieved,
                'licenseRetrieved' => $licenseRetrieved,
                'message' => "Data retrieved!"
            ], 200);
        }
        else {
            return response()->json([
                'dataRetrieved' => $dataRetrieved,
                'licenseRetrieved' => $licenseRetrieved,
                'message' => "Data not found!"
            ]);
        }
    }
}
