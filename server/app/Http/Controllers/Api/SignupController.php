<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Utilities\Utils;
use App\Mail\OtpStringsEmailVerification;
use App\Models\App_Info;
use App\Models\Client;
use App\Models\LicenseKey;
use App\Models\LogAdmin;
use App\Models\OTP;
use App\Models\SystemIncome;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Str;
use Exception;
use Illuminate\Support\Facades\Mail;

class SignupController extends Controller
{
    public function createotpverification(Request $request) {
        try {
            $checkpass = new Utils;
            $checkpass = $checkpass->checkPassword($request->password);
            if($checkpass) return $checkpass;

            if($request->role == 30) {
                $validator = Validator::make($request->all(), [ 
                    'username' => 'required|email',
                    'first_name' => 'required',
                    'last_name' => 'required',
                    'password' => 'required',
                    'gender' => 'required',
                    'contact' => 'required|string|regex:/^\+?[0-9]{10,15}$/',
                    'birthdate' => 'required',   
                    'address' => 'required',   
                    'id_picture' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:5120',

                    'new_clientid' => 'required',   
                    'client_name' => 'required',   
                    'client_acr' => 'required',   
                    'subscription' => 'required',   
                    'client_email' => 'required|email',   
                ]);
            }
            else {
                $validator = Validator::make($request->all(), [ 
                    'email' => 'required|email',
                    'username' => 'required',
                    'first_name' => 'required',
                    'last_name' => 'required',
                    'password' => 'required',
                    'gender' => 'required',
                    'contact' => 'required|string|regex:/^\+?[0-9]{10,15}$/',
                    'birthdate' => 'required',   
                    'address' => 'required',   
                    'id_picture' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:5120',
                    'school_id' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:5120',
                ]);
            }

            if($validator->fails()) {
                return response()->json([
                    'message' => $validator->messages()->all()
                ]);
            }
            else {
                if($request->role == 30) {
                    $campusExist = DB::table('clients')->where('clientid', $request->new_clientid)->first();
                    $emailExist = DB::table('clients')->where('client_email', $request->client_email)->first();
                    if ($campusExist) return response()->json(['message' => 'Client already exist!' ]);
                    else if ($emailExist) return response()->json(['message' => 'Email already taken!']);
                }

                $user = DB::table('users')->where('username', $request->username)->first();
                if($user) {
                    return response()->json([
                        'message' => 'Username already exist!'
                    ]);        
                }

                $useremail = DB::table('users')->where('email', $request->email)->first();
                if($useremail) {
                    return response()->json([
                        'message' => 'Email already exist!'
                    ]);        
                }
                else {
                    $otp = Str::random(6);
    
                    $existingOTP = OTP::where('id', $otp)->first();
                    DB::table('temporary_otp')->where('valid_for', $request->username)->delete();
        
                    while ($existingOTP) {
                          $otp = Str::random(6);
                          $existingOTP = OTP::where('id', $otp)->first();
                    }

                    $sentTo = $request->email;
                    if(!$sentTo) {
                        $sentTo = $request->username;
                    }
                    
                    $otpSent = Mail::to($request->email)->send(new OtpStringsEmailVerification($otp));
        
                    $newOTP = OTP::create([
                          'id' => $otp,
                          'valid_for' => $request->username,
                          'expires_at' => now()->addMinutes(5), 
                    ]);   
        
                    if($otpSent && $newOTP) {
                          return response()->json([
                                'status' => 200,  
                                'message' => "OTP is sent to your email"
                          ], 200);
                    }
                    
                    return response()->json([
                          'status' => 404,
                          'message' => "Something went wrong in generating OTP"
                    ], 404);
                }
            }
        }
        catch (Exception $e) {
            return response()->json([
                'status' => 404,
                'message' => $e->getMessage()
            ], 404);
        }
    }

