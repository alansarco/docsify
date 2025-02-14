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

}
