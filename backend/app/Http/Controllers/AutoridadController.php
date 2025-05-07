<?php

namespace App\Http\Controllers;

use App\Models\Persona;
use App\Models\PersonaCorreo;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;

class AutoridadController extends Controller
{
    public function index()
    {
        $autoridades = Persona::with('correos')
            ->whereHas('tipo', fn($q) => $q->where('nombre_tipo', 'Autoridad'))
            ->get();

        return response()->json($autoridades);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre_persona' => 'required|string|max:255',
            'cargo' => 'required|string|max:255',
            'imagen' => 'nullable|image|max:2048',
            'correos' => 'nullable|array',
            'correos.*' => 'email',
        ]);

        DB::beginTransaction();
        try {
            $persona = Persona::create([
                'id_tipo_persona' => 3,
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
            return response()->json($persona->load('correos'), 201);
        } catch (QueryException $e) {
            DB::rollback();
            if ($e->errorInfo[1] == 1062) { // Código de error de duplicado en MySQL
                return response()->json([
                    'message' => 'El correo electrónico ya fue registrado.'
                ], 422);
            }

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
            'imagen' => 'nullable|image|max:2048',
            'correos' => 'nullable|array',
            'correos.*' => 'email',
        ]);

        DB::beginTransaction();
        try {
            $persona->update([
                'nombre_persona' => $request->nombre_persona,
                'cargo' => $request->cargo,
            ]);

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
            return response()->json($persona->load('correos'));
        } catch (QueryException $e) {
            DB::rollback();
            if ($e->errorInfo[1] == 1062) {
                return response()->json([
                    'message' => 'El correo electrónico ya fue registrado.'
                ], 422);
            }

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
        return response()->json(['message' => 'Autoridad eliminada']);
    }
}
