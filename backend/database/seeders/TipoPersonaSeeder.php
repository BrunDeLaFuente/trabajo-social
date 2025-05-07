<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\TipoPersona;

class TipoPersonaSeeder extends Seeder
{
    public function run(): void
    {
        $tipos = ['Autoridad', 'Administrativo', 'Docente'];

        foreach ($tipos as $tipo) {
            TipoPersona::firstOrCreate(['nombre_tipo' => $tipo]);
        }
    }
}
