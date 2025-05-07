<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Contenido extends Model
{
    use HasFactory;

    protected $table = 'contenido';
    protected $primaryKey = 'id_contenido';
    protected $fillable = ['id_materia', 'descripcion'];

    public function materia()
    {
        return $this->belongsTo(Materia::class, 'id_materia');
    }
}
