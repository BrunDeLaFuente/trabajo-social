<?php

namespace App\Http\Controllers;

use App\Models\MallaCurricular;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\File;

class MallaCurricularController extends Controller
{
    public function show()
    {
        $malla = MallaCurricular::with('semestres.materias.contenidos')->first();
        return response()->json($malla?->append(['imagen_url', 'archivo_pdf_url']));
    }

    public function update(Request $request)
    {
        $malla = MallaCurricular::first();

        $request->validate([
            'imagen' => 'nullable|image|max:2048',
            'archivo_pdf' => 'nullable|file|mimes:pdf|max:5120',
            'quitar_imagen' => 'nullable|boolean',
            'quitar_pdf' => 'nullable|boolean',
        ], [
            'archivo_pdf.mimes' => 'El archivo debe ser un PDF.',
            'archivo_pdf.max' => 'El archivo PDF no debe superar los 5MB.',
            'imagen.image' => 'La imagen debe ser un archivo de tipo imagen.',
            'imagen.max' => 'La imagen no debe superar los 2MB.',
        ]);

        DB::beginTransaction();
        try {
            if (!$malla) {
                $malla = MallaCurricular::create([]);
            }

            // 🗑️ Eliminar imagen si se solicita
            if ($request->boolean('quitar_imagen') && $malla->imagen) {
                File::deleteDirectory(public_path("assets/malla/imagen/{$malla->id_malla}"));
                $malla->update(['imagen' => null]);
            }

            // 🗑️ Eliminar PDF si se solicita
            if ($request->boolean('quitar_pdf') && $malla->archivo_pdf) {
                File::deleteDirectory(public_path("assets/malla/archivo/{$malla->id_malla}"));
                $malla->update(['archivo_pdf' => null]);
            }

            // 📤 Subir nueva imagen
            if ($request->hasFile('imagen')) {
                File::deleteDirectory(public_path("assets/malla/imagen/{$malla->id_malla}"));
                $nombre = $request->file('imagen')->getClientOriginalName();
                $rutaDestino = public_path("assets/malla/imagen/{$malla->id_malla}");
                $request->file('imagen')->move($rutaDestino, $nombre);
                $malla->update(['imagen' => "malla/imagen/{$malla->id_malla}/{$nombre}"]);
            }

            // 📤 Subir nuevo PDF
            if ($request->hasFile('archivo_pdf')) {
                File::deleteDirectory(public_path("assets/malla/archivo/{$malla->id_malla}"));
                $nombre = $request->file('archivo_pdf')->getClientOriginalName();
                $rutaDestino = public_path("assets/malla/archivo/{$malla->id_malla}");
                $request->file('archivo_pdf')->move($rutaDestino, $nombre);
                $malla->update(['archivo_pdf' => "malla/archivo/{$malla->id_malla}/{$nombre}"]);
            }

            DB::commit();
            return response()->json($malla->append(['imagen_url', 'archivo_pdf_url']));
        } catch (\Exception $e) {
            DB::rollback();
            return response()->json(['message' => 'Error al actualizar la malla curricular', 'error' => $e->getMessage()], 500);
        }
    }

    public function descargarMalla()
    {
        try {
            $malla = MallaCurricular::first();

            if (!$malla || !$malla->archivo_pdf) {
                return response()->json(['error' => 'Malla no encontrada.'], 404);
            }

            $rutaAbsoluta = public_path('assets/' . $malla->archivo_pdf);

            if (!File::exists($rutaAbsoluta)) {
                return response()->json(['error' => 'Archivo no encontrado.'], 404);
            }

            return response()->file($rutaAbsoluta);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al descargar la malla.',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
