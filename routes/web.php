<?php

use App\Http\Controllers\ProfileController;
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
    Route::prefix('santri')->group(function () {
        Route::get('/', function () {
            return 'A';
        })->name('santri.index');
    });
    Route::prefix('paket')->group(function () {
        Route::get('/', function () {
            return 'A';
        })->name('paket.index');
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
        })->name('user.index');
    });
    Route::prefix('access-control')->group(function () {
        Route::get('/', function () {
            return 'A';
        })->name('access-control.index');
    });
});

require __DIR__.'/auth.php';
