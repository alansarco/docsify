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
        $authUser = User::select('username',
            DB::raw("CONCAT(IFNULL(first_name, ''), ' ', IFNULL(middle_name, ''), '', IFNULL(last_name, '')) as fullname"))
            ->where('username', Auth::user()->username)
            ->first();

        return $authUser;
    }
}
