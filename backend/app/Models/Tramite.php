<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Tramite extends Model
{
    protected $table = 'tramite';

    protected $primaryKey = 'id_tramite';

    protected $fillable = [
        'titulo_tramite',
        'descripcion_tramite',
        'planilla_url',
    ];
}
