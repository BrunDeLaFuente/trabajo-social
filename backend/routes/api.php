<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\CarreraController;
use App\Http\Controllers\CarreraRrssController;
use App\Http\Controllers\DocenteController;
use App\Http\Controllers\AdministrativoController;
use App\Http\Controllers\AutoridadController;

// 🔒 Rutas PRIVADAS (requieren JWT)
Route::middleware(['jwt.auth'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'getUser']);

    // Carrera
    Route::put('/carreraUpdate', [CarreraController::class, 'update']);
    Route::put('/rrssUpdate', [CarreraRrssController::class, 'update']);

    // Docentes
    Route::post('/docentes', [DocenteController::class, 'store']);
    Route::put('/docentes/{id}', [DocenteController::class, 'update']);
    Route::delete('/docentes/{id}', [DocenteController::class, 'destroy']);

    // Administrativos
    Route::post('/administrativos', [AdministrativoController::class, 'store']);
    Route::put('/administrativos/{id}', [AdministrativoController::class, 'update']);
    Route::delete('/administrativos/{id}', [AdministrativoController::class, 'destroy']);

    // Autoridades
    Route::post('/autoridadesCrear', [AutoridadController::class, 'store']);
    Route::match(['PUT', 'POST'], '/autoridadesActualizar/{id}', [AutoridadController::class, 'update']);
    Route::delete('/autoridadesEliminar/{id}', [AutoridadController::class, 'destroy']);
});


// 🟢 Rutas PÚBLICAS (sin middleware)
Route::middleware([])->group(function () {
    Route::get('/users', [UserController::class, 'index']);
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/refresh', [AuthController::class, 'refreshToken']);

    // Carrera
    Route::get('/carrera', [CarreraController::class, 'show']);

    // Docentes
    Route::get('/docentes', [DocenteController::class, 'index']);

    // Administrativos
    Route::get('/administrativos', [AdministrativoController::class, 'index']);

    // Autoridades
    Route::get('/autoridades', [AutoridadController::class, 'index']);
});
