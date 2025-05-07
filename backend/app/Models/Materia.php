<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Materia extends Model
{
    use HasFactory;

    protected $table = 'materia';
    protected $primaryKey = 'id_materia';
    protected $fillable = ['id_semestre', 'nombre_materia', 'codigo_materia'];

    public function semestre()
    {
        return $this->belongsTo(Semestre::class, 'id_semestre');
    }

    public function contenidos()
    {
        return $this->hasMany(Contenido::class, 'id_materia');
    }
}