    public function signupuser(Request $request) {
        $checkOTP = OTP::where('id', $request->otp_code)->where('valid_for', $request->username)->where('expires_at', ">", now())->first();

        if($checkOTP) {
            if($request->role == 30) {
                $validator = Validator::make($request->all(), [ 
                    'username' => 'required|email',
                    'first_name' => 'required',
                    'last_name' => 'required',
                    'password' => 'required',
                    'gender' => 'required',
                    'contact' => 'required|string|regex:/^\+?[0-9]{10,15}$/',
                    'birthdate' => 'required',   
                    'address' => 'required',   
                    'id_picture' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:5120',

                    'new_clientid' => 'required',   
                    'client_name' => 'required',   
                    'client_acr' => 'required',   
                    'subscription' => 'required',   
                    'client_email' => 'required|email',   
                ]);
            }
            else {
                $validator = Validator::make($request->all(), [ 
                    'email' => 'required|email',
                    'username' => 'required',
                    'first_name' => 'required',
                    'last_name' => 'required',
                    'password' => 'required',
                    'gender' => 'required',
                    'contact' => 'required|string|regex:/^\+?[0-9]{10,15}$/',
                    'birthdate' => 'required',   
                    'address' => 'required',   
                    'id_picture' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:5120',
                    'school_id' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:5120',
                ]);
            }
    
            if($validator->fails()) {
                return response()->json([
                    'message' => $validator->messages()->all()
                ]);
            }
    
            else {
                try {
                    $pictureData = null; // Initialize the variable to hold the file path
                    $shoolIDData = null; // Initialize the variable to hold the file path
                    if ($request->hasFile('id_picture')) {
                        $file = $request->file('id_picture');
                        $pictureData = file_get_contents($file->getRealPath()); // Get the file content as a string
                    }
                    if ($request->hasFile('school_id')) {
                        $file = $request->file('school_id');
                        $shoolIDData = file_get_contents($file->getRealPath()); // Get the file content as a string
                    }

                    $clientid = $request->role == 30 ? $request->new_clientid : $request->clientid;
                    $grade = $request->role != 5 ? '' : $request->grade;
                    $year_enrolled = $request->role != 5 ? '' : $request->year_enrolled;
                    $account_status = $request->role == 30 ? 1 : 0;
                    $useremail = $request->role == 30 ? $request->username : $request->email;

                    $role = new Utils;
                    $role = $role->checkRole($request->role);

                    $app_info = App_Info::select('price_per_day')->first();

                    
                    if($request->role == 30) {
                        $campusExist = DB::table('clients')->where('clientid', $request->new_clientid)->first();
                        $emailExist = DB::table('clients')->where('client_email', $request->client_email)->first();
                        if ($campusExist) 
                            return response()->json(['message' => 'Client already exist!' ]);
                        else if ($emailExist) 
                            return response()->json(['message' => 'Email already taken!']);

                        $current_payment = 0;
                        $SubscriptionEnd = Carbon::today()->addDays($request->subscription);
                        if($app_info && $app_info->price_per_day) {}
                            $current_payment = $app_info->price_per_day * $request->subscription;

                    }
                    
                    $add = User::create([
                        'clientid' => $clientid,
                        'username' => $request->username,
                        'email' => $useremail,
                        'first_name' => strtoupper($request->first_name),
                        'middle_name' => strtoupper($request->middle_name),
                        'last_name' => strtoupper($request->last_name),
                        'gender' => $request->gender,   
                        'password' => $request->password,   
                        'address' => $request->address,   
                        'contact' => $request->contact,   
                        'role' => $role,   
                        'access_level' => $request->role,   
                        'grade' => $grade,   
                        'year_enrolled' => $year_enrolled,   
                        'id_picture' => $pictureData,   
                        'requirement' => $shoolIDData,   
                        'birthdate' => $request->birthdate,  
                        'account_status' => $account_status,  
                        'updated_by' => $request->first_name,
                        'created_by' => $request->first_name,
                    ]);

                    OTP::where('id', $request->otp_code)->delete();
        
                    if($add) {
                        if($request->role == 30) {
                            // Generate a unique 15-character license key
                            do {
                                $GeneratedLicense = Str::upper(Str::random(15)); // Generate a random string of 15 characters
                            } while (DB::table('license_keys')->where('license_key', $GeneratedLicense)->exists());

                            LicenseKey::create([
                                'license_key' => $GeneratedLicense,
                                'license_price' => $current_payment,
                                'license_duration' => $request->subscription,
                                'created_by' => $request->username,
                                'license_client' => $request->new_clientid,
                                'license_date_use' => Carbon::today(),
                            ]);
                            
                            Client::create([
                                'clientid' => $request->new_clientid,
                                'client_name' => $request->client_name,   
                                'client_acr' => $request->client_acr,   
                                'client_email' => $request->client_email,   
                                'license_key' => $GeneratedLicense,   
                                'subscription_start' => Carbon::today(),
                                'subscription_end' => $SubscriptionEnd,   
                                'current_payment' => $current_payment,  
                                'total_payment' => $current_payment,  
                                'client_representative' => $request->username,  
                                'created_by' => $request->username,
                                'updated_by' => $request->username,
                            ]);

                            SystemIncome::create([
                                'price' => $current_payment ?? 0,
                                'year_sold' => date('Y'), 
                                'sold_to' => $request->new_clientid,
                                'created_by' => $request->username,
                            ]);

                            LogAdmin::create([
                                'module' => 'Campus',
                                'action' => 'ADD',
                                'details' => $request->username .' added campus '.$request->new_clientid. '-'.$request->client_name,
                                'created_by' => $request->username,
                            ]);
                            return response()->json([
                                'status' => 200,
                                'message' => 'Payment Successful and Account Verified! Please login.'
                            ], 200);
                        }
                        return response()->json([
                            'status' => 200,
                            'message' => 'Account submitted successfully! Please wait for the admin to acknowledge your account.'
                        ], 200);
                    }
                    else {
                        return response()->json([
                            'message' => 'Oops... Something went wrong!'
                        ]);
                    }
                } catch (Exception $e) {
                        return response()->json([
                        'message' => $e->getMessage()
                    ]);
                }
            }
        }
        else {
            return response()->json([
                'message' => 'Invalid OTP!'
            ]);
        }
  }
}
