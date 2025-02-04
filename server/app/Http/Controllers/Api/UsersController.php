<?php

namespace App\Http\Controllers\Api;

use Exception;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Utilities\Utils;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use App\Models\UserUpload;
use Illuminate\Pagination\LengthAwarePaginator;
use Box\Spout\Reader\Common\Creator\ReaderEntityFactory;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Hash;

class UsersController extends Controller
{
    // displays all list of users
    public function index(Request $request) {
        $filter = $request->filter ?? '';

        $users = DB::select('CALL GET_STUDENT_USERS(?)', [$filter]);

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
                'message' => 'Users retrieved!',
                'users' => $paginatedUsers
            ], 200);
        } else {
            return response()->json([
                'message' => 'No users found!',
                'users' => $paginatedUsers
            ]);
        }
    }

    // retrieve specific user's information
    public function retrieve(Request $request) {
        $account = User::where('username', $request->username)->first();
        $haveAccount = false;
        if($account) {
            $haveAccount = true;
        }

        $user = User::select('*',
            DB::raw("TO_BASE64(id_picture) as id_picture"),
            DB::raw("CONCAT(DATE_FORMAT(birthdate, '%M %d, %Y')) as birthday"),
            DB::raw("CONCAT(DATE_FORMAT(created_at, '%M %d, %Y %h:%i %p')) as date_added"),
            DB::raw("CONCAT(DATE_FORMAT(last_online, '%M %d, %Y %h:%i %p')) as last_online"),
            DB::raw("CONCAT(DATE_FORMAT(created_at, '%M %d, %Y %h:%i %p')) as created_date"),
            DB::raw("CONCAT(DATE_FORMAT(updated_at, '%M %d, %Y %h:%i %p')) as updated_date"),
        )
        ->where('username', $request->username)->first();

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

    // update specific user's information
    public function update(Request $request) {
        $authUser = User::select('name')->where('username', Auth::user()->username)->first();

        $validator = Validator::make($request->all(), [
            'username' => 'required',
            'name' => 'required',
            'middle_name' => 'required',
            'last_name' => 'required',
            'gender' => 'required',
            'account_status' => 'required',
            'address' => 'required',
            'contact' => 'required',
            'access_level' => 'required',
            'year_enrolled' => 'required',
            'birthdate' => 'required',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }
        else {
            $user = User::where('username', $request->username)->first();
            $role = 'USER';
            if($request->access_level == 999) {
                $role = 'ADMIN';
            }

            if($user) {
                try {
                    $update = User::where('username', $request->username)
                    ->update([
                        'name' => strtoupper($request->name),
                        'middle_name' => strtoupper($request->middle_name),
                        'last_name' => strtoupper($request->last_name),
                        'gender' => $request->gender,   
                        'address' => $request->address,   
                        'contact' => $request->contact,   
                        'role' => strtoupper($role),   
                        'access_level' => $request->access_level,   
                        'account_status' => $request->account_status,   
                        'year_enrolled' => $request->year_enrolled,   
                        'birthdate' => $request->birthdate,  
                        'updated_by' => $authUser->name,
                    ]);

                    if($update) {
                        return response()->json([
                            'status' => 200,
                            'message' => 'Resident updated successfully!'
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
                    'message' => 'Resident not found!'
                ]);
            }
        }
    }

    // Delete / deactivate user
    public function delete(Request $request) {
        $authUser = Auth::user();
        if($authUser->role !== "ADMIN" || $authUser->access_level < 10) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }
        
        $delete = User::where('username', $request->username)->delete();

        if($delete) {
            return response()->json([
                'status' => 200,
                'message' => 'Resident deleted successfully!'
            ], 200);
        }
        else {
            return response()->json([
                'message' => 'Resident not found!'
            ]);
        }
    }

    public function store(Request $request) {
        $authUser = User::select('name')->where('username', Auth::user()->username)->first();

        if(Auth::user()->role !== "ADMIN" || Auth::user()->role < 10) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }

        $validator = Validator::make($request->all(), [
            'username' => 'required',
            'name' => 'required',
            'middle_name' => 'required',
            'last_name' => 'required',
            'gender' => 'required',
            'contact' => 'required',
            'birthdate' => 'required',
            'address' => 'required',
            'year_enrolled' => 'required',
            'access_level' => 'required',
            'id_picture' => 'nullable|file|mimes:jpeg,png,jpg,gif|max:5120',
        ]);

        if($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }

        $residentExist = User::where('username', $request->username)->first();
        $role = 'USER';
        
        if($request->access_level == 999) {
            $role = 'ADMIN';
        }

        if(!$residentExist) {
            try {
                $pictureData = null; // Initialize the variable to hold the file path
                if ($request->hasFile('id_picture')) {
                    $file = $request->file('id_picture');
                    $pictureData = file_get_contents($file->getRealPath()); // Get the file content as a string
                }
                $add = User::create([
                    'username' => $request->username,
                    'name' => strtoupper($request->name),
                    'middle_name' => strtoupper($request->middle_name),
                    'last_name' => strtoupper($request->last_name),
                    'gender' => $request->gender,   
                    'address' => $request->address,   
                    'contact' => $request->contact,   
                    'role' => strtoupper($role),   
                    'id_picture' => $pictureData,   
                    'access_level' => $request->access_level,   
                    'year_enrolled' => $request->year_enrolled,   
                    'birthdate' => $request->birthdate,  
                    'account_status' => 1,  
                    'created_by' => $authUser->name,
                ]);

            if($add) {
                return response()->json([
                    'status' => 200,
                    'message' => 'Resident added successfully!'
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
                'message' => 'LRN already exist!'
            ]);
        }
    }

    public function uploadexcel(Request $request)
    {
        $authUser = User::select('name')->where('username',  Auth::user()->username)->first();

        $validator = Validator::make($request->all(), [
            'data' => 'required|file|mimes:xlsx,xls|max:20000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => $validator->messages()->all()
            ]);
        }

        $path = $request->file('data')->store('uploads');
        $fullPath = storage_path('app/' . $path);
        $reader = ReaderEntityFactory::createReaderFromFile(storage_path('app/' . $path));
        $reader->open(storage_path('app/' . $path));

        DB::beginTransaction(); // Begin a transaction
        $firstRow = true;

        try {
            foreach ($reader->getSheetIterator() as $sheet) {
                $rowNumber = 1;
                foreach ($sheet->getRowIterator() as $row) {
                    if ($firstRow) {
                        $firstRow = false; // Skip the first row (header)
                        continue;
                    }
                    $rowNumber++; // Increment row number for each data row

                    $cells = $row->getCells();
                                    
                    if (!empty($cells[0])) {
                        $username = isset($cells[0]) ? $cells[0]->getValue() : null;
                        $name = isset($cells[1]) ? $cells[1]->getValue() : '';
                        $access_level = isset($cells[2]) ? $cells[2]->getValue() : 5;
                        $contact = isset($cells[3]) ? $cells[3]->getValue() : '';
                        $gender = isset($cells[4]) ? $cells[4]->getValue() : '';
                        $birthdate = isset($cells[5]) ? $cells[5]->getValue() : null;
                        $address = isset($cells[6]) ? $cells[6]->getValue() : '';
                        $year_enrolled = isset($cells[7]) ? $cells[7]->getValue() : null;

                        // Validation
                        $role = 'USER';
                        if ($access_level == 999) {
                            $role = 'ADMIN';
                        }
                        if (!$year_enrolled) {
                            $year_enrolled = date('Y');
                        }

                        if (!is_numeric($contact)) {
                            throw new \Exception("Row $rowNumber: Invalid contact for LRN $username - $contact");
                        }
                        if (!in_array($gender, ['M', 'F'])) {
                            throw new \Exception("Row $rowNumber: Invalid gender for LRN $username - $gender");
                        }
                        if (!preg_match('/\d{4}-\d{2}-\d{2}/', $birthdate)) {
                            throw new \Exception("Row $rowNumber: Invalid birthdate format for LRN $username - $birthdate");
                        }
                        if (!preg_match('/^\d{4}$/', $year_enrolled)) {
                            throw new \Exception("Row $rowNumber: Invalid year year_enrolled for LRN $username - $year_enrolled");
                        }

                        UserUpload::updateOrCreate(
                            ['username' => $username],
                            [
                                'name' => strtoupper($name),
                                'role' => $role,
                                'access_level' => $access_level,
                                'birthdate' => $birthdate,
                                'contact' => $contact,
                                'email' => $username,
                                'gender' => strtoupper($gender),
                                'address' => strtoupper($address),
                                'year_enrolled' => $year_enrolled,
                                'account_status' => 1,
                                'deleted_at' => null,
                                'created_by' => "Uploaded by " . $authUser->name,
                                'updated_by' => "Uploaded by " . $authUser->name,
                            ]
                        );
                    }
                }
            }

            DB::commit(); // Commit transaction if all rows pass validation
            $reader->close();

            sleep(1);
            
            // Try deleting with Storage, and if it fails, use unlink
            try {
                Storage::delete($path) || unlink($fullPath);
            } catch (\Exception $e) {
                return response()->json(['status' => 500, 'message' => 'Failed to delete uploaded file: ' . $e->getMessage()]);
            }

            return response()->json(['status' => 200, 'message' => 'Residents data uploaded successfully!']);

        } catch (\Exception $e) {
            DB::rollBack(); // Rollback transaction if any error occurs
            $reader->close();

            // Delay to ensure file handlers are released
            sleep(1);

            // Try deleting with Storage, and if it fails, use unlink
            try {
                Storage::delete($path) || unlink($fullPath);
            } catch (\Exception $e) {
                return response()->json(['status' => 500, 'message' => 'Failed to delete uploaded file: ' . $e->getMessage()]);
            }

            return response()->json(['status' => 500, 'message' => 'Failed to upload data due to error in row ' . $rowNumber . ': ' . $e->getMessage()]);
        }
    }

    // Change your password
    public function personalchangepass(Request $request) {
        $authUser = Auth::user();

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
                    $update = User::where('username', $authUser->username)->update([ 'password' => $hashedPassword]);
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
