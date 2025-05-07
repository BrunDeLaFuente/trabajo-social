<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class CarreraTelefono extends Model
{
    use HasFactory;

    protected $table = 'carrera_telefono';
    protected $primaryKey = 'id_carrera_telefono';

    protected $fillable = [
        'id_carrera',
        'telefono',
    ];

    public function carrera()
    {
        return $this->belongsTo(Carrera::class, 'id_carrera');
    }
}
