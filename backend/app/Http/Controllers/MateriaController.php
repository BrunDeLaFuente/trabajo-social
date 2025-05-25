<?php

namespace App\Http\Controllers;

use App\Models\Materia;
use Illuminate\Http\Request;

class MateriaController extends Controller
{
    public function index()
    {
        $materias = Materia::with('contenidos')->get();
        return response()->json($materias);
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_semestre' => 'required|exists:semestre,id_semestre',
            'nombre_materia' => 'required|string|max:255',
            'codigo_materia' => 'required|string|max:50|unique:materia,codigo_materia',
        ]);

        $materia = Materia::create($request->only('id_semestre', 'nombre_materia', 'codigo_materia'));
        return response()->json($materia, 201);
    }

    public function show($id)
    {
        $materia = Materia::with('contenidos')->findOrFail($id);
        return response()->json($materia);
    }

    public function update(Request $request, $id)
    {
        $materia = Materia::findOrFail($id);
        $request->validate([
            'nombre_materia' => 'required|string|max:255',
            'codigo_materia' => 'required|string|max:50|unique:materia,codigo_materia,' . $id . ',id_materia',
        ]);

        $materia->update($request->only('nombre_materia', 'codigo_materia'));
        return response()->json($materia);
    }

    public function destroy($id)
    {
        $materia = Materia::findOrFail($id);
        $materia->delete();
        return response()->json(['message' => 'Materia eliminada']);
    }
}
