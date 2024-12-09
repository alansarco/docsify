<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Mail\OtpStringsEmailVerification;
use App\Models\OTP;
use Illuminate\Support\Facades\Validator;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use App\Models\Password;
use App\Models\Suffix;
use Illuminate\Support\Str;
use Exception;
use Illuminate\Support\Facades\Mail;

class SignupController extends Controller
{
    public function createotpverification(Request $request) {
        try {
            
            $pattern = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d\s]).{8,}$/';
            if(!preg_match($pattern, $request->password)) {
                return response()->json([
                    'message' => 'Password must contain capital and small letter, number, and special character!'
                ]);    
            }
            $validator = Validator::make($request->all(), [ 
                'username' => 'required',
                'name' => 'required',
                'password' => 'required',
                'gender' => 'required',
                'contact' => 'required',
                'birthdate' => 'required',   
                'address' => 'required',   
                'year_residency' => 'required',   
            ]);
            if($validator->fails()) {
                return response()->json([
                    'message' => $validator->messages()->all()
                ]);
            }
            else {
                $user = DB::table('users')->where('username', $request->username)->first();
                if($user) {
                    return response()->json([
                        'message' => 'Username exist!'
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
                    $otpSent = Mail::to($request->username)->send(new OtpStringsEmailVerification($otp));
        
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
            $validator = Validator::make($request->all(), [ 
                'username' => 'required',
                'name' => 'required',
                'password' => 'required',
                'gender' => 'required',
                'contact' => 'required',
                'birthdate' => 'required',   
                'address' => 'required',   
                'year_residency' => 'required',   
            ]);
    
            if($validator->fails()) {
                return response()->json([
                    'message' => $validator->messages()->all()
                ]);
            }
    
            else {
                try {
                    $add = User::create([
                        'username' => $request->username,
                        'name' => strtoupper($request->name),
                        'gender' => $request->gender,   
                        'password' => $request->password,   
                        'address' => $request->address,   
                        'contact' => $request->contact,   
                        'role' => 'USER',   
                        'access_level' => 5,   
                        'year_residency' => $request->year_residency,   
                        'birthdate' => $request->birthdate,  
                        'account_status' => 1,  
                        'updated_by' => $request->name,
                        'created_by' => $request->name,
                    ]);

                    OTP::where('id', $request->otp_code)->delete();
        
                    if($add) {
                        return response()->json([
                            'status' => 200,
                            'message' => 'Account submitted successfully!'
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
