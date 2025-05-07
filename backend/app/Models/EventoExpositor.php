<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class EventoExpositor extends Model
{
    protected $table = 'evento_expositor';
    protected $primaryKey = 'id_evento_expositor';
    protected $fillable = ['id_evento', 'id_expositor'];
}
