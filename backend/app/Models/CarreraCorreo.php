<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CarreraCorreo extends Model
{
    use HasFactory;

    protected $table = 'carrera_correo';
    protected $primaryKey = 'id_carrera_correo';

    protected $fillable = [
        'id_carrera',
        'correo_carrera',
    ];

    public function carrera()
    {
        return $this->belongsTo(Carrera::class, 'id_carrera');
    }
}
