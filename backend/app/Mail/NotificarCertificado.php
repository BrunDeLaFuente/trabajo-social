<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NotificarCertificado extends Mailable
{
    use Queueable, SerializesModels;

    public $nombre;
    public $evento;
    public $fecha_evento;
    public $asunto;
    public $mensajePersonalizado;

    protected $rutaCertificado;

    public function __construct($nombre, $evento, $fecha_evento, $asunto, $mensajePersonalizado, $rutaCertificado)
    {
        $this->nombre = $nombre;
        $this->evento = $evento;
        $this->fecha_evento = $fecha_evento;
        $this->asunto = $asunto;
        $this->mensajePersonalizado = $mensajePersonalizado;
        $this->rutaCertificado = $rutaCertificado;
    }

    public function build()
    {
        return $this->subject("🎉 {$this->asunto}")
            ->view('emails.certificado_asistente')
            ->attach($this->rutaCertificado, [
                'as' => 'certificado.pdf',
                'mime' => 'application/pdf',
            ]);
    }
}
