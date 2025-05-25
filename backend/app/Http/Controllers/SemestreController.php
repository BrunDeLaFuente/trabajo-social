<?php

namespace App\Http\Controllers;

use App\Models\Semestre;
use Illuminate\Http\Request;
use App\Imports\SemestresImport;
use Maatwebsite\Excel\Facades\Excel;

class SemestreController extends Controller
{
    public function index()
    {
        $semestres = Semestre::with('materias.contenidos')->get();
        return response()->json($semestres);
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_malla' => 'required|exists:malla_curricular,id_malla',
            'numero' => 'required|string|max:50'
        ]);

        $semestre = Semestre::create($request->only('id_malla', 'numero'));
        return response()->json($semestre, 201);
    }

    public function show($id)
    {
        $semestre = Semestre::with('materias.contenidos')->findOrFail($id);
        return response()->json($semestre);
    }

    public function update(Request $request, $id)
    {
        $semestre = Semestre::findOrFail($id);
        $request->validate([
            'numero' => 'required|string|max:50'
        ]);
        $semestre->update($request->only('numero'));
        return response()->json($semestre);
    }

    public function destroy($id)
    {
        $semestre = Semestre::findOrFail($id);
        $semestre->delete();
        return response()->json(['message' => 'Semestre eliminado']);
    }

    public function importar(Request $request)
    {
        $request->validate([
            'excel' => 'required|file|mimes:xlsx,xls,ods'
        ]);

        try {
            Excel::import(new SemestresImport, $request->file('excel'));
            return response()->json(['message' => 'Importación de malla completada.']);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Error al importar el archivo.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
