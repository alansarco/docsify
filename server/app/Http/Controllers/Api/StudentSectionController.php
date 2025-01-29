<?php

namespace App\Http\Controllers\Api;

use Exception;
use App\Http\Controllers\Controller;
use App\Models\LicenseKey;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use App\Http\Controllers\Utilities\Utils;
use App\Models\LogAdmin;
use App\Models\Client;
use App\Models\StudentSection;
use Illuminate\Support\Str;

class StudentSectionController extends Controller
{
    public function index(Request $request) {
        $query = StudentSection::leftJoin('clients', 'license_keys.license_client', 'clients.clientid')
            ->select('license_keys.*', 'clients.client_acr', 'clients.client_name',
                DB::raw("DATE_FORMAT(license_keys.license_date_use, '%M %d, %Y') AS license_date_use"),
                DB::raw("DATE_FORMAT(license_keys.created_at, '%M %d, %Y %h:%i %p') AS date_added"));

        if($request->filter) {
            $query->where('license_keys.license_key', 'LIKE' , '%'.$request->filter.'%')
                ->orWhere('license_keys.license_duration', 'LIKE' , '%'.$request->filter.'%')
                ->orWhere('clients.client_name', 'LIKE' , '%'.$request->filter.'%')
                ->orWhere('clients.client_acr', 'LIKE' , '%'.$request->filter.'%');
        }
        if($request->filter_price) {
            $query->where('license_keys.license_price', '>=', $request->filter_price);
        }
        
        $sections = $query->orderBy('license_date_use')->orderBy('created_at', 'DESC')->paginate(50);

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
}
