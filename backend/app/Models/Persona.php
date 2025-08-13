<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Persona extends Model
{
    use HasFactory;

    protected $table = 'persona';
    protected $primaryKey = 'id_persona';

    protected $fillable = [
        'id_tipo_persona',
        'nombre_persona',
        'cargo',
        'imagen_persona'
    ];

    public function tipo()
    {
        return $this->belongsTo(TipoPersona::class, 'id_tipo_persona');
    }

    public function correos()
    {
        return $this->hasMany(PersonaCorreo::class, 'id_persona');
    }

    public function asignaturas()
    {
        return $this->belongsToMany(Asignatura::class, 'docente_asignatura', 'id_persona', 'id_asignatura');
    }

    public function getImagenPersonaUrlAttribute()
    {
        return $this->imagen_persona
            ? asset('assets/' . $this->imagen_persona)
            : null;
    }
}
