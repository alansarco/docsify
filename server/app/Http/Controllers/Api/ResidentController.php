<?php

namespace App\Http\Controllers\Api;

use Exception;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Facades\DB;

class ResidentController extends Controller
{
    public function index(Request $request) {
        $filter = $request->filter ?? '';
        $genderFilter = $request->gender ?? '';
        $accountStatus = $request->account_status ?? '';
        $yearResideny = $request->year_residency ?? '';

        // Call the stored procedure
        $users = DB::select('CALL GET_RESIDENTS(?, ?, ?, ?)', [$filter, $genderFilter, $accountStatus, $yearResideny]);

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

}
