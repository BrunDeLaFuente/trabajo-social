<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class NotificarPassword extends Mailable
{
    use Queueable, SerializesModels;

    public $nombre;
    public $correo;
    public $rol;
    public $password;
    public $loginUrl;

    public function __construct($nombre, $correo, $rol, $password)
    {
        $this->nombre = $nombre;
        $this->correo = $correo;
        $this->rol = $rol;
        $this->password = $password;
        $this->loginUrl = 'http://localhost:5173/login';
    }

    public function build()
    {
        return $this->subject('Tus credenciales de acceso')
            ->view('emails.credenciales');
    }
}
