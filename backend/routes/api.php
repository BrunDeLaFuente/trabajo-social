<?php

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
use App\Http\Controllers\MallaCurricularController;
use App\Http\Controllers\SemestreController;
use App\Http\Controllers\MateriaController;
use App\Http\Controllers\ContenidoController;
use App\Http\Controllers\NoticiaController;
use App\Http\Controllers\AsistenteController;
use App\Http\Controllers\ExpositorController;
use App\Http\Controllers\EventoController;
use App\Http\Controllers\InicioController;
use App\Http\Controllers\InscripcionController;


// 🔒 Rutas PRIVADAS (requieren JWT)
Route::middleware(['jwt.auth'])->group(function () {
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/user', [AuthController::class, 'getUser']);
    Route::post('/cambiar-password', [UserController::class, 'cambiarPassword']);

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

    // Malla curricular
    Route::match(['PUT', 'POST'], '/mallaActualizar', [MallaCurricularController::class, 'update']);
    Route::post('/malla-importar', [SemestreController::class, 'importar']);


    Route::get('/semestres', [SemestreController::class, 'index']);
    Route::get('/semestres/{id}', [SemestreController::class, 'show']);
    Route::post('/semestresCrear', [SemestreController::class, 'store']);
    Route::match(['PUT', 'POST'], '/semestresActualizar/{id}', [SemestreController::class, 'update']);
    Route::delete('/semestresEliminar/{id}', [SemestreController::class, 'destroy']);

    Route::get('/materias', [MateriaController::class, 'index']);
    Route::get('/materias/{id}', [MateriaController::class, 'show']);
    Route::post('/materiasCrear', [MateriaController::class, 'store']);
    Route::match(['PUT', 'POST'], '/materiasActualizar/{id}', [MateriaController::class, 'update']);
    Route::delete('/materiasEliminar/{id}', [MateriaController::class, 'destroy']);

    Route::get('/contenidos', [ContenidoController::class, 'index']);
    Route::get('/contenidos/{id}', [ContenidoController::class, 'show']);
    Route::post('/contenidosCrear', [ContenidoController::class, 'store']);
    Route::match(['PUT', 'POST'], '/contenidosActualizar/{id}', [ContenidoController::class, 'update']);
    Route::delete('/contenidosEliminar/{id}', [ContenidoController::class, 'destroy']);

    // Noticias
    Route::get('/noticiasAdmin', [NoticiaController::class, 'index']);
    Route::post('/noticiasCrear', [NoticiaController::class, 'store']);
    Route::delete('/noticiasEliminar/{id}', [NoticiaController::class, 'destroy']);
    Route::match(['PUT', 'POST'], '/noticiasActualizar/{id}', [NoticiaController::class, 'update']);

    // Artículos
    Route::get('/articulos', [NoticiaController::class, 'indexArticulos']);
    Route::post('/articulosCrear', [NoticiaController::class, 'store']);
    Route::match(['PUT', 'POST'], '/articulosActualizar/{id}', [NoticiaController::class, 'update']);
    Route::delete('/articulosEliminar/{id}', [NoticiaController::class, 'destroy']);
    // Comunicados
    Route::get('/comunicados', [NoticiaController::class, 'indexComunicados']);
    Route::post('/comunicadosCrear', [NoticiaController::class, 'store']);
    Route::match(['PUT', 'POST'], '/comunicadosActualizar/{id}', [NoticiaController::class, 'update']);
    Route::delete('/comunicadosEliminar/{id}', [NoticiaController::class, 'destroy']);

    // Eventos
    Route::get('/eventos', [EventoController::class, 'index']);
    Route::get('/estadisticas/dashboard', [EventoController::class, 'dashboard']);
    Route::post('/eventosCrear', [EventoController::class, 'store']);
    Route::match(['PUT', 'POST'], '/eventosActualizar/{id}', [EventoController::class, 'update']);
    Route::delete('/eventosEliminar/{id}', [EventoController::class, 'destroy']);

    Route::post('eventos/{id}/notificar-asistentes', [EventoController::class, 'notificarAsistentes']);
    Route::get('/eventos/descargar-pdf/{id}', [EventoController::class, 'descargarAsistentesPDF']);

    Route::get('/eventos/{id}/detalles', [InscripcionController::class, 'getEventoConInscripciones']);
    Route::post('/eventos/{id}/inscribir', [InscripcionController::class, 'store']);
    Route::get('/inscripcion/comprobante/{id}', [InscripcionController::class, 'obtenerComprobante']);
    Route::match(['PUT', 'POST'], '/inscripcionActualizar/{id}', [InscripcionController::class, 'update']);
    Route::delete('/inscripcionesEliminar/{id}', [InscripcionController::class, 'destroy']);

    // Asistentes
    Route::get('/asistentes', [AsistenteController::class, 'index']);
    Route::post('/asistentesCrear', [AsistenteController::class, 'store']);
    Route::match(['PUT', 'POST'], '/asistentesActualizar/{id}', [AsistenteController::class, 'update']);
    Route::delete('/asistentesEliminar/{id}', [AsistenteController::class, 'destroy']);

    // Expositores
    Route::get('/expositores', [ExpositorController::class, 'index']);
    Route::post('/expositoresCrear', [ExpositorController::class, 'store']);
    Route::match(['PUT', 'POST'], '/expositoresActualizar/{id}', [ExpositorController::class, 'update']);
    Route::delete('/expositoresEliminar/{id}', [ExpositorController::class, 'destroy']);

    // Inicio
    Route::get('/inicio', [InicioController::class, 'index']);
});


Route::middleware(['jwt.auth', 'admin'])->group(function () {
    Route::get('/usuarios', [UserController::class, 'indexColaboradores']);
    Route::post('/usuariosCrear', [UserController::class, 'store']);
    Route::match(['PUT', 'POST'], '/usuariosActualizar/{id}', [UserController::class, 'update']);
    Route::delete('/usuariosEliminar/{id}', [UserController::class, 'destroy']);
});

// 🟢 Rutas PÚBLICAS (sin middleware)
Route::middleware([])->group(function () {
    //Route::get('/users', [UserController::class, 'index']);

    // Login
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
    Route::get('/tramites/{id}/descargar', [TramiteController::class, 'descargarPlanilla']);

    // Malla curricular
    Route::get('/malla', [MallaCurricularController::class, 'show']);
    Route::get('/malla/descargar', [MallaCurricularController::class, 'descargarMalla']);

    // Noticias
    Route::get('/noticias', [NoticiaController::class, 'indexPublic']);
    Route::get('/noticias/{slug}', [NoticiaController::class, 'mostrarPorSlug']);
    Route::get('/noticias/{tipo}/{id}/descargar', [NoticiaController::class, 'descargarArchivo']);

    // Eventos
    Route::get('/eventos/publicos', [EventoController::class, 'indexPublic']);
    Route::get('/eventos/publicos/{slug}', [EventoController::class, 'getEventoPorSlug']);
    Route::post('/eventos/publicos/{id}/inscribir', [InscripcionController::class, 'storePublic']);
    Route::get('/eventos/{id}/qr/download', [EventoController::class, 'descargarQR']);
});
