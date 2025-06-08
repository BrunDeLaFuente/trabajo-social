<?php

namespace App\Http\Controllers;

use App\Models\Asistente;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Http\JsonResponse;

class AsistenteController extends Controller
{
    public function index(): JsonResponse
    {
        $asistentes = Asistente::all();
        return response()->json($asistentes);
    }

    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'nombre_asistente' => 'required|string|max:255',
            'ci' => 'required|string|max:20|unique:asistente',
        ]);

        DB::beginTransaction();
        try {
            $asistente = Asistente::create($request->only('nombre_asistente', 'ci'));
            DB::commit();
            return response()->json(['message' => 'Asistente creado correctamente', 'data' => $asistente]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al crear asistente', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        $asistente = Asistente::findOrFail($id);

        $request->validate([
            'nombre_asistente' => 'required|string|max:255',
            'ci' => 'required|string|unique:asistente,ci,' . $asistente->id_asistente . ',id_asistente',
        ]);

        DB::beginTransaction();
        try {
            $asistente->update($request->only('nombre_asistente', 'ci'));
            DB::commit();
            return response()->json(['message' => 'Asistente actualizado', 'data' => $asistente]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al actualizar asistente', 'message' => $e->getMessage()], 500);
        }
    }

    public function destroy($id): JsonResponse
    {
        DB::beginTransaction();
        try {
            $asistente = Asistente::findOrFail($id);
            $asistente->delete();
            DB::commit();
            return response()->json(['message' => 'Asistente eliminado']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al eliminar asistente', 'message' => $e->getMessage()], 500);
        }
    }
}
