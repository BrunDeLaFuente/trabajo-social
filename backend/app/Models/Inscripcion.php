<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Inscripcion extends Model
{
    protected $primaryKey = 'id_inscripcion';
    protected $fillable = [
        'id_asistente',
        'id_evento',
        'fecha_registro',
        'email_inscripcion',
        'celular_inscripcion',
        'comprobante_pago',
        'certificado_entregado',
        'entrada',
        'salida'
    ];

    public function asistente()
    {
        return $this->belongsTo(Asistente::class, 'id_asistente');
    }

    public function evento()
    {
        return $this->belongsTo(Evento::class, 'id_evento');
    }
}
