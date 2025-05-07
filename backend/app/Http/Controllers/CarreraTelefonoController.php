<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CarreraTelefono;

class CarreraTelefonoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return CarreraTelefono::where('id_carrera', 1)->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate(['telefono' => 'required|string']);
        $telefono = CarreraTelefono::create(['id_carrera' => 1, 'telefono' => $request->telefono]);
        return response()->json($telefono, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $request->validate(['telefono' => 'required|string']);
        $telefono = CarreraTelefono::findOrFail($id);
        $telefono->update(['telefono' => $request->telefono]);
        return response()->json($telefono);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        CarreraTelefono::destroy($id);
        return response()->json(['message' => 'Teléfono eliminado correctamente.']);
    }
}
