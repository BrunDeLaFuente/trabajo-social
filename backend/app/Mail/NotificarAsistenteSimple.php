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

    public function __construct($nombre, $evento, $mensaje)
    {
        $this->nombre = $nombre;
        $this->evento = $evento;
        $this->mensaje = $mensaje;
    }

    public function build()
    {
        return $this->subject("Información sobre el evento: {$this->evento}")
            ->view('emails.notificacion_asistente_simple');
    }
}
