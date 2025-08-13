<?php

namespace App\Imports;

use App\Models\Persona;
use App\Models\PersonaCorreo;
use App\Models\DocenteAsignatura;
use App\Models\Asignatura;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\File;
use Maatwebsite\Excel\Concerns\ToCollection;

class DocentesImport implements ToCollection
{
    public function collection(Collection $rows)
    {

        $docentes = Persona::where('id_tipo_persona', 3)->get();

        foreach ($docentes as $docente) {

            $ruta = public_path("assets/personas/{$docente->id_persona}");
            if (File::exists($ruta)) {
                File::deleteDirectory($ruta);
            }

            $docente->delete();
        }

        foreach ($rows as $index => $row) {
            // Saltar fila de encabezado
            if ($index === 0) continue;

            $nombre = trim($row[0] ?? '');
            $cargo = trim($row[1] ?? '');
            $correos = isset($row[2]) ? explode(',', $row[2]) : [];
            $asignaturas = isset($row[3]) ? explode(',', $row[3]) : [];

            if (empty($nombre)) continue;

            // Si ya existe un docente con ese nombre, ignorar
            if (Persona::where('nombre_persona', $nombre)->whereHas('tipo', fn($q) => $q->where('nombre_tipo', 'Docente'))->exists()) {
                continue;
            }

            // Crear el docente
            $persona = Persona::create([
                'id_tipo_persona' => 3, // Docente
                'nombre_persona' => $nombre,
                'cargo' => $cargo ?: 'Docente',
            ]);

            // Guardar correos
            foreach ($correos as $correo) {
                $correo = trim($correo);
                if (filter_var($correo, FILTER_VALIDATE_EMAIL)) {
                    PersonaCorreo::create([
                        'id_persona' => $persona->id_persona,
                        'email_persona' => $correo
                    ]);
                }
            }

            // Procesar asignaturas
            foreach ($asignaturas as $nombreAsignatura) {
                $nombreAsignatura = trim($nombreAsignatura);
                if (!$nombreAsignatura) continue;

                $asignatura = Asignatura::firstOrCreate(['nombre_asignatura' => $nombreAsignatura]);

                DocenteAsignatura::create([
                    'id_persona' => $persona->id_persona,
                    'id_asignatura' => $asignatura->id_asignatura
                ]);
            }
        }
    }
}
