<?php

namespace App\Http\Controllers;

use App\Models\Tramite;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
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
                $path = $request->file('planilla')->store("tramites/{$tramite->id_tramite}", 'public');
                $tramite->update(['planilla_url' => $path]);
            }

            DB::commit();
            return response()->json($tramite->append('planilla_download_url'), 201);
        } catch (QueryException $e) {
            DB::rollback();
            return response()->json(['message' => 'Error al crear el trámite', 'error' => $e->getMessage()], 500);
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
            $tramite->update([
                'titulo_tramite' => $request->titulo_tramite,
                'descripcion_tramite' => $request->descripcion_tramite,
            ]);

            // 🗑️ Eliminar archivo si se solicita
            if ($request->boolean('quitar_planilla') && $tramite->planilla_url) {
                Storage::disk('public')->deleteDirectory("tramites/{$tramite->id_tramite}");
                $tramite->update(['planilla_url' => null]);
            }

            // 📥 Nueva subida
            if ($request->hasFile('planilla')) {
                Storage::disk('public')->deleteDirectory("tramites/{$tramite->id_tramite}");
                $path = $request->file('planilla')->store("tramites/{$tramite->id_tramite}", 'public');
                $tramite->update(['planilla_url' => $path]);
            }

            DB::commit();
            return response()->json($tramite->append('planilla_download_url'));
        } catch (QueryException $e) {
            DB::rollback();
            return response()->json(['message' => 'Error al actualizar el trámite', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $tramite = Tramite::findOrFail($id);

        // Borrar archivos
        Storage::disk('public')->deleteDirectory("tramites/{$tramite->id_tramite}");
        $tramite->delete();

        return response()->json(['message' => 'Trámite eliminado correctamente.']);
    }
}
