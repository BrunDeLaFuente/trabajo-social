<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Tramite;

class TramitesSeeder extends Seeder
{
    public function run()
    {
        $tramitesData = [
            [
                'titulo_tramite' => 'Requisitos para Aprobación del Perfil',
                'descripcion_tramite' => 'Carta de solicitud dirigida al director de Carrera, aprobación de perfil con mención, modalidad de titulación y título del trabajo.',
                'planilla_url' => null,
            ],
            [
                'titulo_tramite' => 'Requisitos para solicitud de Designación de Tribunales',
                'descripcion_tramite' => 'Carta de solicitud dirigida al director de Carrera, indicando disponibilidad de tribunales y tutores.',
                'planilla_url' => null,
            ],
            [
                'titulo_tramite' => 'Requisitos para solicitud de Pre Defensa',
                'descripcion_tramite' => 'Carta de solicitud de pre defensa con aprobación de borradores, tabla de disponibilidad de tribunales, carátula y kardex actualizado.',
                'planilla_url' => null,
            ],
            [
                'titulo_tramite' => 'Requisitos para solicitud de Defensa Pública',
                'descripcion_tramite' => 'Carta de solicitud de defensa pública con fotocopia de carnet, formulario de solvencia y acta de pre defensa.',
                'planilla_url' => null,
            ],
        ];

        foreach ($tramitesData as $data) {
            Tramite::create($data);
        }
    }
}
