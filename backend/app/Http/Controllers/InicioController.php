<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Evento;
use App\Models\Noticia;
use App\Models\User;
use App\Models\TipoPersona;
use App\Models\Semestre;
use App\Models\Materia;
use App\Models\CarreraRrss;
use App\Models\Tramite;

use Illuminate\Http\JsonResponse;

class InicioController extends Controller
{
    public function index(): JsonResponse
    {
        // Eventos
        $totalEventos = Evento::count();
        $eventosPago = Evento::where('es_pago', 1)->count();
        $eventosGratis = Evento::where('es_pago', 0)->count();

        // Noticias
        $totalNoticias = Noticia::count();
        $noticiasPorCategoria = Noticia::selectRaw('categoria, COUNT(*) as total')
            ->groupBy('categoria')
            ->pluck('total', 'categoria');

        // Usuarios no administradores
        $usuariosNoAdmin = User::where('is_admin', false)->count();

        // Personas por tipo
        $tiposPersona = TipoPersona::withCount('personas')->pluck('personas_count', 'nombre_tipo');

        // Trámites
        $totalTramites = Tramite::count();

        // Malla curricular: total de semestres y total de materias
        $totalSemestres = Semestre::count();
        $totalMaterias = Materia::count();

        // Redes sociales públicas: total y nombres
        $redesPublicas = CarreraRrss::where('es_publico', 1)->pluck('nombre_rrss');

        return response()->json([
            'eventos' => [
                'total' => $totalEventos,
                'pago' => $eventosPago,
                'gratis' => $eventosGratis,
            ],
            'noticias' => [
                'total' => $totalNoticias,
                'por_categoria' => $noticiasPorCategoria,
            ],
            'usuarios_no_admin' => $usuariosNoAdmin,
            'personas' => $tiposPersona,
            'tramites' => $totalTramites,
            'malla' => [
                'total_semestres' => $totalSemestres,
                'total_materias' => $totalMaterias,
            ],
            'redes_publicas' => [
                'total' => $redesPublicas->count(),
                'nombres' => $redesPublicas->values(),
            ],
        ]);
    }
}
