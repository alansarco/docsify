<?php

use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\AnnouncementController;
use App\Http\Controllers\Api\CampusController;
use App\Http\Controllers\Api\UsersController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\LicenseController;
use App\Http\Controllers\Api\GeneralController;
use App\Http\Controllers\Api\LoginController;
use App\Http\Controllers\Api\ForgotPasswordController;
use App\Http\Controllers\Api\LogController;
use App\Http\Controllers\Api\ProfileController;
use App\Http\Controllers\Api\ProgramController;
use App\Http\Controllers\Api\RegistrarController;
use App\Http\Controllers\Api\SignupController;
use App\Http\Controllers\Api\ResidentController;
use App\Http\Controllers\Api\RepresentativeController;
use App\Http\Controllers\Api\RequestController;
use App\Http\Controllers\Api\SectionController;
use App\Http\Controllers\Api\SettingsController;
use App\Http\Controllers\Api\StudentController;
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
Route::get('clientselectrep', [RepresentativeController::class, 'clientselectrep']);
Route::get('clientselectrepupdate', [RepresentativeController::class, 'clientselectrepupdate']);
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
        Route::get('adminnotifs', [DashboardController::class, 'AdminNotifications']);
    });

    Route::prefix('admins')->group(function () {
        Route::post('/', [AdminController::class, 'index']);
        Route::post('addadmin', [AdminController::class, 'addadmin']);
        Route::post('updateadmin', [AdminController::class, 'updateadmin']);
        Route::get('deleteadmin', [AdminController::class, 'deleteadmin']);
        Route::get('retrieveadmin', [AdminController::class, 'retrieveadmin']);
    });

    Route::prefix('representatives')->group(function () {
        Route::post('/', [RepresentativeController::class, 'index']);
        Route::post('addrepresentative', [RepresentativeController::class, 'addrepresentative']);
        Route::post('updaterepresentative', [RepresentativeController::class, 'updaterepresentative']);
        Route::get('deleterepresentative', [RepresentativeController::class, 'deleterepresentative']);
        Route::get('retrieverepresentative', [RepresentativeController::class, 'retrieverepresentative']);
    });

    Route::prefix('registrars')->group(function () {
        Route::post('/', [RegistrarController::class, 'index']);
        Route::post('addregistrar', [RegistrarController::class, 'addregistrar']);
        Route::post('updateregistrar', [RegistrarController::class, 'updateregistrar']);
        Route::get('deleteRegistrar', [RegistrarController::class, 'deleteRegistrar']);
        Route::get('retrieveregistrar', [RegistrarController::class, 'retrieveregistrar']);
    });

    Route::prefix('students')->group(function () {
        Route::post('/', [StudentController::class, 'index']);
        Route::post('addstudent', [StudentController::class, 'addstudent']);
        Route::post('updatestudent', [StudentController::class, 'updatestudent']);
        Route::get('deletestudent', [StudentController::class, 'deletestudent']);
        Route::get('retrievestudent', [StudentController::class, 'retrievestudent']);
        Route::get('sectionselect', [StudentController::class, 'sectionselect']);
        Route::get('programselect', [StudentController::class, 'programselect']);
    });

    Route::prefix('sections')->group(function () {
        Route::post('/', [SectionController::class, 'index']);
        Route::post('addsection', [SectionController::class, 'addsection']);
        Route::get('retrievesection', [SectionController::class, 'retrievesection']);
        Route::get('deletesection', [SectionController::class, 'deletesection']);
        Route::post('updatesection', [SectionController::class, 'updatesection']);
    });
    
    Route::prefix('programs')->group(function () {
        Route::post('/', [ProgramController::class, 'index']);
        Route::post('addprogram', [ProgramController::class, 'addprogram']);
        Route::get('retrieveprogram', [ProgramController::class, 'retrieveprogram']);
        Route::get('deleteprogram', [ProgramController::class, 'deleteprogram']);
        Route::post('updateprogram', [ProgramController::class, 'updateprogram']);
    });

    Route::prefix('documents')->group(function () {
        Route::post('/', [DocumentController::class, 'index']);
        Route::post('adddocument', [DocumentController::class, 'adddocument']);
        Route::get('retrievedocument', [DocumentController::class, 'retrievedocument']);
        Route::get('deletedocument', [DocumentController::class, 'deletedocument']);
        Route::post('updatedocument', [DocumentController::class, 'updatedocument']);
    });

    Route::prefix('requests')->group(function () {
        Route::post('/', [RequestController::class, 'index']);
        Route::post('historyrequests', [RequestController::class, 'historyrequests']);
        Route::get('documentselect', [RequestController::class, 'documentselect']);
        Route::get('retrieverequest', [RequestController::class, 'retrieverequest']);
        Route::get('assigntome', [RequestController::class, 'assigntome']);

        Route::post('adddocument', [RequestController::class, 'adddocument']);
        Route::post('updatedocument', [RequestController::class, 'updatedocument']);
    });

    Route::prefix('campuses')->group(function () {
        Route::post('active', [CampusController::class, 'active']);
        Route::post('inactive', [CampusController::class, 'inactive']);
        Route::post('addcampus', [CampusController::class, 'addcampus']);
        Route::post('updatecampus', [CampusController::class, 'updatecampus']);
        Route::get('deletecampus', [CampusController::class, 'deletecampus']);
        Route::get('retrievecampus', [CampusController::class, 'retrievecampus']);
        Route::post('renewcampus', [CampusController::class, 'renewcampus']);
    });

    Route::prefix('logs')->group(function () {
        Route::post('adminlogs', [LogController::class, 'adminlogs']);
        Route::post('representativelogs', [LogController::class, 'representativelogs']);
    });

    Route::prefix('licenses')->group(function () {
        Route::post('/', [LicenseController::class, 'index']);
        Route::post('addlicense', [LicenseController::class, 'addlicense']);
        Route::get('deletelicense', [LicenseController::class, 'deletelicense']);
    });

    Route::prefix('settings')->group(function () {
        Route::get('adminsettings', [SettingsController::class, 'adminsettings']);
        Route::get('adminsettingsretrieved', [SettingsController::class, 'adminsettingsretrieved']);
        Route::post('updateadminsettings', [SettingsController::class, 'updateadminsettings']);

        Route::get('representativesettings', [SettingsController::class, 'representativesettings']);
        Route::get('representativesettingsretrieved', [SettingsController::class, 'representativesettingsretrieved']);
        Route::post('updaterepresentativesettings', [SettingsController::class, 'updaterepresentativesettings']);
    });

    Route::prefix('profile')->group(function () {
        Route::get('profileretrieve', [ProfileController::class, 'profileretrieve']);
        Route::post('updateprofile', [ProfileController::class, 'updateprofile']);
        Route::post('personalchangepass', [ProfileController::class, 'personalchangepass']);
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

});