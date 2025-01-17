<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Http\Controllers\Utilities\Utils;
use App\Models\AdminLog;
use App\Models\Client;

class RepresentativeController extends Controller
{
    // Get all the list of representatives
    public function index(Request $request) {
        $filter = $request->filter ?? '';
        $genderFilter = $request->gender ?? '';
        $accountStatus = $request->account_status ?? '';

        // Call the stored procedure
        $users = DB::select('CALL GET_USERS_REPRESENTATIVE(?, ?, ?)', [$filter, $genderFilter, $accountStatus]);

        // Convert the results into a collection
        $usersCollection = collect($users);

        // Set pagination variables
        $perPage = 50; // Number of items per page
        $currentPage = LengthAwarePaginator::resolveCurrentPage(); // Get the current page

        // Slice the collection to get the items for the current page
        $currentPageItems = $usersCollection->slice(($currentPage - 1) * $perPage, $perPage)->values();

        // Create a LengthAwarePaginator instance
        $paginatedUsers = new LengthAwarePaginator($currentPageItems, $usersCollection->count(), $perPage, $currentPage, [
            'path' => $request->url(), // Set the base URL for pagination links
            'query' => $request->query(), // Preserve query parameters in pagination links
        ]);

        // Return the response
        if ($paginatedUsers->count() > 0) {
            return response()->json([
                'status' => 200,
                'users' => $paginatedUsers,
                'message' => 'School Representatives retrieved!',
            ], 200);
        } else {
            return response()->json([
                'message' => 'No School Representatives Accounts found!',
                'users' => $paginatedUsers
            ]);
        }
    }

