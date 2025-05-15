<?php

use App\Http\Controllers\AccessControlController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ExportController;
use App\Http\Controllers\LaporanController;
use App\Http\Controllers\PaketController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SantriController;
use App\Http\Controllers\UserController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

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
    return redirect()->route('login');
});

Route::get('/dashboard', [DashboardController::class, 'index'])->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::prefix('profile')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('profile.edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('profile.update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('profile.destroy');
    });
    Route::prefix('api')->group(function () {
        Route::prefix('santri')->group(function () {
            Route::get('/', [SantriController::class, 'getSantri'])->name('santris.api.index');
        });
        Route::prefix('paket')->group(function () {
            Route::get('/', [PaketController::class, 'getPakets'])->name('pakets.api.index');
        });
        Route::prefix('laporan')->group(function () {
            Route::get('/', [LaporanController::class, 'getLaporan'])->name('laporan.api.index');
            Route::get('/stats/{periode}/{time}/{idKategori?}', [LaporanController::class, 'getStats'])->name('laporan.api.stats');
        });
        Route::prefix('users')->group(function () {
            Route::get('/', [UserController::class, 'getUsers'])->name('users.api.index');
        });
        Route::prefix('permissions')->group(function () {
            Route::get('/', [AccessControlController::class, 'getPermissions'])->name('permissions.api.index');
        });
        Route::prefix('roles')->group(function () {
            Route::get('/', [AccessControlController::class, 'getRoles'])->name('roles.api.index');
        });
    });
    Route::prefix('santri')->group(function () {
        Route::get('/', [SantriController::class, 'index'])->name('santris.index');
        Route::get('/create', [SantriController::class, 'create'])->name('santris.create');
        Route::post('/store', [SantriController::class, 'store'])->name('santris.store');
        Route::delete('/destroy/{nis}', [SantriController::class, 'destroy'])->name('santris.destroy');
        Route::get('/edit/{nis}', [SantriController::class, 'edit'])->name('santris.edit');
        Route::put('/update/{nis}', [SantriController::class, 'update'])->name('santris.update');
        Route::get('/show/{nis}', [SantriController::class, 'show'])->name('santris.show');
        Route::get('/export/excel', [ExportController::class, 'SantriToExcel'])->name('santris.export.excel');
        Route::get('/export/pdf', [ExportController::class, 'SantriToPdf'])->name('santris.export.pdf');
    });
    Route::prefix('paket')->group(function () {
        Route::get('/', function () {
            return Inertia::render('Paket/Index');
        })->name('pakets.index');
        Route::get('/create/{jenis_paket}', [PaketController::class, 'create'])->name('pakets.create')->where('jenis_paket', 'masuk|keluar');
        Route::post('/store/{jenis_paket}', [PaketController::class, 'store'])->name('pakets.store')->where('jenis_paket', 'masuk|keluar');
        Route::get('/edit/{id}/{jenis_paket}', [PaketController::class, 'edit'])->name('pakets.edit')->where('jenis_paket', 'masuk|keluar');
        Route::put('/update/{id}/{jenis_paket}', [PaketController::class, 'update'])->name('pakets.update')->where('jenis_paket', 'masuk|keluar');
        Route::get('/show/{id}/{jenis_paket}', [PaketController::class, 'show'])->name('pakets.show')->where('jenis_paket', 'masuk|keluar');
        Route::delete('/destroy/{id}', [PaketController::class, 'destroy'])->name('pakets.destroy');
        Route::get('/export/excel/{jenisPaket}', [ExportController::class, 'PaketToExcel'])->name('pakets.export.excel')->where('jenisPaket', 'masuk|keluar');
        Route::get('/export/pdf/{jenisPaket}', [ExportController::class, 'PaketToPdf'])->name('pakets.export.pdf')->where('jenisPaket', 'masuk|keluar');
    });
    Route::prefix('laporan')->group(function () {
        Route::get('/', [LaporanController::class, 'index'])->name('laporan.index');
        Route::get('/export/excel', [ExportController::class, 'LaporanToExcel'])->name('laporan.export.excel');
    });
    Route::prefix('master-data')->group(function () {
        Route::get('/', function () {
            return 'A';
        })->name('master-data.index');
    });
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('users.index');
        Route::get('/create', [UserController::class, 'create'])->name('users.create');
        Route::post('/store', [UserController::class, 'store'])->name('users.store');
        Route::get('/edit/{id}', [UserController::class, 'edit'])->name('users.edit');
        Route::put('/update/{id}', [UserController::class, 'update'])->name('users.update');
        Route::delete('/destroy/{id}', [UserController::class, 'destroy'])->name('users.destroy');
        Route::get('/export/excel', [ExportController::class, 'UserToExcel'])->name('users.export.excel');
    });
    Route::prefix('access-control')->group(function () {
        Route::get('/', function () {
            return redirect()->route('access-control.permission');
        })->name('access-control.index');
        Route::get('/permission', function () {
            return Inertia::render('Permission/Index');
        })->name('access-control.permission');
        Route::get('/role', function () {
            return Inertia::render('Role/Index');
        })->name('access-control.role');
        Route::get('/role/create', function () {
            return Inertia::render('Role/Create');
        })->name('access-control.role.create');
        Route::get('/role/edit/{id}', [AccessControlController::class, 'editRole'])->name('access-control.role.edit');
        Route::put('/role/update/{id}', [AccessControlController::class, 'updateRole'])->name('access-control.role.update');
        Route::delete('/role/destroy/{id}', [AccessControlController::class, 'deleteRole'])->name('access-control.role.destroy');
        Route::post('/role/store', [AccessControlController::class, 'storeRole'])->name('access-control.role.store');
    });
});

require __DIR__.'/auth.php';
