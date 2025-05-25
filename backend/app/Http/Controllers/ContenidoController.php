<?php

namespace App\Http\Controllers;

use App\Models\Contenido;
use Illuminate\Http\Request;

class ContenidoController extends Controller
{
    public function index()
    {
        return response()->json(Contenido::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'id_materia' => 'required|exists:materia,id_materia',
            'descripcion' => 'required|string',
        ]);

        $contenido = Contenido::create($request->only('id_materia', 'descripcion'));
        return response()->json($contenido, 201);
    }

    public function show($id)
    {
        return response()->json(Contenido::findOrFail($id));
    }

    public function update(Request $request, $id)
    {
        $contenido = Contenido::findOrFail($id);
        $request->validate([
            'descripcion' => 'required|string',
        ]);

        $contenido->update($request->only('descripcion'));
        return response()->json($contenido);
    }

    public function destroy($id)
    {
        $contenido = Contenido::findOrFail($id);
        $contenido->delete();
        return response()->json(['message' => 'Contenido eliminado']);
    }
}
