<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Inscripcion extends Model
{
    protected $table = 'inscripcion';
    protected $primaryKey = 'id_inscripcion';
    protected $fillable = [
        'id_asistente',
        'id_evento',
        'fecha_registro',
        'email_inscripcion',
        'celular_inscripcion',
        'comprobante_pago',
        'habilitado',
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

    protected static function booted()
    {
        static::deleting(function ($inscripcion) {
            if ($inscripcion->comprobante_pago && Storage::exists($inscripcion->comprobante_pago)) {
                // Borrar la carpeta completa donde está el comprobante
                $directorio = dirname($inscripcion->comprobante_pago);
                Storage::deleteDirectory($directorio);
            }
        });
    }
}
