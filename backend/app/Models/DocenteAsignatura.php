<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class DocenteAsignatura extends Model
{
    use HasFactory;

    protected $table = 'docente_asignatura';
    protected $primaryKey = 'id_doc_asig';

    protected $fillable = [
        'id_persona',
        'id_asignatura',
    ];

    public function persona()
    {
        return $this->belongsTo(Persona::class, 'id_persona');
    }

    public function asignatura()
    {
        return $this->belongsTo(Asignatura::class, 'id_asignatura');
    }
}
