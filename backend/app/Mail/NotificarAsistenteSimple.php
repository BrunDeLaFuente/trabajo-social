<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NotificarAsistenteSimple extends Mailable
{
    use Queueable, SerializesModels;

    public $nombre;
    public $evento;
    public $mensaje;
    public $asunto;

    public function __construct($nombre, $evento, $asunto, $mensaje)
    {
        $this->nombre = $nombre;
        $this->evento = $evento;
        $this->asunto = $asunto;
        $this->mensaje = $mensaje;
    }

    public function build()
    {
        return $this->subject($this->asunto)
            ->view('emails.notificacion_asistente_simple');
    }
}
