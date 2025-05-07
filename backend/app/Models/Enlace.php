<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Enlace extends Model
{
    protected $primaryKey = 'id_enlace';
    protected $fillable = ['id_evento', 'plataforma', 'url_enlace', 'password_enlace'];

    public function evento()
    {
        return $this->belongsTo(Evento::class, 'id_evento');
    }
}
