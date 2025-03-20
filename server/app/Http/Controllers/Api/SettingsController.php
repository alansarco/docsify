<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Utilities\Utils;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\LogAdmin;
use App\Models\App_Info;
use App\Models\Client;
use App\Models\LicenseKey;
use App\Models\LogRepresentative;
use App\Models\SystemIncome;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Str;

class SettingsController extends Controller
{
    // Get all the list of system info
    public function adminsettings() {
        $settings = App_Info::select('*',
            DB::raw("TO_BASE64(org_structure) as org_structure"),
            DB::raw("TO_BASE64(logo) as logo"),
            )
            ->paginate(1);

        if($settings) {
            return response()->json([
                'status' => 200,
                'settings' => $settings,
                'message' => 'System settings retrieved!',
            ]);
        }
        return response()->json([
            'settings' => $settings,
            'message' => 'Error loading system settings!',
        ]);
    }

    // Get all the list of system info
    public function adminsettingsretrieved() {
        $settings = App_Info::select('*',
            DB::raw("TO_BASE64(org_structure) as org_structure"),
            DB::raw("TO_BASE64(logo) as logo"),
            )
            ->first();
        
        if($settings) {
            return response()->json([
                'status' => 200,
                'settings' => $settings,
                'message' => 'System settings retrieved!',
            ]);
        }
        return response()->json([
            'settings' => $settings,
            'message' => 'Error loading system settings!',
        ]);
    }

    // update admin settings's information
    public function updateadminsettings(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "ADMIN" || $authUser->access_level < 999) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $validator = Validator::make($request->all(), [
            'system_id' => 'required',
            'system_email' => 'required|email', 
            'system_contact' => 'required|digits:11',
            'system_security_code' => 'required',
            'system_admin_limit' => 'required|numeric',
            'system_info' => 'required',
            'price_per_day' => 'required',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }
        else {
            try {
                $updateData = [
                    'email' => $request->system_email,
                    'contact' => $request->system_contact,
                    'security_code' => $request->system_security_code,
                    'superadmin_limit' => $request->system_admin_limit,
                    'price_per_day' => $request->price_per_day,
                    'system_info' => $request->system_info,
                    'notify_campus_add' => $request->notify_campus_add === "true" ? 1 : 0,
                    'notify_campus_renew' => $request->notify_campus_renew === "true" ? 1 : 0,
                    'notify_user_approve' => $request->notify_user_approve === "true" ? 1 : 0,
                    'updated_by' => $authUser->fullname,
                ];

                $pictureLogo = null; 
                if ($request->hasFile('system_logo')) {
                    $file = $request->file('system_logo');
                    $pictureLogo = file_get_contents($file->getRealPath()); 
                    $updateData['logo'] = $pictureLogo;
                }

                $existingSettings = App_Info::where('system_id', $request->system_id)->first();
                $changes = [];

                // Compare all fields except those related to pictures
                foreach ($updateData as $key => $value) {
                    if ($key !== 'logo' && isset($existingSettings[$key]) && $existingSettings[$key] != $value) {
                        $changes[$key] = [
                            'old' => $existingSettings[$key],
                            'new' => $value
                        ];
                    }
                }
                
                // Perform the update with the conditional data array
                $update = App_Info::where('system_id', $request->system_id)->update($updateData);

                if($update) {
                    if (!empty($changes)) {
                        LogAdmin::create([
                            'module' => 'Admin Settings',
                            'action' => 'UPDATE',
                            'details' => $authUser->fullname . ' updated admin settings with the following changes: ' . json_encode($changes),
                            'created_by' => $authUser->fullname,
                        ]);
                    }
                    else if($pictureLogo) {
                        LogAdmin::create([
                            'module' => 'Admin Settings',
                            'action' => 'UPDATE',
                            'details' => $authUser->fullname . ' updated admin settings with changes in logo',
                            'created_by' => $authUser->fullname,
                        ]);
                    }
                    return response()->json([
                        'status' => 200,
                        'message' => 'System updated successfully!'
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

    // Get all the list of system info
    public function representativesettings() {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();

        $settings = Client::leftJoin('users', 'clients.client_representative', 'users.username')
            ->select('clients.*', 'users.username as representative_id',
                DB::raw("TO_BASE64(clients.client_logo) as client_logo"),
                DB::raw("TO_BASE64(clients.client_banner) as client_banner"),
                DB::raw("CONCAT(DATE_FORMAT(clients.request_timeout, '%h:%i %p')) as request_timeout"),
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
                    FROM license_keys
                    WHERE 
                        license_keys.license_client = clients.clientid
                ) AS CHAR) AS licenseCount"),
                DB::raw("CAST((
                    SELECT COUNT(*)
                    FROM users
                    WHERE 
                        users.clientid = clients.clientid
                        AND users.role = 'REGISTRAR'
                        AND users.account_status = 1
                ) AS CHAR) AS registrarCount"),
        )

        ->where('clients.clientid', $authUser->clientid)
        ->paginate(1);

        if($settings) {
            return response()->json([
                'status' => 200,
                'settings' => $settings,
                'message' => 'System settings retrieved!',
            ]);
        }
        return response()->json([
            'settings' => $settings,
            'message' => 'Error loading system settings!',
        ]);
    }

    // Get all the list of system info
    public function representativesettingsretrieved() {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();

        $settings = Client::leftJoin('users', 'clients.client_representative', 'users.username')
            ->select('clients.*', 'users.username as representative_id',
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
                    FROM license_keys
                    WHERE 
                        license_keys.license_client = clients.clientid
                ) AS CHAR) AS licenseCount"),
                DB::raw("CAST((
                    SELECT COUNT(*)
                    FROM users
                    WHERE 
                        users.clientid = clients.clientid
                        AND users.role = 'REGISTRAR'
                        AND users.account_status = 1
                ) AS CHAR) AS registrarCount"),
        )

        ->where('clients.clientid', $authUser->clientid)
        ->first();

        if($settings) {
            return response()->json([
                'status' => 200,
                'settings' => $settings,
                'message' => 'System settings retrieved!',
            ]);
        }
        return response()->json([
            'settings' => $settings,
            'message' => 'Error loading system settings!',
        ]);
    }


