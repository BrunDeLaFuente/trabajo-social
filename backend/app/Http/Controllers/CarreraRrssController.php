<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CarreraRrss;

class CarreraRrssController extends Controller
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
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $request->validate([
            'redes_sociales' => 'required|array',
            'redes_sociales.*.id_carrera_rrss' => 'required|integer|exists:carrera_rrss,id_carrera_rrss',
            'redes_sociales.*.url_rrss' => 'required|url',
            'redes_sociales.*.es_publico' => 'required|boolean',
        ]);

        foreach ($request->redes_sociales as $rrssData) {
            $rrss = CarreraRrss::find($rrssData['id_carrera_rrss']);
            if ($rrss) {
                $rrss->update([
                    'url_rrss' => $rrssData['url_rrss'],
                    'es_publico' => $rrssData['es_publico'],
                ]);
            }
        }

        return response()->json(['message' => 'Redes sociales actualizadas con éxito.']);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
