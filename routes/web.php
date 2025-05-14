<?php

use App\Http\Controllers\ExportController;
use App\Http\Controllers\PaketController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\SantriController;
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
    });
    Route::prefix('laporan')->group(function () {
        Route::get('/', function () {
            return 'A';
        })->name('laporan.index');
    });
    Route::prefix('master-data')->group(function () {
        Route::get('/', function () {
            return 'A';
        })->name('master-data.index');
    });
    Route::prefix('users')->group(function () {
        Route::get('/', function () {
            return 'A';
        })->name('users.index');
    });
    Route::prefix('access-control')->group(function () {
        Route::get('/', function () {
            return 'A';
        })->name('access-control.index');
    });
});

require __DIR__.'/auth.php';
