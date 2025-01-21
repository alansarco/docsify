<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Utilities\Utils;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use App\Models\Admin;
use App\Models\AdminLog;
use App\Models\App_Info;
use App\Models\Calendar;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Date;

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
    public function updatesdminsettings(Request $request) {
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
            'system_contact' => 'required|numeric', 
            'system_security_code' => 'required',
            'system_admin_limit' => 'required|numeric',
            'system_info' => 'required',
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
                        AdminLog::create([
                            'module' => 'Admin Settings',
                            'action' => 'UPDATE',
                            'details' => $authUser->fullname . ' updated admin settings with the following changes: ' . json_encode($changes),
                            'created_by' => $authUser->fullname,
                        ]);
                    }
                    else if($pictureLogo) {
                        AdminLog::create([
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

}
