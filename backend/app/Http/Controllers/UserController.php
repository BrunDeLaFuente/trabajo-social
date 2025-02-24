<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    /**
     * Obtener todos los usuarios
     */
    public function index(): JsonResponse
    {
        $users = User::all();
        return response()->json($users);
    }
}
