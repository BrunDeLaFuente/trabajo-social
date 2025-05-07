<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use App\Models\Carrera;
use App\Models\CarreraTelefono;
use App\Models\CarreraCorreo;
use App\Models\CarreraRrss;

class CarreraSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear carrera
        $carrera = Carrera::create([
            'nombre_carrera' => 'Trabajo Social',
            'facultad' => 'Humanidades y Ciencias de la Educación.',
            'duracion' => '5 años.',
            'ensenanza' => 'Presencial y Virtual.',
            'idiomas' => 'Español',
            'grado' => 'Licenciatura en Trabajo Social.',
            'direccion' => 'Campus Central U.M.S.S. (Plaza Sucre, acera sud)',
        ]);

        // Teléfonos
        CarreraTelefono::create(['id_carrera' => $carrera->id_carrera, 'telefono' => '+591 4 4544108']);
        CarreraTelefono::create(['id_carrera' => $carrera->id_carrera, 'telefono' => 'Fax: +591 4 4233891']);

        // Correos
        CarreraCorreo::create(['id_carrera' => $carrera->id_carrera, 'correo_carrera' => 'trabajosocial@umss.edu.bo']);

        // Redes sociales
        CarreraRrss::create([
            'id_carrera' => $carrera->id_carrera,
            'nombre_rrss' => 'Facebook',
            'url_rrss' => 'https://www.facebook.com/DireccionDeCarreraDeTrabajoSocial',
            'es_publico' => true,
        ]);

        CarreraRrss::create([
            'id_carrera' => $carrera->id_carrera,
            'nombre_rrss' => 'YouTube',
            'url_rrss' => 'https://www.youtube.com/c/UniversidadMayordeSanSimonOficial',
            'es_publico' => true,
        ]);

        CarreraRrss::create([
            'id_carrera' => $carrera->id_carrera,
            'nombre_rrss' => 'Instagram',
            'url_rrss' => 'https://www.instagram.com/umssboloficial/',
            'es_publico' => true,
        ]);

        CarreraRrss::create([
            'id_carrera' => $carrera->id_carrera,
            'nombre_rrss' => 'X',
            'url_rrss' => 'https://x.com/trabajosocialumss',
            'es_publico' => true,
        ]);

        CarreraRrss::create([
            'id_carrera' => $carrera->id_carrera,
            'nombre_rrss' => 'LinkedIn',
            'url_rrss' => 'https://bo.linkedin.com/school/umssboloficial/',
            'es_publico' => true,
        ]);

        CarreraRrss::create([
            'id_carrera' => $carrera->id_carrera,
            'nombre_rrss' => 'WhatsApp',
            'url_rrss' => 'https://wa.me/59172222222',
            'es_publico' => true,
        ]);

        CarreraRrss::create([
            'id_carrera' => $carrera->id_carrera,
            'nombre_rrss' => 'Telegram',
            'url_rrss' => 'https://t.me/trabajosocial_umss',
            'es_publico' => true,
        ]);
    }
}
