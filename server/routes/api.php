<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\UsersController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DocRequestController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\GeneralController;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\ForgotPasswordController;
use App\Http\Controllers\Api\SignupController;
use App\Http\Controllers\Api\ResidentController;
use App\Http\Controllers\Api\OfficialController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\SettingsController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/
Route::post('login', [LoginController::class, 'login']);
Route::get('clientselect', [LoginController::class, 'clientselect']);
Route::get('app_info', [GeneralController::class, 'app_info']);
Route::post('createotpverification', [SignupController::class, 'createotpverification']);
Route::get('signupsuffix', [SignupController::class, 'signupsuffix']);
Route::post('signupuser', [SignupController::class, 'signupuser']);
Route::post('createotp', [ForgotPasswordController::class, 'createotp']);
Route::post('validateotp', [ForgotPasswordController::class, 'validateotp']);
Route::post('submitpassword', [ForgotPasswordController::class, 'submitpassword']);

Route::middleware('auth:sanctum')->group(function () {
    Route::get('user', [LoginController::class, 'user']);
    Route::get('logout', [LoginController::class, 'logout']);

    Route::prefix('dashboard')->group(function () {
        Route::get('otherStats', [DashboardController::class, 'OtherStatistics']);
        Route::get('polls', [DashboardController::class, 'ElectionDistribution']);
    });

    Route::prefix('admins')->group(function () {
        Route::post('/', [AdminController::class, 'index']);
        Route::post('addadmin', [AdminController::class, 'addadmin']);
        Route::post('updateadmin', [AdminController::class, 'updateadmin']);
    });

    Route::prefix('accounts')->group(function () {
        Route::get('/', [UsersController::class, 'index']);
        Route::post('store', [UsersController::class, 'store']);
        Route::post('update', [UsersController::class, 'update']);
        Route::get('retrieve', [UsersController::class, 'retrieve']);
        Route::get('delete', [UsersController::class, 'delete']);
        Route::post('uploadexcel', [UsersController::class, 'uploadexcel']);
        Route::post('personalchangepass', [UsersController::class, 'personalchangepass']);
    });

    Route::prefix('residents')->group(function () {
        Route::post('/', [ResidentController::class, 'index']);

    });

    Route::prefix('announcements')->group(function () {
        Route::get('/', [AnnouncementController::class, 'index']);
        Route::get('retrieve', [AnnouncementController::class, 'retrieve']);
        Route::post('addannouncement', [AnnouncementController::class, 'addannouncement']);
        Route::post('updateannouncement', [AnnouncementController::class, 'updateannouncement']);
        Route::get('deleteannouncement', [AnnouncementController::class, 'deleteannouncement']);

    });

    Route::prefix('reports')->group(function () {
        Route::get('/', [ReportController::class, 'index']);
        Route::get('retrieve', [ReportController::class, 'retrieve']);
        Route::post('submitcomment', [ReportController::class, 'submitcomment']);
        Route::post('addreport', [ReportController::class, 'addreport']);
        Route::post('updatereport', [ReportController::class, 'updatereport']);
        Route::get('deletereport', [ReportController::class, 'deletereport']);
        Route::get('resolvereport', [ReportController::class, 'resolvereport']);
        Route::get('reopenreport', [ReportController::class, 'reopenreport']);

    });

    Route::prefix('officials')->group(function () {
        Route::get('/', [OfficialController::class, 'index']);
        Route::get('retrieve', [OfficialController::class, 'retrieve']);
        Route::post('addofficial', [OfficialController::class, 'addofficial']);
        Route::post('updateofficial', [OfficialController::class, 'updateofficial']);
        Route::get('deleteofficial', [OfficialController::class, 'deleteofficial']);

    });

    Route::prefix('settings')->group(function () {
        Route::get('/', [SettingsController::class, 'index']);
        Route::post('updatesettings', [SettingsController::class, 'updatesettings']);
    });

    Route::prefix('documents')->group(function () {
        Route::get('/', [DocumentController::class, 'index']);
        Route::get('orgselect', [DocumentController::class, 'orgselect']);
        Route::post('addorg', [DocumentController::class, 'addorg']);
        Route::get('deleteorg', [DocumentController::class, 'deleteorg']);
    });

    Route::prefix('document-requests')->group(function () {
        Route::get('/', [DocRequestController::class, 'index']);
        Route::get('docselect', [DocRequestController::class, 'docselect']);
        Route::post('addrequest', [DocRequestController::class, 'addrequest']);
        Route::get('deleterequest', [DocRequestController::class, 'deleterequest']);
        Route::get('finishedrequest', [DocRequestController::class, 'finishedrequest']);
        Route::get('claimedrequest', [DocRequestController::class, 'claimedrequest']);
        Route::get('availabledate', [DocRequestController::class, 'availabledate']);
    });


});