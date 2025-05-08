<?php

namespace App\Http\Controllers\Api;

use Exception;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Controller;
use App\Http\Controllers\Utilities\Utils;
use App\Models\App_Info;
use App\Models\LogRepresentative;
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
    public function uploadexcel(Request $request)
    {
        $authUser = new Utils;
        $authUser = $authUser->getAuthUser();

        if($authUser->role !== "REPRESENTATIVE" || $authUser->access_level != 30) {
            return response()->json([
                'message' => 'You are not allowed to perform this action!'
            ]);
        }


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
                        $first_name = isset($cells[1]) ? $cells[1]->getValue() : '';
                        $middle_name = isset($cells[2]) ? $cells[2]->getValue() : '';
                        $last_name = isset($cells[3]) ? $cells[3]->getValue() : '';
                        // $birthdate = isset($cells[4]) ? $cells[4]->getValue() : '';
                        $birthdateRaw = isset($cells[4]) ? $cells[4]->getValue() : '';
                        $birthdate = $birthdateRaw instanceof \DateTime
                            ? $birthdateRaw->format('Y-m-d') // convert to string
                            : (is_string($birthdateRaw) ? $birthdateRaw : '');
                        $contact = isset($cells[5]) ? $cells[5]->getValue() : '';
                        $email = isset($cells[6]) ? $cells[6]->getValue() : '';
                        $gender = isset($cells[7]) ? $cells[7]->getValue() : '';
                        $address = isset($cells[8]) ? $cells[8]->getValue() : '';
                        $grade = isset($cells[9]) ? $cells[9]->getValue() : '';
                        $section = isset($cells[10]) ? $cells[10]->getValue() : null;
                        $program = isset($cells[11]) ? $cells[11]->getValue() : null;

                        if (!$username) {
                            throw new \Exception("Row $rowNumber: Make sure that LRN is not empty");
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

                        if(!$contact) {
                            throw new \Exception("Row $rowNumber: Please provide contact for LRN $username");
                        }
                        if(!$email) {
                            throw new \Exception("Row $rowNumber: Please provide email for LRN $username");
                        }
                        
                        $checkEmail = User::select('email')
                            ->where('username', '!=', $username)
                            ->where('email', $email)
                            ->first();

                        if($checkEmail) {
                            throw new \Exception("Row $rowNumber: Email account already taken");
                        }
                        
                        $hashedPassword = Hash::make($contact);

                        UserUpload::updateOrCreate(
                            ['username' => $username],
                            [
                                'clientid' => strtoupper($authUser->clientid),
                                'role' => 'USER',
                                'access_level' => 5,
                                'first_name' => strtoupper($first_name),
                                'middle_name' => strtoupper($middle_name),
                                'last_name' => strtoupper($last_name),
                                'birthdate' => $birthdate,
                                'contact' => $contact,
                                'email' => $email,
                                'gender' => strtoupper($gender),
                                'address' => strtoupper($address),
                                'grade' => $grade,
                                'section' => strtoupper($section),
                                'program' => strtoupper($program),
                                'year_enrolled' => date('Y'),
                                'password' => $hashedPassword,
                                'account_status' => 1,
                                'new_account' => 0,
                                'password_change' => 0,
                                'deleted_at' => null,
                                'created_by' => "Uploaded by " . $authUser->fullname,
                                'updated_by' => "Uploaded by " . $authUser->fullname,
                            ]
                        );
                    }
                }
            }
            
            LogRepresentative::create([
                'clientid' => $authUser->clientid,
                'module' => 'Student Accounts',
                'action' => 'UPLOAD',
                'details' => $authUser->fullname .' uploaded a student list',
                'created_by' => $authUser->fullname,
            ]);

            DB::commit(); // Commit transaction if all rows pass validation
            $reader->close();

            sleep(1);
            
            // Try deleting with Storage, and if it fails, use unlink
            try {
                Storage::delete($path) || unlink($fullPath);
            } catch (\Exception $e) {
                return response()->json(['status' => 500, 'message' => 'Failed to delete uploaded file: ' . $e->getMessage()]);
            }

            return response()->json(['status' => 200, 'message' => 'Student data uploaded successfully!']);

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

    public function downloadstudenttemplate(Request $request) {
        $application = App_Info::select('student_template')->first();
    
        if (!$application || !$application->student_template) {
            return response()->json(['message' => 'File not found!'], 404);
        }
    
        // Determine the MIME type of the file data
        $finfo = new \finfo(FILEINFO_MIME_TYPE);
        $mimeType = $finfo->buffer($application->student_template) ?: 'octet-stream';

        return response()->stream(function () use ($application) {
            echo $application->student_template;
        }, 200, [
            'Content-Type' => $mimeType,
        ]);
    }

}
