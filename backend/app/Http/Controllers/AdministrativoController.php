<?php

namespace App\Http\Controllers;

use App\Models\Persona;
use App\Models\PersonaCorreo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;

class AdministrativoController extends Controller
{
    public function index()
    {
        $administrativos = Persona::with('correos')
            ->whereHas('tipo', fn($q) => $q->where('nombre_tipo', 'Administrativo'))
            ->get()
            ->each->append('imagen_persona_url');

        return response()->json($administrativos);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre_persona' => 'required|string|max:255',
            'cargo' => 'required|string|max:255',
            'correos' => 'array',
            'correos.*' => 'email',
            'imagen' => 'nullable|image|max:2048',
        ]);

        DB::beginTransaction();
        try {
            $persona = Persona::create([
                'id_tipo_persona' => 2,
                'nombre_persona' => $request->nombre_persona,
                'cargo' => $request->cargo,
            ]);

            if ($request->hasFile('imagen')) {
                $path = $request->file('imagen')->store("personas/{$persona->id_persona}", 'public');
                $persona->update(['imagen_persona' => $path]);
            }

            foreach ($request->correos ?? [] as $correo) {
                PersonaCorreo::create([
                    'id_persona' => $persona->id_persona,
                    'email_persona' => $correo
                ]);
            }

            DB::commit();
            return response()->json($persona->load('correos')->append('imagen_persona_url'), 201);
        } catch (QueryException $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Ocurrió un error inesperado.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function update(Request $request, $id)
    {
        $persona = Persona::findOrFail($id);

        $request->validate([
            'nombre_persona' => 'required|string|max:255',
            'cargo' => 'required|string|max:255',
            'correos' => 'array',
            'correos.*' => 'email',
            'imagen' => 'nullable|image|max:2048',
            'quitar_imagen' => 'nullable|boolean',
        ]);

        DB::beginTransaction();
        try {
            $persona->update([
                'nombre_persona' => $request->nombre_persona,
                'cargo' => $request->cargo,
            ]);

            // ✅ Quitar imagen si viene el flag
            if ($request->boolean('quitar_imagen') && $persona->imagen_persona) {
                Storage::disk('public')->deleteDirectory("personas/{$persona->id_persona}");
                $persona->update(['imagen_persona' => null]);
            }

            // ✅ Subir nueva imagen si se envía
            if ($request->hasFile('imagen')) {
                Storage::disk('public')->deleteDirectory("personas/{$persona->id_persona}");
                $path = $request->file('imagen')->store("personas/{$persona->id_persona}", 'public');
                $persona->update(['imagen_persona' => $path]);
            }

            // 🔄 Reemplazar correos
            PersonaCorreo::where('id_persona', $persona->id_persona)->delete();
            foreach ($request->correos ?? [] as $correo) {
                PersonaCorreo::create([
                    'id_persona' => $persona->id_persona,
                    'email_persona' => $correo
                ]);
            }

            DB::commit();
            return response()->json($persona->load('correos')->append('imagen_persona_url'));
        } catch (QueryException $e) {
            DB::rollback();
            return response()->json([
                'message' => 'Ocurrió un error inesperado.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function destroy($id)
    {
        $persona = Persona::findOrFail($id);
        Storage::disk('public')->deleteDirectory("personas/{$id}");
        $persona->delete();
        return response()->json(['message' => 'Administrativo eliminado']);
    }
}
