<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\MallaCurricular;
use App\Models\Semestre;
use App\Models\Materia;
use App\Models\Contenido;

class MallaCurricularSeeder extends Seeder
{
    public function run()
    {
        // Crear malla vacía (sin imagen ni PDF)
        $malla = MallaCurricular::create([
            'imagen' => null,
            'archivo_pdf' => null,
        ]);

        $mallaData = [
            [
                'numero' => 'Primer semestre',
                'materias' => [
                    [
                        'nombre_materia' => 'Álgebra I',
                        'codigo_materia' => 'TS101',
                        'contenido' => [
                            'Lógica y conjuntos.',
                            'Relaciones y funciones.',
                            'Geometría analítica en el plano.',
                        ],
                    ],
                    [
                        'nombre_materia' => 'Dibujo Técnico',
                        'codigo_materia' => 'TS102',
                        'contenido' => [],
                    ],
                    [
                        'nombre_materia' => 'Cálculo I',
                        'codigo_materia' => 'TS103',
                        'contenido' => [],
                    ],
                ],
            ],
            [
                'numero' => 'Segundo semestre',
                'materias' => [
                    [
                        'nombre_materia' => 'Geometría Descriptiva',
                        'codigo_materia' => 'TS201',
                        'contenido' => [],
                    ],
                    [
                        'nombre_materia' => 'Álgebra II',
                        'codigo_materia' => 'TS202',
                        'contenido' => [
                            'Álgebra Lineal',
                            'Álgebra Matricial',
                            'Teoría Matricial',
                        ],
                    ],
                ],
            ],
        ];

        foreach ($mallaData as $semestreData) {
            $semestre = Semestre::create([
                'id_malla' => $malla->id_malla,
                'numero' => $semestreData['numero'],
            ]);

            foreach ($semestreData['materias'] as $materiaData) {
                $materia = Materia::create([
                    'id_semestre' => $semestre->id_semestre,
                    'nombre_materia' => $materiaData['nombre_materia'],
                    'codigo_materia' => $materiaData['codigo_materia'],
                ]);

                foreach ($materiaData['contenido'] as $descripcion) {
                    Contenido::create([
                        'id_materia' => $materia->id_materia,
                        'descripcion' => $descripcion,
                    ]);
                }
            }
        }
    }
}
