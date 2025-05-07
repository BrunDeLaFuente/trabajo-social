<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CarreraRrss extends Model
{
    use HasFactory;

    protected $table = 'carrera_rrss';
    protected $primaryKey = 'id_carrera_rrss';

    protected $fillable = [
        'id_carrera',
        'nombre_rrss',
        'url_rrss',
        'es_publico',
    ];

    public function carrera()
    {
        return $this->belongsTo(Carrera::class, 'id_carrera');
    }
}
