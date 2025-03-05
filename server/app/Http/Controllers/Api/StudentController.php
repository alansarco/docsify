<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Models\User;
use Exception;
use Illuminate\Support\Facades\Hash;
use Illuminate\Pagination\LengthAwarePaginator;
use App\Http\Controllers\Utilities\Utils;
use App\Mail\AccoutApproveEmail;
use App\Models\App_Info;
use App\Models\LogRepresentative;
use App\Models\StudentProgram;
use App\Models\StudentSection;
use Illuminate\Support\Facades\Mail;

class StudentController extends Controller
{
    // Get all the list of Student
    public function index(Request $request) {
        $clientidFilter = $request->clientid ?? '';
        $sectionFilter = $request->sections ?? '';
        $programFilter = $request->programs ?? '';
        $gradeFilter = $request->grade ?? '';
        $enrolledFilter = $request->year_enrolled ?? '';
        $filter = $request->filter ?? '';
        $genderFilter = $request->gender ?? '';
        $accountStatus = $request->account_status ?? '';

        // Call the stored procedure
        $users = DB::select('CALL GET_USERS_STUDENT(?, ?, ?, ?, ?, ?, ?, ?)', [$clientidFilter, $sectionFilter, $programFilter, $gradeFilter, $enrolledFilter, $filter, $genderFilter, $accountStatus]);

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
                'message' => 'Students retrieved!',
            ], 200);
        } else {
            return response()->json([
                'message' => 'No Student Accounts found!',
                'users' => $paginatedUsers
            ]);
        }
    }

    public function addstudent(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "REPRESENTATIVE" || $authUser->access_level != 30) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $validator = Validator::make($request->all(), [
            'clientid' => 'required',
            'email' => 'required|email',
            'grade' => 'required',
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

        $validity = new Utils;
        $valid_client = $validity->checkclient_validity($request->clientid);
        if(!$valid_client) {
            return response()->json([
                'message' => 'Campus license has already expired or the subscription has not yet started!'
            ]);
        }

        $acountExist = DB::table('users')->where('username', $request->username)->first();
        $emailExist = DB::table('users')->where('email', $request->email)->first();
        $defaultPassword = Hash::make($request->contact);

        if(!$acountExist && !$emailExist) {
            try {
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
                    'grade' => $request->grade,   
                    'section' => $request->section,   
                    'program' => $request->program,   
                    'email' => $request->email,   
                    'address' => $request->address,   
                    'contact' => $request->contact,   
                    'role' => 'USER',   
                    'id_picture' => $pictureData,   
                    'access_level' => 5,   
                    'birthdate' => $request->birthdate,  
                    'year_enrolled' => date('Y'),  
                    'account_status' => 1,  
                    'created_by' => $authUser->fullname,
                    'updated_by' => $authUser->fullname,
                ]);

            $data = $request->username;
            $otpSent = false;
            $adminInfo = App_Info::first();
            if($adminInfo->notify_user_approve == 1) {
                $otpSent = Mail::to($request->email)->send(new AccoutApproveEmail($data));
            }

            if($add) {
                LogRepresentative::create([
                    'clientid' => $authUser->clientid,
                    'module' => 'Student Accounts',
                    'action' => 'ADD',
                    'details' => $authUser->fullname .' addded account '. $request->username,
                    'created_by' => $authUser->fullname,
                ]);
                if($otpSent) {
                    return response()->json([
                        'status' => 200,
                        'message' => 'Student added successfully and email notification is sent to user!'
                    ], 200);
                }
                return response()->json([
                    'status' => 200,
                    'message' => 'Student added successfully!'
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

    public function updatestudent(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "REPRESENTATIVE" || $authUser->access_level != 30) {
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
            'grade' => 'required',
            'year_enrolled' => 'required',
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
            $validity = new Utils;
            $valid_client = $validity->checkclient_validity($request->clientid);
            if(!$valid_client) {
                return response()->json([
                    'message' => 'Campus license has already expired or the subscription has not yet started!'
                ]);
            }

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
                        'clientid' => $request->clientid,
                        'username' => $request->username,
                        'first_name' => strtoupper($request->first_name),
                        'middle_name' => strtoupper($request->middle_name),
                        'last_name' => strtoupper($request->last_name),
                        'gender' => $request->gender,
                        'grade' => $request->grade,
                        'section' => $request->section,
                        'program' => $request->program,
                        'year_enrolled' => $request->year_enrolled,
                        'email' => $request->email,
                        'address' => $request->address,
                        'contact' => $request->contact,
                        'birthdate' => $request->birthdate,
                        'account_status' => $request->account_status,
                        'updated_by' => $authUser->fullname,
                    ];
                    
                    $pictureData = null;
                    // Check if id_picture is provided and add it to the update array
                    if ($request->hasFile('id_picture')) {
                        $file = $request->file('id_picture');
                        $pictureData = file_get_contents($file->getRealPath()); // Get the file content as a string
                        $updateData['id_picture'] = $pictureData;
                    }
                    $existingKeys = User::where('username', $request->username)->first();
                    $changes = [];

                    // Compare all fields except those related to pictures
                    foreach ($updateData as $key => $value) {
                        if ($key !== 'id_picture' && isset($existingKeys[$key]) && $existingKeys[$key] != $value) {
                            $changes[$key] = [
                                'old' => $existingKeys[$key],
                                'new' => $value
                            ];
                        }
                    }
                    $userInfo = User::where('username', $request->username)->first();
                    $data = $request->username;

                    if($userInfo->account_status != $request->account_status && $userInfo->account_status != 1 && $request->account_status == 1) {
                        Mail::to($request->email)->send(new AccoutApproveEmail($data));
                    }

                    $update = User::where('username', $request->username)->update($updateData);
                    if($request->account_status != 1) {
                        DB::table('personal_access_tokens')->where('tokenable_id', $user->id)->delete();
                    }
                    if($update) {
                        if (!empty($changes)) {
                            LogRepresentative::create([
                                'clientid' => $authUser->clientid,
                                'module' => 'Student Accounts',
                                'action' => 'UPDATE',
                                'details' => $authUser->fullname .' updated account '. $request->username .' with the following changes: ' . json_encode($changes),
                                'created_by' => $authUser->fullname,
                            ]);
                        }
                        else if($pictureData) {
                            LogRepresentative::create([
                                'clientid' => $authUser->clientid,
                                'module' => 'Student Accounts',
                                'action' => 'UPDATE',
                                'details' => $authUser->fullname . ' updated account '. $request->username .' with changes in Profile Picture',
                                'created_by' => $authUser->fullname,
                            ]);
                        }
                        return response()->json([
                            'status' => 200,
                            'message' => 'Student updated successfully!'
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
                    'message' => 'Student not found!'
                ]);
            }
        }
    }

    // Delete 
    public function deletestudent(Request $request) {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        if($authUser->role !== "REPRESENTATIVE" || $authUser->access_level != 30) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }
        
        $delete = User::where('username', $request->username)->delete();

        if($delete) {
            LogRepresentative::create([
                'clientid' => $authUser->clientid,
                'module' => 'Student Accounts',
                'action' => 'DELETE',
                'details' => $authUser->fullname .' deleted account '. $request->username,
                'created_by' => $authUser->fullname,
            ]);
            return response()->json([
                'status' => 200,
                'message' => 'Student deleted successfully!'
            ], 200);
        }
        else {
            return response()->json([
                'message' => 'Student not found!'
            ]);
        }
    }
    
    // retrieve specific user's information
    public function retrievestudent(Request $request) {
        $account = User::where('username', $request->username)->first();
        $haveAccount = false;
        if($account) {
            $haveAccount = true;
        }

        $user = User::leftJoin('clients', 'users.clientid', '=', 'clients.clientid')
        ->leftJoin('students_section', 'users.section', '=', 'students_section.section_id')
        ->leftJoin('students_program', 'users.program', '=', 'students_program.program_id')
        ->select('users.*',
            'clients.client_name',
            'clients.client_acr',
            'clients.clientid',
            'students_section.section_id',
            'students_section.section_name',
            'students_program.program_id',
            'students_program.program_name',
            'students_program.program_acr',
            DB::raw("TO_BASE64(users.id_picture) as id_picture"),
            DB::raw("TO_BASE64(users.requirement) as requirement"),
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
    
    public function sectionselect() {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();

        $sections = StudentSection::select('section_id', 'section_name', 'status')
            ->where('clientid', $authUser->clientid)
            ->get();

        if($sections) {
            return response()->json([
                'status' => 200,
                'sections' => $sections,
                'message' => 'Sections retrieved!',
            ]);
        }   
        else {
            return response()->json([
                'sections' => $sections,
                'message' => 'No sections  found!'
            ]);
        }
    }

    public function programselect() {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();
        
        $programs = StudentProgram::select('program_id', 'program_name', 'program_acr', 'status')
            ->where('clientid', $authUser->clientid)
            ->get();

        if($programs) {
            return response()->json([
                'status' => 200,
                'programs' => $programs,
                'message' => 'Sections retrieved!',
            ]);
        }   
        else {
            return response()->json([
                'programs' => $programs,
                'message' => 'No sections  found!'
            ]);
        }
    }
}
