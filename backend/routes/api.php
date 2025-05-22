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
use App\Http\Controllers\AsignaturaController;
use App\Http\Controllers\TramiteController;

// 🔒 Rutas PRIVADAS (requieren JWT)
Route::middleware(['jwt.auth'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'getUser']);

    // Carrera
    Route::put('/carreraUpdate', [CarreraController::class, 'update']);
    Route::put('/rrssUpdate', [CarreraRrssController::class, 'update']);

    // Docentes
    Route::post('/docentesCrear', [DocenteController::class, 'store']);
    Route::match(['PUT', 'POST'], '/docentesActualizar/{id}', [DocenteController::class, 'update']);
    Route::delete('/docentesEliminar/{id}', [DocenteController::class, 'destroy']);
    Route::post('/docentes-importar', [DocenteController::class, 'importar']);
    Route::get('/asignaturas', [AsignaturaController::class, 'index']);
    Route::get('/asignaturasBuscar/{id}', [AsignaturaController::class, 'show']);
    Route::post('/asignaturasCrear', [AsignaturaController::class, 'store']);
    Route::match(['PUT', 'POST'], '/asignaturasActualizar/{id}', [AsignaturaController::class, 'update']);
    Route::delete('/asignaturasEliminar/{id}', [AsignaturaController::class, 'destroy']);

    // Administrativos
    Route::post('/administrativosCrear', [AdministrativoController::class, 'store']);
    Route::match(['PUT', 'POST'], '/administrativosActualizar/{id}', [AdministrativoController::class, 'update']);
    Route::delete('/administrativosEliminar/{id}', [AdministrativoController::class, 'destroy']);

    // Autoridades
    Route::post('/autoridadesCrear', [AutoridadController::class, 'store']);
    Route::match(['PUT', 'POST'], '/autoridadesActualizar/{id}', [AutoridadController::class, 'update']);
    Route::delete('/autoridadesEliminar/{id}', [AutoridadController::class, 'destroy']);

    // Trámites
    Route::post('/tramitesCrear', [TramiteController::class, 'store']);
    Route::get('/tramites/{id}', [TramiteController::class, 'show']);
    Route::match(['PUT', 'POST'], '/tramitesActualizar/{id}', [TramiteController::class, 'update']);
    Route::delete('/tramitesEliminar/{id}', [TramiteController::class, 'destroy']);
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

    // Trámites
    Route::get('/tramites', [TramiteController::class, 'index']);
});
