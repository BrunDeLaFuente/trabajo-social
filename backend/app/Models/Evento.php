<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Evento extends Model
{
    protected $primaryKey = 'id_evento';
    protected $fillable = [
        'titulo_evento',
        'fecha_publicacion_evento',
        'fecha_evento',
        'ubicacion',
        'modalidad',
        'es_pago',
        'costo',
        'es_publico',
        'imagen_evento',
        'qr_pago',
        'slug'
    ];

    public function enlaces()
    {
        return $this->hasMany(Enlace::class, 'id_evento');
    }

    public function expositores()
    {
        return $this->belongsToMany(Expositor::class, 'evento_expositor', 'id_evento', 'id_expositor');
    }

    public function inscripciones()
    {
        return $this->hasMany(Inscripcion::class, 'id_evento');
    }
}
