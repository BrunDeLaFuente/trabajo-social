<?php

namespace App\Http\Controllers;

use App\Models\Tramite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;

class TramiteController extends Controller
{
    public function index()
    {
        $tramites = Tramite::all()->each->append('planilla_download_url');
        return response()->json($tramites);
    }

    public function store(Request $request)
    {
        $request->validate([
            'titulo_tramite' => 'required|string|max:255|unique:tramite,titulo_tramite',
            'descripcion_tramite' => 'nullable|string',
            'planilla' => 'nullable|file|max:5120', // Máx. 5 MB
        ]);

        DB::beginTransaction();
        try {
            $tramite = Tramite::create([
                'titulo_tramite' => $request->titulo_tramite,
                'descripcion_tramite' => $request->descripcion_tramite,
            ]);

            if ($request->hasFile('planilla')) {
                $archivo = $request->file('planilla');

                // Seguridad: evitar caracteres problemáticos en el nombre original
                $nombreSeguro = time() . '_' . preg_replace('/[^A-Za-z0-9_\-\.]/', '_', $archivo->getClientOriginalName());

                $rutaDestino = public_path("assets/tramites/{$tramite->id_tramite}");

                // Crear la carpeta si no existe
                if (!File::exists($rutaDestino)) {
                    File::makeDirectory($rutaDestino, 0755, true);
                }

                // Mover el archivo
                $archivo->move($rutaDestino, $nombreSeguro);

                // Guardar la ruta relativa en DB
                $tramite->update(['planilla_url' => "tramites/{$tramite->id_tramite}/{$nombreSeguro}"]);
            }

            DB::commit();
            return response()->json($tramite->append('planilla_download_url'), 201);
        } catch (QueryException $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Error al crear el trámite',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function show($id)
    {
        $tramite = Tramite::findOrFail($id)->append('planilla_download_url');
        return response()->json($tramite);
    }

    public function update(Request $request, $id)
    {
        $tramite = Tramite::findOrFail($id);

        $request->validate([
            'titulo_tramite' => 'required|string|max:255|unique:tramite,titulo_tramite,' . $id . ',id_tramite',
            'descripcion_tramite' => 'nullable|string',
            'planilla' => 'nullable|file|max:5120',
            'quitar_planilla' => 'nullable|boolean',
        ]);

        DB::beginTransaction();
        try {
            // ✅ Actualizar título y descripción
            $tramite->update([
                'titulo_tramite' => $request->titulo_tramite,
                'descripcion_tramite' => $request->descripcion_tramite,
            ]);

            $rutaCarpeta = public_path("assets/tramites/{$tramite->id_tramite}");

            // 🗑️ Eliminar archivo si se solicita
            if ($request->boolean('quitar_planilla') && $tramite->planilla_url) {
                File::deleteDirectory($rutaCarpeta);
                $tramite->update(['planilla_url' => null]);
            }

            // 📥 Subida nueva planilla (reemplazo)
            if ($request->hasFile('planilla')) {
                // Borrar anterior si existía
                File::deleteDirectory($rutaCarpeta);

                // Guardar nuevo archivo
                $archivo = $request->file('planilla');
                $nombre = $archivo->getClientOriginalName();
                $archivo->move($rutaCarpeta, $nombre);

                // Guardar solo la ruta relativa
                $tramite->update([
                    'planilla_url' => "tramites/{$tramite->id_tramite}/{$nombre}"
                ]);
            }

            DB::commit();
            return response()->json($tramite->append('planilla_download_url'));
        } catch (QueryException $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Error al actualizar el trámite',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $tramite = Tramite::findOrFail($id);

        // Eliminar carpeta desde /public/assets/tramites/{id}
        $ruta = public_path("assets/tramites/{$tramite->id_tramite}");

        if (File::exists($ruta)) {
            File::deleteDirectory($ruta);
        }

        $tramite->delete();

        return response()->json(['message' => 'Trámite eliminado correctamente.']);
    }

    public function descargarPlanilla($id)
    {
        try {
            $tramite = Tramite::findOrFail($id);

            if (!$tramite->planilla_url) {
                return response()->json(['error' => 'Planilla no encontrada.'], 404);
            }

            $ruta = public_path('assets/' . $tramite->planilla_url);

            if (!File::exists($ruta)) {
                return response()->json(['error' => 'Archivo no encontrado en assets.'], 404);
            }

            return response()->file($ruta);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al descargar la planilla.',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
