<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserRoleController;    
use App\Http\Controllers\AmenityController;
use App\Http\Controllers\ProjectController;
/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
});

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});


Route::middleware(['auth', 'check.permission'])->group(function () {

    Route::get('/roles', [RoleController::class, 'index'])->name('roles.index');
    Route::get('/roles/create', [RoleController::class, 'create'])->name('roles.create');
    Route::post('/roles', [RoleController::class, 'store'])->name('roles.store');
    Route::get('/roles/manage', [RoleController::class, 'manage']);
    Route::post('/roles/update-permissions', [RoleController::class, 'updatePermissions'])->name('roles.updatePermissions');
    Route::get('/roles/manage', [RoleController::class, 'manage'])->name('roles.manage');

    Route::get('/users', [UserRoleController::class, 'index'])->name('users.index');
    Route::post('/users/assign-role', [UserRoleController::class, 'assignRole'])->name('users.assignRole');




    Route::get('/amenities', [AmenityController::class, 'index'])->name('amenities.index');
    Route::post('/amenities', [AmenityController::class, 'store'])->name('amenities.store');
    Route::post('/amenities/{id}', [AmenityController::class, 'update'])->name('amenities.update');
    Route::delete('/amenities/{id}', [AmenityController::class, 'destroy'])->name('amenities.destroy');

    
    Route::get('/projects/create', [ProjectController::class, 'create'])->name('projects.create');
    Route::get('/projects/{id}/view', [ProjectController::class, 'show'])->name('projects.view');
    Route::post('/projects/store-all', [ProjectController::class, 'storeAll'])->name('projects.storeAll');
    Route::get('/projects', [ProjectController::class, 'index'])->name('projects.index');
    Route::get('/projects/{id}/edit', [ProjectController::class, 'edit'])->name('projects.edit');
    Route::put('/projects/{id}', [ProjectController::class, 'update'])->name('projects.update');
    Route::delete('/projects/{id}', [ProjectController::class, 'destroy'])->name('projects.destroy');
    Route::post('/projects/{id}/assign-promoter', [ProjectController::class, 'assignPromoter'])
    ->name('projects.assignPromoter');
});


require __DIR__.'/auth.php';
