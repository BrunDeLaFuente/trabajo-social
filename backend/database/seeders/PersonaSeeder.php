<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Persona;
use App\Models\PersonaCorreo;
use App\Models\TipoPersona;
use App\Models\Asignatura;
use App\Models\DocenteAsignatura;

class PersonaSeeder extends Seeder
{
    public function run(): void
    {
        // Tipos de persona
        $autoridad = TipoPersona::where('nombre_tipo', 'Autoridad')->first()->id_tipo_persona;
        $admin = TipoPersona::where('nombre_tipo', 'Administrativo')->first()->id_tipo_persona;
        $docente = TipoPersona::where('nombre_tipo', 'Docente')->first()->id_tipo_persona;

        // 🔹 Autoridades
        $autoridades = [
            [
                'nombre' => 'Dra. Rosario Nina Rocha',
                'cargo' => 'Directora de Carrera',
                'correo' => 'rosario.nina@umss.edu.bo',
            ],
            [
                'nombre' => 'Lic. Hugo Sánchez Gonzales',
                'cargo' => 'Coordinador Académico',
                'correo' => 'hugo.sanchez@umss.edu.bo',
            ],
        ];

        foreach ($autoridades as $a) {
            $persona = Persona::create([
                'id_tipo_persona' => $autoridad,
                'nombre_persona' => $a['nombre'],
                'cargo' => $a['cargo'],
            ]);

            PersonaCorreo::create([
                'id_persona' => $persona->id_persona,
                'email_persona' => $a['correo'],
            ]);
        }

        // 🔹 Personal Administrativo
        $administrativos = [
            [
                'nombre' => 'Lic. Carmen Fernández',
                'cargo' => 'Secretaria Académica',
                'correo' => 'carmen.fernandez@umss.edu.bo',
            ],
            [
                'nombre' => 'Sr. Jorge Méndez',
                'cargo' => 'Auxiliar Administrativo',
                'correo' => 'jorge.mendez@umss.edu.bo',
            ],
        ];

        foreach ($administrativos as $a) {
            $persona = Persona::create([
                'id_tipo_persona' => $admin,
                'nombre_persona' => $a['nombre'],
                'cargo' => $a['cargo'],
            ]);

            PersonaCorreo::create([
                'id_persona' => $persona->id_persona,
                'email_persona' => $a['correo'],
            ]);
        }

        // 🔹 Docentes y asignaturas
        $docentes = [
            [
                'nombre' => 'MSc. Patricia Rodríguez Bilbao',
                'cargo' => 'Docente Titular',
                'correo' => 'patricia.rodriguez@umss.edu.bo',
                'materias' => ['Investigación Social', 'Taller de Intervención'],
            ],
            [
                'nombre' => 'Lic. Juan Pérez López',
                'cargo' => 'Docente',
                'correo' => 'juan.perez@umss.edu.bo',
                'materias' => ['Teoría Social Crítica'],
            ],
            [
                'nombre' => 'Dra. María Luisa Condori',
                'cargo' => 'Docente Investigadora',
                'correo' => 'maria.condori@umss.edu.bo',
                'materias' => ['Antropología Social'],
            ],
        ];

        foreach ($docentes as $d) {
            $persona = Persona::create([
                'id_tipo_persona' => $docente,
                'nombre_persona' => $d['nombre'],
                'cargo' => $d['cargo'],
            ]);

            PersonaCorreo::create([
                'id_persona' => $persona->id_persona,
                'email_persona' => $d['correo'],
            ]);

            foreach ($d['materias'] as $nombreAsig) {
                $asig = Asignatura::where('nombre_asignatura', $nombreAsig)->first();
                if ($asig) {
                    DocenteAsignatura::create([
                        'id_persona' => $persona->id_persona,
                        'id_asignatura' => $asig->id_asignatura,
                    ]);
                }
            }
        }
    }
}
