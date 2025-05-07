<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Semestre extends Model
{
    use HasFactory;

    protected $table = 'semestre';
    protected $primaryKey = 'id_semestre';
    protected $fillable = ['id_malla', 'numero'];

    public function malla()
    {
        return $this->belongsTo(MallaCurricular::class, 'id_malla');
    }

    public function materias()
    {
        return $this->hasMany(Materia::class, 'id_semestre');
    }
}