    public function addrepresentative(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "ADMIN" || $authUser->access_level < 999) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $validator = Validator::make($request->all(), [
            'clientid' => 'required',
            'email' => 'required|email',
            'username' => 'required',
            'first_name' => 'required',
            'last_name' => 'required',
            'gender' => 'required',
            'contact' => 'required|string|regex:/^\+?[0-9]{10,15}$/',
            'birthdate' => 'required',   
            'address' => 'required',   
            'id_picture' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }

        $acountExist = DB::table('users')->where('username', $request->username)->first();
        $emailExist = DB::table('users')->where('email', $request->email)->first();
        $defaultPassword = Hash::make($request->contact);

        if(!$acountExist && !$emailExist) {
            try {
                Client::where('clientid', $request->clientid)
                ->where(function ($query) {
                    $query->whereNull('client_representative') 
                        ->orWhere('client_representative', '');
                })
                ->update([
                    'client_representative' => $request->username,
                    'updated_by' => $authUser->fullname,
                ]);

                $pictureData = null; // Initialize the variable to hold the file path
                if ($request->hasFile('id_picture')) {
                    $file = $request->file('id_picture');
                    $pictureData = file_get_contents($file->getRealPath()); // Get the file content as a string
                }
                $add = User::create([
                    'clientid' => $request->clientid,
                    'username' => $request->username,
                    'first_name' => strtoupper($request->first_name),
                    'middle_name' => strtoupper($request->middle_name),
                    'last_name' => strtoupper($request->last_name),
                    'password' => $defaultPassword,   
                    'gender' => $request->gender,   
                    'email' => $request->email,   
                    'address' => $request->address,   
                    'contact' => $request->contact,   
                    'role' => 'REPRESENTATIVE',   
                    'id_picture' => $pictureData,   
                    'access_level' => 30,   
                    'birthdate' => $request->birthdate,  
                    'account_status' => 1,  
                    'created_by' => $authUser->fullname,
                    'updated_by' => $authUser->fullname,
                ]);

            if($add) {
                AdminLog::create([
                    'module' => 'Representative Accounts',
                    'action' => 'DELETE',
                    'details' => $authUser->fullname .' addded account '. $request->username,
                    'created_by' => $authUser->fullname,
                ]);
                return response()->json([
                    'status' => 200,
                    'message' => 'School admin/representative added successfully!'
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
        else {
            return response()->json([
                'message' => 'Username already exist!'
            ]);
        }
    }

    public function updaterepresentative(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "ADMIN" || $authUser->access_level < 999) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $validator = Validator::make($request->all(), [
            'email' => 'required|email',
            'username' => 'required',
            'clientid' => 'required',
            'first_name' => 'required',
            'last_name' => 'required',
            'gender' => 'required',
            'contact' => 'required|string|regex:/^\+?[0-9]{10,15}$/',
            'birthdate' => 'required',   
            'address' => 'required',   
            'account_status' => 'required',
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
                    $updated = Client::where('clientid', $request->clientid)
                    ->where(function ($query) {
                        $query->whereNull('client_representative') 
                            ->orWhere('client_representative', '');
                    })
                    ->update([
                        'client_representative' => $request->username,
                        'updated_by' => $authUser->fullname,
                    ]);
                    if ($updated) {
                        Client::where('clientid', '!=',$request->clientid)
                        ->where('client_representative', $request->username)
                        ->update([
                            'client_representative' => null,
                            'updated_by' => $authUser->fullname,
                        ]);
                    }

                    $updateData = [
                        'clientid' => $request->clientid,
                        'username' => $request->username,
                        'first_name' => strtoupper($request->first_name),
                        'middle_name' => strtoupper($request->middle_name),
                        'last_name' => strtoupper($request->last_name),
                        'gender' => $request->gender,
                        'email' => $request->email,
                        'address' => $request->address,
                        'contact' => $request->contact,
                        'birthdate' => $request->birthdate,
                        'account_status' => $request->account_status,
                        'updated_by' => $authUser->fullname,
                    ];
                    
                    // Check if id_picture is provided and add it to the update array
                    if ($request->hasFile('id_picture')) {
                        $file = $request->file('id_picture');
                        $pictureData = file_get_contents($file->getRealPath()); // Get the file content as a string
                        $updateData['id_picture'] = $pictureData;
                    }
                    $update = User::where('username', $request->username)->update($updateData);
                    
                    if($update) {
                        AdminLog::create([
                            'module' => 'Representative Accounts',
                            'action' => 'DELETE',
                            'details' => $authUser->fullname .' updated account '. $request->username,
                            'created_by' => $authUser->fullname,
                        ]);
                        return response()->json([
                            'status' => 200,
                            'message' => 'School admin/representative updated successfully!'
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
                    'message' => 'School admin/representative not found!'
                ]);
            }
        }
    }

    // Delete 
    public function deleterepresentative(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "ADMIN" || $authUser->access_level < 999) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }
        
        $delete = User::where('username', $request->username)->delete();

        if($delete) {
            AdminLog::create([
                'module' => 'Representative Accounts',
                'action' => 'DELETE',
                'details' => $authUser->fullname .' deleted account '. $request->username,
                'created_by' => $authUser->fullname,
            ]);
            return response()->json([
                'status' => 200,
                'message' => 'School admin/representative deleted successfully!'
            ], 200);
        }
        else {
            return response()->json([
                'message' => 'School admin/representative not found!'
            ]);
        }
    }
    
    // retrieve specific user's information
    public function retrieverepresentative(Request $request) {
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

    public function clientselectrep() {
        $today = Carbon::today();

        $clients = Client::leftJoin('users', 'users.username', '=', 'clients.client_representative')
        ->select('clients.*', 
            DB::raw("TO_BASE64(clients.client_logo) as client_logo"),
            DB::raw("TO_BASE64(clients.client_banner) as client_banner")
        )
        ->where('clients.subscription_end', '>=', $today)
        ->where(function($query) {
            $query->whereNull('users.clientid')
                ->orWhere(function($query) {
                    $query->where('users.account_status', '!=', 1)
                        ->orWhere('users.role', '!=', 'REPRESENTATIVE');
                });
        })
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

    public function clientselectrepupdate(Request $request) {
        $today = Carbon::today();

        $clients = Client::leftJoin('users', 'users.username', '=', 'clients.client_representative')
        ->select('clients.*', 
            DB::raw("TO_BASE64(clients.client_logo) as client_logo"),
            DB::raw("TO_BASE64(clients.client_banner) as client_banner")
        )
        ->where('clients.subscription_start', '<=', $today)
        ->where('clients.subscription_end', '>=', $today)
        ->where(function ($query) use ($request)  {
            $query->whereNull('clients.client_representative')
            ->orWhere('clients.client_representative', '=', '')
            ->orWhere('clients.clientid', $request->client);
        })
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
