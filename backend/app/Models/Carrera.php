<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Carrera extends Model
{
    use HasFactory;

    protected $primaryKey = 'id_carrera';

    protected $fillable = [
        'nombre_carrera',
        'facultad',
        'duracion',
        'ensenanza',
        'idiomas',
        'grado',
        'direccion',
    ];

    public function correos()
    {
        return $this->hasMany(CarreraCorreo::class, 'id_carrera');
    }

    public function telefonos()
    {
        return $this->hasMany(CarreraTelefono::class, 'id_carrera');
    }

    public function redesSociales()
    {
        return $this->hasMany(CarreraRrss::class, 'id_carrera');
    }
}
