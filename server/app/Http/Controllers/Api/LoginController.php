<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\AESCipher;
use App\Models\App_Info;
use App\Models\Client;
use Carbon\Carbon;
use Illuminate\Support\Facades\Cookie;
use Illuminate\Support\Facades\DB;

class LoginController extends Controller {

    protected $aes;
    public function __construct() {
        $this->aes = new AESCipher;

    }
    public function login(Request $request)  {
        $rules = [
            'username' => 'required|string',
            'password' => 'required|string',
        ];
        $credentials = $request->validate($rules);

        if (!Auth::attempt($credentials)) {
            return response()->json([
                'message' => "Invalid account credentials!"
            ]);
        }   

        $verifyUser = User::select('username', 'access_level', 'role')
            ->where('username', $request->username)
            ->where('account_status', 1)
            ->first();

        if ($verifyUser) {
            User::where('username', $verifyUser->username)->update(['last_online' => Carbon::now()]);
            /** @var \App\Models\User $user */
            $user = Auth::user();
            $expirationTime = now()->addMinutes(60);
            $token = $user->createToken($user->username, ['expires_at' => $expirationTime])->plainTextToken;
            $cookie = cookie('jwt', $token, 60);
            
            return response()->json([
                'status' => 200,
                'user' => $user->username,
                'role' => $user->role,
                'access' => $user->access_level,
                'access_token' => $token,
                'clientid' => $request->clientid,
                'message' => "Login Success!"
            ])->withCookie($cookie);

        } else {
            return response()->json([
                'message' => 'Account is no longer active!'  
            ]);
        }
    }

    public function user(Request $request) {
        $authUser = Auth::user();

        $userInfo = User::select('*', 
            DB::raw("TO_BASE64(id_picture) as id_picture"),
            DB::raw("DATE_FORMAT(last_online, '%M %d, %Y') as last_online")
        )
        ->where('username', $authUser->username)
        ->first();

        $sysem_detail = App_Info::select('system_info',
            DB::raw("TO_BASE64(org_structure) as org_structure"),
            DB::raw("TO_BASE64(logo) as logo"),
            )
        ->first();

        if($userInfo) {
            return response()->json([
                'authorizedUser' => $userInfo,
                'sysem_detail' => $sysem_detail,                
                'message' => "Access Granted!",
            ]);
        }
        else {
            return response()->json([
                'message' => "Access Denied!"
            ]);
        }
    }

    public function logout() {
        $cookie = Cookie::forget('jwt');
        return response()->json([
            'message' => "Session End!"
        ])->withCookie($cookie);
    }
    
    public function clientselect() {
        $today = Carbon::today();

        $clients = Client::select('*', 
            DB::raw("TO_BASE64(client_logo) as client_logo"),
        )
        ->where('subscription_start', '<=', $today)
        ->where('subscription_end', '>=', $today)
        ->get();

        if($clients) {
            return response()->json([
                'clients' => $clients,         
                'message' => "Clients Found!",
            ]);
        }
        else {
            return response()->json([
                'clients' => $clients,         
                'message' => "No Clients Found!",
            ]);
        }
    }


}
