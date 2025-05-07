<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CarreraCorreo;

class CarreraCorreoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return CarreraCorreo::where('id_carrera', 1)->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate(['correo_carrera' => 'required|email']);
        $correo = CarreraCorreo::create(['id_carrera' => 1, 'correo_carrera' => $request->correo_carrera]);
        return response()->json($correo, 201);
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
        $request->validate(['correo_carrera' => 'required|email']);
        $correo = CarreraCorreo::findOrFail($id);
        $correo->update(['correo_carrera' => $request->correo_carrera]);
        return response()->json($correo);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        CarreraCorreo::destroy($id);
        return response()->json(['message' => 'Correo eliminado correctamente.']);
    }
}
