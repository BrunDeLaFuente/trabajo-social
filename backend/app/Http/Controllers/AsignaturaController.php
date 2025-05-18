<?php

namespace App\Http\Controllers;

use App\Models\Asignatura;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class AsignaturaController extends Controller
{
    public function index()
    {
        $asignaturas = Asignatura::select('id_asignatura', 'nombre_asignatura')->get();
        return response()->json($asignaturas);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'nombre_asignatura' => 'required|string|max:255|unique:asignatura,nombre_asignatura',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $asignatura = Asignatura::create([
            'nombre_asignatura' => $request->nombre_asignatura,
        ]);

        return response()->json($asignatura, 201);
    }

    public function show(string $id)
    {
        $asignatura = Asignatura::with('docentes')->find($id);
        if (!$asignatura) {
            return response()->json(['message' => 'Asignatura no encontrada'], 404);
        }

        return response()->json($asignatura);
    }

    public function update(Request $request, string $id)
    {
        $asignatura = Asignatura::find($id);
        if (!$asignatura) {
            return response()->json(['message' => 'Asignatura no encontrada'], 404);
        }

        $validator = Validator::make($request->all(), [
            'nombre_asignatura' => 'required|string|max:255|unique:asignatura,nombre_asignatura,' . $id . ',id_asignatura',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $asignatura->update([
            'nombre_asignatura' => $request->nombre_asignatura,
        ]);

        return response()->json($asignatura);
    }

    public function destroy(string $id)
    {
        $asignatura = Asignatura::find($id);
        if (!$asignatura) {
            return response()->json(['message' => 'Asignatura no encontrada'], 404);
        }

        $asignatura->delete();
        return response()->json(['message' => 'Asignatura eliminada correctamente']);
    }
}
