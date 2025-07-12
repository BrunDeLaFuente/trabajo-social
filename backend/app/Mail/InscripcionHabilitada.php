<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class InscripcionHabilitada extends Mailable
{
    use Queueable, SerializesModels;

    public $nombre;
    public $evento;
    public $fecha_evento;

    public function __construct($nombre, $evento, $fecha_evento)
    {
        $this->nombre = $nombre;
        $this->evento = $evento;
        $this->fecha_evento = $fecha_evento;
    }

    public function build()
    {
        return $this->subject('Tu inscripción ha sido habilitada')
            ->view('emails.inscripcion_habilitada');
    }
}