    public function updaterepresentativesettings(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "REPRESENTATIVE" || $authUser->access_level != 30) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $validator = Validator::make($request->all(), [
            'clientid' => 'required',
            'client_name' => 'required',
            'client_acr' => 'required',
            'client_email' => 'required|email',
            'client_contact' => 'required|digits:11',
            'client_address' => 'required',
            'request_limit' => 'required',
            'request_timeout' => 'required',
            'file_limit' => 'required',
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
                    $updateData = [
                        'client_name' => $request->client_name,   
                        'client_acr' => strtoupper($request->client_acr),   
                        'client_email' => $request->client_email,   
                        'client_contact' => $request->client_contact,   
                        'client_address' => $request->client_address,   
                        'request_limit' => $request->request_limit,   
                        'request_timeout' => $request->request_timeout,   
                        'file_limit' => $request->file_limit,   
                        'updated_by' => $authUser->fullname,
                    ];
                    $pictureLogo = null;
                    $pictureBanner = null;
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
                    $app_info = App_Info::select('price_per_day')->first();

                    do {
                        $GeneratedLicense = Str::upper(Str::random(15)); // Generate a random string of 15 characters
                    } while (DB::table('license_keys')->where('license_key', $GeneratedLicense)->exists());

                    if($app_info && $app_info->price_per_day && $request->subscription > 0) {
                        $updateData['subscription_end'] = Carbon::parse($campusExist->subscription_end)->addDays($request->subscription);
                        $updateData['current_payment'] = $app_info->price_per_day * $request->subscription;
                        $updateData['total_payment'] = $campusExist->total_payment + ($app_info->price_per_day * $request->subscription);  
                        $updateData['total_payment'] = $campusExist->total_payment + ($app_info->price_per_day * $request->subscription);  
                        $updateData['license_key'] = $GeneratedLicense ;

                        LicenseKey::create([
                            'license_key' => $GeneratedLicense,
                            'license_price' => $app_info->price_per_day * $request->subscription,
                            'license_duration' => $request->subscription,
                            'created_by' => $authUser->fullname,
                            'license_client' => $campusExist->clientid,
                            'license_date_use' => Carbon::today(),
                        ]);
                        
                        SystemIncome::create([
                            'price' => ($app_info->price_per_day * $request->subscription) ?? 0,
                            'year_sold' => date('Y'), 
                            'sold_to' => $campusExist->clientid,
                            'created_by' => $authUser->fullname,
                        ]);
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
                            LogRepresentative::create([
                                'clientid' => $request->clientid,
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
                                LogRepresentative::create([
                                    'clientid' => $request->clientid,
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
                                LogRepresentative::create([
                                    'clientid' => $request->clientid,
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
                                LogRepresentative::create([
                                    'clientid' => $request->clientid,
                                    'module' => 'Campus',
                                    'action' => 'UPDATE',
                                    'details' => $authUser->fullname .' updated campus '.$request->clientid. '-'.$request->client_name.' with the changes on campus logo',
                                    'created_by' => $authUser->fullname,
                                ]);
                            }
                            
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
}
