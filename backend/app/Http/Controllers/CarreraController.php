<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Carrera;
use App\Models\CarreraCorreo;
use App\Models\CarreraTelefono;

class CarreraController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     */
    public function show()
    {
        $carrera = Carrera::with(['correos', 'telefonos', 'redesSociales'])->find(1);

        if (!$carrera) {
            return response()->json(['message' => 'Carrera no encontrada'], 404);
        }

        return response()->json($carrera);
    }

    /**
     * Update the specified resource in storage.
     */
    // app/Http/Controllers/CarreraController.php

    public function update(Request $request)
    {
        $carrera = Carrera::findOrFail(1); // Solo hay una carrera

        // ✅ Validar datos principales
        $request->validate([
            'nombre_carrera' => 'required|string',
            'facultad' => 'required|string',
            'duracion' => 'required|string',
            'ensenanza' => 'required|string',
            'idiomas' => 'required|string',
            'grado' => 'required|string',
            'direccion' => 'required|string',
            'correos' => 'array',
            'correos.*.correo_carrera' => 'required|email',
            'telefonos' => 'array',
            'telefonos.*.telefono' => 'required|string|max:20',
        ]);

        // ✅ Actualizar datos de carrera
        $carrera->update($request->only([
            'nombre_carrera',
            'facultad',
            'duracion',
            'ensenanza',
            'idiomas',
            'grado',
            'direccion',
        ]));

        // ✅ Actualizar correos
        CarreraCorreo::where('id_carrera', $carrera->id_carrera)->delete();
        if ($request->has('correos')) {
            foreach ($request->correos as $correo) {
                CarreraCorreo::create([
                    'id_carrera' => $carrera->id_carrera,
                    'correo_carrera' => $correo['correo_carrera'],
                ]);
            }
        }

        // ✅ Actualizar teléfonos
        CarreraTelefono::where('id_carrera', $carrera->id_carrera)->delete();
        if ($request->has('telefonos')) {
            foreach ($request->telefonos as $telefono) {
                CarreraTelefono::create([
                    'id_carrera' => $carrera->id_carrera,
                    'telefono' => $telefono['telefono'],
                ]);
            }
        }

        return response()->json(['message' => 'Carrera actualizada con éxito.']);
    }
    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
