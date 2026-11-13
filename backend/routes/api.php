<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BrandCategoryController;
use App\Http\Controllers\BrandsController;
use App\Http\Controllers\ResendVerificationController;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\VerificationController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

//Public routes(Can be accessed when logged out)
Route::post('/register-user', [AuthController::class, 'register']);
Route::post('/login-user', [AuthController::class, 'login']);

Route::get('/email/verify/{id}/{hash}', [VerificationController::class, 'verify'])
    ->name('verification.verify')
    ->middleware(['signed', 'throttle:6,1']);

Route::post('/email/resend', [ResendVerificationController::class, 'resend'])
    ->middleware('throttle:6,1');

//protected routes.(can be accessed only when logged in);
Route::middleware('auth:sanctum')->group(function () {
    Route::get('me', [AuthController::class, 'userInfo']);
    Route::post('/logout-user', [AuthController::class, 'logout']);

    Route::get('/read-roles', [RoleController::class, 'readRoles']);
    Route::get('/read-role/{id}', [RoleController::class, 'readRole']);

    //Added security for only admin to be able to perform these tasks.
    Route::middleware('check.admin')->group(function () {
        Route::post('/create-role', [RoleController::class, 'createRole']);
        Route::post('/update-role/{id}', [RoleController::class, 'updateRole']);
        Route::delete('/delete-role/{id}', [RoleController::class, 'deleteRole']);
    });

    //General admin checking    
    Route::middleware('check.admin.general')->group(function () {
        Route::post('/create-user', [UserController::class, 'createUser']);
        Route::get('/read-users', [UserController::class, 'readAll']);
        Route::get('/read-user/{id}', [UserController::class, 'readUser']);
        Route::post('/update-user/{id}', [UserController::class, 'updateUser']);
        Route::delete('/delete-user/{id}', [UserController::class, 'deleteUser']);
    });

    Route::apiResource('brands', BrandsController::class);
    Route::apiResource('brand-categories', BrandCategoryController::class);
});
