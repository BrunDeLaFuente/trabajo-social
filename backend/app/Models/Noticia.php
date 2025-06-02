<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Noticia extends Model
{
    use HasFactory;

    protected $table = 'noticia';
    protected $primaryKey = 'id_noticia';

    protected $fillable = [
        'titulo_noticia',
        'fecha_publicacion_noticia',
        'autor',
        'contenido',
        'categoria',
        'es_publico',
        'slug',
    ];

    public function imagenes()
    {
        return $this->hasMany(NoticiaImagen::class, 'id_noticia');
    }

    public function videos()
    {
        return $this->hasMany(NoticiaVideo::class, 'id_noticia');
    }

    public function archivos()
    {
        return $this->hasMany(NoticiaArchivo::class, 'id_noticia');
    }
}
