<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Expositor extends Model
{
    protected $table = 'expositor';
    protected $primaryKey = 'id_expositor';
    protected $fillable = ['nombre_expositor'];

    public function eventos()
    {
        return $this->belongsToMany(Evento::class, 'evento_expositor', 'id_expositor', 'id_evento');
    }
}
