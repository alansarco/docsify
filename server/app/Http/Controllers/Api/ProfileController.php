<?php

namespace App\Http\Controllers\Api;

use Exception;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Utilities\Utils;
use App\Models\Admin;
use Illuminate\Http\Request;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Pagination\Paginator;
use Illuminate\Support\Facades\DB;
use App\Models\UserUpload;
use Illuminate\Pagination\LengthAwarePaginator;
use Box\Spout\Reader\Common\Creator\ReaderEntityFactory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class ProfileController extends Controller
{
    // retrieve specific profile's information
    public function profileretrieve(Request $request) {
        $account = User::where('username', $request->username)->first();
        $haveAccount = false;
        if($account) {
            $haveAccount = true;
        }

        $user = User::leftJoin('clients', 'users.clientid', '=', 'clients.clientid')
        ->select('users.*',
            'clients.client_name',
            'clients.client_acr',
            'clients.clientid',
            DB::raw("TO_BASE64(users.id_picture) as id_picture"),
            DB::raw("TO_BASE64(clients.client_logo) as client_logo"),
            DB::raw("TO_BASE64(clients.client_banner) as client_banner"),
            DB::raw("CONCAT(DATE_FORMAT(users.birthdate, '%M %d, %Y')) as birthday"),
            DB::raw("CONCAT(DATE_FORMAT(users.last_online, '%M %d, %Y %h:%i %p')) as last_online"),
            DB::raw("CONCAT(DATE_FORMAT(users.created_at, '%M %d, %Y %h:%i %p')) as created_date"),
            DB::raw("CONCAT(DATE_FORMAT(users.updated_at, '%M %d, %Y %h:%i %p')) as updated_date"),
            DB::raw("CONCAT(TIMESTAMPDIFF(YEAR, users.birthdate, CURDATE())) AS age")
        )
        ->where('users.username', $request->username)->first();

        if($user) {
            return response()->json([
                'status' => 200,
                'user' => $user,
                'haveAccount' => $haveAccount,
                'message' => "Data retrieved!"
            ], 200);
        }
        else {
            return response()->json([
                'user' => $user,
                'message' => "Data not found!"
            ]);
        }
    }

    // update specific profile's information
    public function updateprofile(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'contact' => 'required|string|regex:/^\+?[0-9]{10,15}$/',
            'address' => 'required',   
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }
        else {
            $emailExist = DB::table('users')->where('email', $request->email)->whereNot('username', $request->username)->first();
            if($emailExist) {
                return response()->json([
                    'message' => 'Email already exist!'
                ]);        
            }

            $user = User::where('username', $request->username)->first();

            if($user) {
                try {
                    $updateData = [
                        'username' => $request->username,
                        'email' => $request->email,
                        'address' => $request->address,
                        'contact' => $request->contact,
                        'updated_by' => $authUser->fullname,
                    ];
                    $pictureData = null;
                    // Check if id_picture is provided and add it to the update array
                    if ($request->hasFile('id_picture')) {
                        $file = $request->file('id_picture');
                        $pictureData = file_get_contents($file->getRealPath()); // Get the file content as a string
                        $updateData['id_picture'] = $pictureData;
                    }

                    $update = User::where('username', $request->username)->update($updateData);

                    if($update) {
                        return response()->json([
                            'status' => 200,
                            'message' => 'Account updated successfully!'
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
                    'message' => 'Admin not found!'
                ]);
            }
        }
    }

    // Change your password
    public function personalchangepass(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();

        $checkpass = new Utils;
        $checkpass = $checkpass->checkPassword($request->newpass);
        if($checkpass) return $checkpass;

        $validator = Validator::make($request->all(), [
            'newpass' => 'required',
            'confirmpass' => 'required',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }
        
        else {
            $user = User::where('username', $authUser->username)->first();
            if($user) {
                try {
                    if($request->newpass !== $request->confirmpass) {
                        return response()->json([
                            'message' => 'Password did not match!'
                        ]);        
                    }
                    if($request->password === $request->confirmpass) {
                        return response()->json([
                            'message' => 'Old and new password is the same!'
                        ]);
                    }
                    $hashedPassword = Hash::make($request->newpass);
                    $update = User::where('username', $authUser->username)
                    ->update([ 
                        'password' => $hashedPassword,
                        'updated_by' => $authUser->fullname,
                    ]);
                    if($update) {   
                        return response()->json([
                            'status' => 200,
                            'message' => 'Password changed!'
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
            } else {
                return response()->json([
                    'message' => 'Something went wrong!'
                ]);
            }

        }
    }
}
