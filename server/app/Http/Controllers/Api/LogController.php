<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Pagination\LengthAwarePaginator;

class LogController extends Controller
{
    // Get all the list of campuses
    public function adminlogs(Request $request) {
        $filter = $request->filter ?? '';
        $filterModule = $request->filter_module ?? '';
        $filterAction = $request->filter_action ?? '';
        $endsAt = $request->created_end ?? '';
        $startsAt = $request->created_start ?? '';

        // Call the stored procedure
        $campus = DB::select('CALL GET_LOGS_ADMIN(?, ?, ?, ?, ?)', [$filter, $filterModule, $filterAction, $endsAt, $startsAt]);

        // Convert the results into a collection
        $campusCollection = collect($campus);

        // Set pagination variables
        $perPage = 50; // Number of items per page
        $currentPage = LengthAwarePaginator::resolveCurrentPage(); // Get the current page

        // Slice the collection to get the items for the current page
        $currentPageItems = $campusCollection->slice(($currentPage - 1) * $perPage, $perPage)->values();

        // Create a LengthAwarePaginator instance
        $paginatedCampuses = new LengthAwarePaginator($currentPageItems, $campusCollection->count(), $perPage, $currentPage, [
            'path' => $request->url(), // Set the base URL for pagination links
            'query' => $request->query(), // Preserve query parameters in pagination links
        ]);

        // Return the response
        if ($paginatedCampuses->count() > 0) {
            return response()->json([
                'status' => 200,
                'campuses' => $paginatedCampuses,
                'message' => 'Campuses retrieved!',
            ], 200);
        } else {
            return response()->json([
                'message' => 'No Campuses found!',
                'campuses' => $paginatedCampuses
            ]);
        }
}
}
