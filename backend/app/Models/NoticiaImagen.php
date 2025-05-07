<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class NoticiaImagen extends Model
{
    use HasFactory;

    protected $table = 'noticia_imagen';
    protected $primaryKey = 'id_noticia_imagen';

    protected $fillable = [
        'id_noticia',
        'ruta_imagen_noticia',
    ];

    public function noticia()
    {
        return $this->belongsTo(Noticia::class, 'id_noticia');
    }
}
