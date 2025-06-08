<?php

namespace App\Http\Controllers;

use App\Models\Expositor;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class ExpositorController extends Controller
{
    public function index(): JsonResponse
    {
        $expositores = Expositor::all();
        return response()->json($expositores);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nombre_expositor' => 'required|string|max:255|unique:expositor',
        ]);

        DB::beginTransaction();
        try {
            $expositor = Expositor::create($request->only('nombre_expositor'));
            DB::commit();
            return response()->json(['message' => 'Expositor creado correctamente', 'data' => $expositor]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al crear expositor', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        $expositor = Expositor::findOrFail($id);

        $request->validate([
            'nombre_expositor' => 'required|string|max:255|unique:expositor,nombre_expositor,' . $expositor->id_expositor . ',id_expositor',
        ]);

        DB::beginTransaction();
        try {
            $expositor->update($request->only('nombre_expositor'));
            DB::commit();
            return response()->json(['message' => 'Expositor actualizado', 'data' => $expositor]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al actualizar expositor', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $expositor = Expositor::findOrFail($id);
            $expositor->delete();
            DB::commit();
            return response()->json(['message' => 'Expositor eliminado']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al eliminar expositor', 'message' => $e->getMessage()], 500);
        }
    }
}
