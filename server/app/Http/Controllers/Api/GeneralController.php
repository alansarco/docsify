<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\App_Info;
use App\Http\Controllers\AESCipher;
use Exception;
use Illuminate\Support\Facades\DB;

class GeneralController extends Controller {

    protected $aes;
    public function __construct() {
        $this->aes = new AESCipher;
    }

    public function app_info() {
        try {
            $app_info = App_info::select('*',
                DB::raw("TO_BASE64(org_structure) as org_structure"),
                DB::raw("TO_BASE64(logo) as logo"),
                DB::raw("TO_BASE64(student_template) as student_template"),
                )
                ->first();

            if($app_info) {
                return response()->json([
                    'app_info' => $app_info,
                    'status' => 1,
                    'message' => "System is now up and ready!"
                ]);
            }
            return response()->json([
                'message' => "App no longer registered!",
                'status' => 0,
            ]);
        }
        catch (Exception $e) {
            return response()->json([
                'status' => 404,
                'message' => $e->getMessage()
            ], 404);
        }
    }
}
