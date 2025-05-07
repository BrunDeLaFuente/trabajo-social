<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class TipoPersona extends Model
{
    use HasFactory;

    protected $table = 'tipo_persona';
    protected $primaryKey = 'id_tipo_persona';

    protected $fillable = ['nombre_tipo'];

    public function personas()
    {
        return $this->hasMany(Persona::class, 'id_tipo_persona');
    }
}
