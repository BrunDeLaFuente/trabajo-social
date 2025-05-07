<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class NoticiaVideo extends Model
{
    use HasFactory;

    protected $table = 'noticia_video';
    protected $primaryKey = 'id_noticia_video';

    protected $fillable = [
        'id_noticia',
        'ruta_video_noticia',
    ];

    public function noticia()
    {
        return $this->belongsTo(Noticia::class, 'id_noticia');
    }
}
