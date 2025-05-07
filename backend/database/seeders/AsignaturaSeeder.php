<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Asignatura;

class AsignaturaSeeder extends Seeder
{
    public function run(): void
    {
        $asignaturas = [
            'Investigación Social',
            'Taller de Intervención',
            'Teoría Social Crítica',
            'Antropología Social',
        ];

        foreach ($asignaturas as $nombre) {
            Asignatura::firstOrCreate(['nombre_asignatura' => $nombre]);
        }
    }
}
