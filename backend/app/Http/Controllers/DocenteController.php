<?php

namespace App\Http\Controllers;

use App\Models\Persona;
use App\Models\PersonaCorreo;
use App\Models\DocenteAsignatura;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\QueryException;
use App\Models\Asignatura;
use App\Imports\DocentesImport;
use Maatwebsite\Excel\Facades\Excel;

class DocenteController extends Controller
{
    public function index()
    {
        $docentes = Persona::with(['correos', 'asignaturas'])
            ->whereHas('tipo', fn($q) => $q->where('nombre_tipo', 'Docente'))
            ->get()
            ->each->append('imagen_persona_url');

        $asignaturas = Asignatura::all();

        return response()->json([
            'docentes' => $docentes,
            'asignaturas' => $asignaturas,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'nombre_persona' => 'required|string|max:255',
            'cargo' => 'string|max:255',
            'correos' => 'array',
            'correos.*' => 'email',
            'imagen' => 'nullable|image|max:2048',
            'asignaturas' => 'nullable|array',
            'asignaturas.*' => 'string|max:255',
        ]);

        DB::beginTransaction();
        try {
            $persona = Persona::create([
                'id_tipo_persona' => 3,
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
            $idsAsignaturas = $this->procesarAsignaturas($request->asignaturas ?? []);
            foreach ($idsAsignaturas as $id) {
                DocenteAsignatura::create([
                    'id_persona' => $persona->id_persona,
                    'id_asignatura' => $id
                ]);
            }

            DB::commit();
            return response()->json($persona->load(['correos', 'asignaturas'])->append('imagen_persona_url'), 201);
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
            'cargo' => 'string|max:255',
            'correos' => 'array',
            'correos.*' => 'email',
            'imagen' => 'nullable|image|max:2048',
            'quitar_imagen' => 'nullable|boolean',
            'asignaturas' => 'nullable|array',
            'asignaturas.*' => 'string|max:255',
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

            // Asignaturas
            DocenteAsignatura::where('id_persona', $persona->id_persona)->delete();
            $idsAsignaturas = $this->procesarAsignaturas($request->asignaturas ?? []);
            foreach ($idsAsignaturas as $id) {
                DocenteAsignatura::create([
                    'id_persona' => $persona->id_persona,
                    'id_asignatura' => $id
                ]);
            }

            DB::commit();
            return response()->json($persona->load(['correos', 'asignaturas']));
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
        return response()->json(['message' => 'Docente eliminado']);
    }

    private function procesarAsignaturas(array $asignaturas)
    {
        $ids = [];

        foreach ($asignaturas as $entrada) {
            if (is_numeric($entrada)) {
                $ids[] = (int) $entrada;
            } elseif (is_string($entrada)) {
                $asignatura = Asignatura::firstOrCreate(
                    ['nombre_asignatura' => $entrada]
                );
                $ids[] = $asignatura->id_asignatura;
            }
        }

        return $ids;
    }

    public function importar(Request $request)
    {
        $request->validate([
            'excel' => 'required|file|mimes:xlsx,xls,ods'
        ]);

        try {
            Excel::import(new DocentesImport, $request->file('excel'));
            return response()->json(['message' => 'Importación completada.']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al importar el archivo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
