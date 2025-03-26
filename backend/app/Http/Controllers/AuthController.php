<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use PHPOpenSourceSaver\JWTAuth\Facades\JWTAuth;
use App\Models\RefreshToken;
use Carbon\Carbon;
use Illuminate\Support\Str;


class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->only('email', 'password');

        if (!$token = JWTAuth::attempt($credentials)) {
            return response()->json(['error' => 'Credenciales incorrectas'], 401);
        }

        $refreshToken = Str::random(60);
        //$expiresAt = Carbon::now()->addDays(7); 
        $expiresAt = Carbon::now()->addMinutes(4);

        RefreshToken::create([
            'user_id' => Auth::id(),
            'token' => hash('sha256', $refreshToken),
            'expires_at' => $expiresAt,
        ]);

        return response()->json([
            'user' => Auth::user(),
            'token' => $token,
            'refresh_token' => $refreshToken,
        ]);
    }

    public function logout(Request $request)
    {
        RefreshToken::where('user_id', Auth::id())->delete();
        JWTAuth::invalidate(JWTAuth::getToken());

        return response()->json(['message' => 'Sesión cerrada correctamente']);
    }

    public function getUser(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            return response()->json($user);
        } catch (\PHPOpenSourceSaver\JWTAuth\Exceptions\TokenExpiredException $e) {
            return response()->json(['error' => 'El token ha expirado'], 401);
        } catch (\PHPOpenSourceSaver\JWTAuth\Exceptions\TokenInvalidException $e) {
            return response()->json(['error' => 'Token inválido'], 401);
        } catch (\PHPOpenSourceSaver\JWTAuth\Exceptions\JWTException $e) {
            return response()->json(['error' => 'Token no encontrado'], 401);
        }
    }

    public function refreshToken(Request $request)
    {
        $providedToken = $request->refresh_token;

        $hashedToken = hash('sha256', $providedToken);
        $refresh = RefreshToken::where('token', $hashedToken)->first();

        if (!$refresh || $refresh->expires_at->isPast()) {
            return response()->json(['error' => 'Token de refresco inválido'], 401);
        }

        $user = $refresh->user;

        // Generar nuevo JWT
        $newToken = JWTAuth::fromUser($user);

        return response()->json([
            'token' => $newToken
        ]);
    }
}
