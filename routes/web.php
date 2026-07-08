<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\RoleController;
use App\Http\Controllers\UserRoleController;
use App\Http\Controllers\AmenityController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\PromoterController;
use App\Http\Controllers\LocationController;
use App\Http\Controllers\ProjectEditController;
use App\Http\Controllers\BuilderUserController;
use App\Http\Controllers\PropertyTypeController;
use App\Http\Controllers\UnitTypeController;
use App\Http\Controllers\ProjectLeadController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\ChannelPartnerController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CommissionController;
use App\Http\Controllers\CollectionController;
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



    Route::prefix('categories')->name('categories.')->group(function () {
        Route::get('/', [CategoryController::class, 'index'])->name('index');
        Route::post('/store', [CategoryController::class, 'store'])->name('store');
        Route::put('/update/{id}', [CategoryController::class, 'update'])->name('update');
        Route::delete('/delete/{id}', [CategoryController::class, 'destroy'])->name('destroy');

    });

    Route::prefix('promoters')->name('promoters.')->group(function () {
        Route::get('/', [PromoterController::class, 'index'])->name('index');
        Route::post('/store', [PromoterController::class, 'store'])->name('store');
        Route::put('/update/{id}', [PromoterController::class, 'update'])->name('update');
        Route::delete('/delete/{id}', [PromoterController::class, 'destroy'])->name('destroy');
    });

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
    Route::post('/projects/{id}/assign-promoter', [ProjectController::class, 'assignPromoter'])->name('projects.assignPromoter');

    Route::get('/get-cities/{stateId}', [LocationController::class, 'getCities']);
    Route::get('/get-areas/{cityId}', [LocationController::class, 'getAreas']);

    Route::get('/projects/{id}/edit-basic', [ProjectEditController::class, 'editBasic'])->name('projects.edit.basic');
    Route::put('/projects/{id}/update-basic', [ProjectEditController::class, 'updateBasic'])->name('projects.update.basic');
    Route::get('/projects/{id}/edit-configurations', [ProjectEditController::class, 'editConfigurations'])->name('projects.edit.configurations');
    Route::put('/projects/{id}/update-configurations', [ProjectEditController::class, 'updateConfigurations'])->name('projects.update.configurations');
    Route::get('/projects/{id}/edit-towers', [ProjectEditController::class, 'editTowers'])->name('projects.edit.towers');
    Route::put('/projects/{id}/update-towers', [ProjectEditController::class, 'updateTowers'])->name('projects.update.towers');
    Route::get('/projects/{id}/edit-amenities', [ProjectEditController::class, 'editAmenities'])->name('projects.edit.amenities');
    Route::put('/projects/{id}/update-amenities', [ProjectEditController::class, 'updateAmenities'])->name('projects.update.amenities');
    Route::get('/projects/{id}/edit-gallery', [ProjectEditController::class, 'editGallery'])->name('projects.edit.gallery');
    Route::put('/projects/{id}/update-gallery', [ProjectEditController::class, 'updateGallery'])->name('projects.update.gallery');

    Route::get('/builder', [BuilderUserController::class, 'index'])->name('builder.index');
    Route::post('/builder/store', [BuilderUserController::class, 'store'])->name('builder.store');
    Route::post('/builder/update/{id}', [BuilderUserController::class, 'update'])->name('builder.update');
    Route::delete('/builder/delete/{id}', [BuilderUserController::class, 'destroy'])->name('builder.destroy');

    Route::resource('property-types', PropertyTypeController::class);
    Route::resource('unit-types', UnitTypeController::class)->only(['index', 'store', 'update', 'destroy']);

    Route::get('/project-leads', [ProjectLeadController::class, 'index'])->name('project-leads.index');
    Route::get('/project-leads/{id}', [ProjectLeadController::class, 'show'])->name('project-leads.show');
    Route::post('/project-leads/status', [ProjectLeadController::class, 'updateStatus'])->name('project-leads.status');
    Route::post('/project-leads/remark', [ProjectLeadController::class, 'updateRemark'])->name('project-leads.remark');
    Route::post('/lead-followup', [ProjectLeadController::class, 'addFollowup']);

    Route::get('/customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::get('/customers/create', [CustomerController::class, 'create'])->name('customers.create');
    Route::post('/customers', [CustomerController::class, 'store'])->name('customers.store');
    Route::get('/customers/{id}/edit', [CustomerController::class, 'edit'])->name('customers.edit');
    Route::put('/customers/{id}', [CustomerController::class, 'update'])->name('customers.update');
    Route::delete('/customers/{id}', [CustomerController::class, 'destroy'])->name('customers.destroy');
    Route::get('/customers/{id}', [CustomerController::class, 'show'])->name('customers.show');

    Route::get('channel-partners', [ChannelPartnerController::class, 'index'])->name('channel-partners.index');
    Route::get('channel-partners/create', [ChannelPartnerController::class, 'create'])->name('channel-partners.create');
    Route::post('channel-partners', [ChannelPartnerController::class, 'store'])->name('channel-partners.store');
    Route::get('channel-partners/{id}/edit', [ChannelPartnerController::class, 'edit'])->name('channel-partners.edit');
    Route::put('channel-partners/{id}', [ChannelPartnerController::class, 'update'])->name('channel-partners.update');
    Route::delete('channel-partners/{id}', [ChannelPartnerController::class, 'destroy'])->name('channel-partners.destroy');
    Route::get('channel-partners/{id}', [ChannelPartnerController::class, 'show'])->name('channel-partners.show');

    Route::get('bookings', [BookingController::class, 'index'])->name('bookings.index');
    Route::get('bookings/create', [BookingController::class, 'create'])->name('bookings.create');
    Route::post('bookings', [BookingController::class, 'store'])->name('bookings.store');
    Route::get('bookings/{booking}/edit', [BookingController::class, 'edit'])->name('bookings.edit');
    Route::put('bookings/{booking}', [BookingController::class, 'update'])->name('bookings.update');
    Route::delete('bookings/{booking}', [BookingController::class, 'destroy'])->name('bookings.destroy');
    Route::get('bookings/{booking}', [BookingController::class, 'show'])->name('bookings.show');
    Route::get('/api/projects/{projectId}/units', [BookingController::class, 'getProjectUnits']);

    Route::get('commissions', [CommissionController::class, 'index'])->name('commissions.index');
    Route::get('commissions/{id}', [CommissionController::class, 'show'])->name('commissions.show');

    Route::resource('collections', CollectionController::class);
    Route::post('collections/{collection}/receive-payment', [CollectionController::class, 'receivePayment'])->name('collections.receive-payment');
    Route::post('collections/store-bulk', [CollectionController::class, 'storeBulk'])->name('collections.storeBulk');
    Route::get('/channel-partners/{partner}/projects/{project}/commission',[BookingController::class, 'getCommission']);
    Route::post('/lead-followup/store',[ProjectLeadController::class, 'addFollowup'])->name('lead-followup.store');
});


require __DIR__ . '/auth.php';
