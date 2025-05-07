<?php

namespace App\Http\Controllers;

use App\Models\Persona;
use App\Models\PersonaCorreo;
use App\Models\DocenteAsignatura;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;

class DocenteController extends Controller
{
    public function index()
    {
        $docentes = Persona::with(['correos', 'asignaturas'])
            ->whereHas('tipo', fn($q) => $q->where('nombre_tipo', 'Docente'))
            ->get();

        return response()->json($docentes);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre_persona' => 'required|string|max:255',
            'cargo' => 'required|string|max:255',
            'imagen' => 'nullable|image|max:2048',
            'correos' => 'nullable|array',
            'correos.*' => 'email',
            'asignaturas' => 'nullable|array',
            'asignaturas.*' => 'integer|exists:asignatura,id_asignatura',
        ]);

        DB::beginTransaction();
        try {
            $persona = Persona::create([
                'id_tipo_persona' => 1, // Docente
                'nombre_persona' => $request->nombre_persona,
                'cargo' => $request->cargo,
            ]);

            // Imagen
            if ($request->hasFile('imagen')) {
                $path = $request->file('imagen')->store("personas/{$persona->id_persona}", 'public');
                $persona->update(['imagen_persona' => $path]);
            }

            // Correos
            foreach ($request->correos ?? [] as $correo) {
                PersonaCorreo::create([
                    'id_persona' => $persona->id_persona,
                    'email_persona' => $correo
                ]);
            }

            // Asignaturas
            foreach ($request->asignaturas ?? [] as $id_asignatura) {
                DocenteAsignatura::create([
                    'id_persona' => $persona->id_persona,
                    'id_asignatura' => $id_asignatura
                ]);
            }

            DB::commit();
            return response()->json($persona->load(['correos', 'asignaturas']), 201);
        } catch (QueryException $e) {
            DB::rollback();
            if ($e->errorInfo[1] == 1062) {
                return response()->json(['message' => 'El correo electrónico ya fue registrado.'], 422);
            }

            return response()->json(['message' => 'Error inesperado.', 'error' => $e->getMessage()], 500);
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
            'asignaturas' => 'nullable|array',
            'asignaturas.*' => 'integer|exists:asignatura,id_asignatura',
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

            // Correos
            PersonaCorreo::where('id_persona', $persona->id_persona)->delete();
            foreach ($request->correos ?? [] as $correo) {
                PersonaCorreo::create([
                    'id_persona' => $persona->id_persona,
                    'email_persona' => $correo
                ]);
            }

            // Asignaturas
            DocenteAsignatura::where('id_persona', $persona->id_persona)->delete();
            foreach ($request->asignaturas ?? [] as $id_asignatura) {
                DocenteAsignatura::create([
                    'id_persona' => $persona->id_persona,
                    'id_asignatura' => $id_asignatura
                ]);
            }

            DB::commit();
            return response()->json($persona->load(['correos', 'asignaturas']));
        } catch (QueryException $e) {
            DB::rollback();
            if ($e->errorInfo[1] == 1062) {
                return response()->json(['message' => 'El correo electrónico ya fue registrado.'], 422);
            }

            return response()->json(['message' => 'Error inesperado.', 'error' => $e->getMessage()], 500);
        }
    }

    public function destroy($id)
    {
        $persona = Persona::findOrFail($id);
        Storage::disk('public')->deleteDirectory("personas/{$id}");
        $persona->delete();
        return response()->json(['message' => 'Docente eliminado']);
    }
}
