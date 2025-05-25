<?php

namespace App\Imports;

use App\Models\MallaCurricular;
use App\Models\Semestre;
use App\Models\Materia;
use App\Models\Contenido;
use Illuminate\Support\Collection;
use Maatwebsite\Excel\Concerns\ToCollection;

class SemestresImport implements ToCollection
{
    public function collection(Collection $rows)
    {
        $malla = MallaCurricular::first();
        if (!$malla) return;

        // Borrar semestres previos
        Semestre::where('id_malla', $malla->id_malla)->delete();

        $semestreActual = null;

        foreach ($rows as $index => $row) {
            if ($index === 0) continue;

            $semestreNombre = trim($row[0] ?? '');
            $materiaNombre = trim($row[1] ?? '');
            $codigo = trim($row[2] ?? '');
            $contenidosTexto = trim($row[3] ?? '');

            // Nueva fila de semestre
            if (!empty($semestreNombre)) {
                $semestreActual = Semestre::create([
                    'id_malla' => $malla->id_malla,
                    'numero' => $semestreNombre,
                ]);
            }

            if (!$semestreActual || !$materiaNombre) continue;

            $materia = Materia::create([
                'id_semestre' => $semestreActual->id_semestre,
                'nombre_materia' => $materiaNombre,
                'codigo_materia' => $codigo ?: null,
            ]);

            // Procesar contenidos separados por coma
            if (!empty($contenidosTexto)) {
                $contenidos = explode(',', $contenidosTexto);
                foreach ($contenidos as $contenido) {
                    $contenido = trim($contenido);
                    if ($contenido) {
                        Contenido::create([
                            'id_materia' => $materia->id_materia,
                            'descripcion' => $contenido,
                        ]);
                    }
                }
            }
        }
    }
}
