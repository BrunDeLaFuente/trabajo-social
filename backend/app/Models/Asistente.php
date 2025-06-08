<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Asistente extends Model
{
    protected $table = 'asistente';
    protected $primaryKey = 'id_asistente';
    protected $fillable = ['nombre_asistente', 'ci'];

    public function inscripciones()
    {
        return $this->hasMany(Inscripcion::class, 'id_asistente');
    }
}
