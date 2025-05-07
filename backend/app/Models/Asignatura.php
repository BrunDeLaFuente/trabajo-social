<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Asignatura extends Model
{
    use HasFactory;

    protected $table = 'asignatura';
    protected $primaryKey = 'id_asignatura';

    protected $fillable = ['nombre_asignatura'];

    public function docentes()
    {
        return $this->belongsToMany(Persona::class, 'docente_asignatura', 'id_asignatura', 'id_persona');
    }
}
