<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class NoticiaArchivo extends Model
{
    use HasFactory;

    protected $table = 'noticia_archivo';
    protected $primaryKey = 'id_noticia_archivo';

    protected $fillable = [
        'id_noticia',
        'ruta_archivo',
    ];

    public function noticia()
    {
        return $this->belongsTo(Noticia::class, 'id_noticia');
    }

    public function getUrlAttribute()
    {
        return $this->ruta_archivo
            ? url('storage/' . $this->ruta_archivo)
            : null;
    }
}
