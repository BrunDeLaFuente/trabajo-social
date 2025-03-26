<?php

namespace App\Exceptions;

use Illuminate\Foundation\Exceptions\Handler as ExceptionHandler;
use Throwable;
use Symfony\Component\HttpKernel\Exception\UnauthorizedHttpException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\TokenInvalidException;
use PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException;

class Handler extends ExceptionHandler
{
    /**
     * The list of the inputs that are never flashed to the session on validation exceptions.
     *
     * @var array<int, string>
     */
    protected $dontFlash = [
        'current_password',
        'password',
        'password_confirmation',
    ];

    /**
     * Register the exception handling callbacks for the application.
     */
    public function register(): void
    {
        $this->reportable(function (Throwable $e) {
            //
        });
    }

    /**
     * Personaliza la respuesta para errores JWT
     */
    public function render($request, Throwable $exception)
    {
        if ($exception instanceof UnauthorizedHttpException) {
            $previous = $exception->getPrevious();

            if ($previous instanceof TokenExpiredException) {
                return response()->json(['error' => 'El token ha expirado'], 401);
            }

            if ($previous instanceof TokenInvalidException) {
                return response()->json(['error' => 'Token inválido'], 401);
            }

            if ($previous instanceof JWTException) {
                return response()->json(['error' => 'Token no encontrado'], 401);
            }

            return response()->json(['error' => 'No autorizado'], 401);
        }

        return parent::render($request, $exception);
    }
}
