<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class MallaCurricular extends Model
{
    use HasFactory;

    protected $table = 'malla_curricular';
    protected $primaryKey = 'id_malla';
    protected $fillable = ['imagen', 'archivo_pdf'];

    public function semestres()
    {
        return $this->hasMany(Semestre::class, 'id_malla');
    }
}
