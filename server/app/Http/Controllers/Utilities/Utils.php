<?php

namespace App\Http\Controllers\Utilities;

use Exception;
use App\Models\Client;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class Utils
{
    public function checkclient_validity($client) {
        $today = Carbon::today();

        $clients = Client::select('*', 
            DB::raw("TO_BASE64(client_logo) as client_logo"),
        )
        ->where('subscription_start', '<=', $today)
        ->where('subscription_end', '>=', $today)
        ->where('clientid', $client)
        ->first();

        if($clients) {
            return $clients;
        }
        return false;
    }

    public function checkRole($role) {
        if($role == 999) return "ADMIN";
        else if ($role == 30) return "REPRESENTATIVE";
        else if ($role == 10) return "REGISTRAR";
        else return "USER";
    }

    public function getAuthUser() {
        $authUser = User::select('username', 'role', 'access_level', 'clientid', 'contact',
            DB::raw("CONCAT(IFNULL(username, ''), ' - ', IFNULL(first_name, ''), ' ', IFNULL(middle_name, ''), ' ', IFNULL(last_name, '')) as fullname"),
            DB::raw("CONCAT(IFNULL(first_name, ''), ' ', IFNULL(middle_name, ''), ' ', IFNULL(last_name, '')) as name"))
            ->where('username', Auth::user()->username)
            ->first();

        return $authUser;
    }

    public function assignAdmin() {
        $authUser = $this->getAuthUser();
        $today = Carbon::today();
        
        // Get the registrar with the lowest number of tasks
        $registrar = User::select(
            'users.username',
            DB::raw("CONCAT(IFNULL(users.username, ''), ' - ', IFNULL(users.first_name, ''), ' ', IFNULL(users.middle_name, ''), ' ', IFNULL(users.last_name, '')) as fullname"),
            DB::raw("CONCAT(IFNULL(users.first_name, ''), ' ', IFNULL(users.middle_name, ''), ' ', IFNULL(users.last_name, '')) as name"),
            DB::raw("(SELECT COUNT(*) FROM requests 
                     WHERE requests.task_owner = users.username 
                       AND requests.status > 0 
                       AND requests.status < 4 
                       AND DATE(requests.created_at) = CURDATE()
                     ) AS request_count")
        )
        ->where('users.role', 'REGISTRAR')
        ->where('users.access_level', 10)
        ->where('users.account_status', 1)
        ->where('users.clientid', $authUser->clientid)
        ->orderBy('request_count', 'asc') // Sort by the lowest request count
        ->first();
        
        return $registrar;
    }
    

    public function checkPassword($password) {
        $pattern = '/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d\s]).{8,}$/';
        if (!preg_match($pattern, $password)) {
            return response()->json([
                'message' => 'Password must contain capital and small letter, number, and special character!'
            ]);    
        }
        return null;
    }

    public function getStatus(int $status) {
        if($status == 0) return "PENDING";
        else if ($status == 1) return "ON QUEUE";
        else if ($status == 2) return "PROCESSING";
        else if ($status == 3) return "FOR RELEASE";
        else if ($status == 4) return "COMPLETED";
        else if ($status == 5) return "REJECTED";
        else if ($status == 6) return "CANCELLED";
        else if ($status == 7) return "ON HOLD";
        else return "PENDING";
    }

    
}
