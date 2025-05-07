<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class PersonaCorreo extends Model
{
    use HasFactory;

    protected $table = 'persona_correo';
    protected $primaryKey = 'id_persona_correo';

    protected $fillable = [
        'id_persona',
        'email_persona'
    ];

    public function persona()
    {
        return $this->belongsTo(Persona::class, 'id_persona');
    }
}
