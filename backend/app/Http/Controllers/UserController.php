<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use App\Mail\NotificarPassword;
use Illuminate\Support\Facades\Mail;
use Illuminate\Http\JsonResponse;

class UserController extends Controller
{
    public function index(): JsonResponse
    {
        $users = User::all();
        return response()->json($users);
    }

    public function indexColaboradores(): JsonResponse
    {
        $colaboradores = User::where('is_admin', false)->get();
        return response()->json($colaboradores);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'celular_user' => 'nullable|digits:8',
            'is_admin' => 'boolean',
            'notificar' => 'boolean'
        ]);

        DB::beginTransaction();

        try {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'celular_user' => $validated['celular_user'],
                'is_admin' => $validated['is_admin'],
            ]);

            if ($request->boolean('notificar')) {
                Mail::to($user->email)->send(new NotificarPassword($user->name, $user->email, $user->is_admin, $request->password));
            }

            DB::commit();
            return response()->json(['message' => 'Colaborador creado exitosamente']);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['error' => 'Error al crear el usuario', 'message' => $e->getMessage()], 500);
        }
    }

    public function update(Request $request, $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'celular_user' => 'nullable|digits:8',
            'is_admin' => 'boolean',
        ]);

        $user->update($validated);

        return response()->json(['message' => 'Usuario actualizado']);
    }

    public function cambiarPassword(Request $request)
    {
        $request->validate([
            'password_actual' => 'required|string',
            'nueva_password' => 'required|string|min:10|confirmed',
        ]);

        $user = auth()->user();

        if (!Hash::check($request->password_actual, $user->password)) {
            return response()->json(['error' => 'La contraseña actual no es válida'], 400);
        }

        $user->password = Hash::make($request->nueva_password);
        $user->save();

        return response()->json(['message' => 'Contraseña actualizada correctamente']);
    }


    public function destroy($id): JsonResponse
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'Usuario eliminado']);
    }
}
