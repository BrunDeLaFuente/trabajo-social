<?php

namespace App\Http\Controllers;

use App\Models\Evento;
use App\Models\Asistente;
use App\Models\Inscripcion;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Mail\InscripcionHabilitada;
use Illuminate\Support\Facades\Mail;

class InscripcionController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    public function getEventoConInscripciones($id): JsonResponse
    {
        try {
            $evento = Evento::with([
                'enlaces',
                'expositores',
                'inscripciones.asistente'
            ])
                ->findOrFail($id);

            // Agregar URLs de las imágenes
            $evento->append('imagen_evento_url', 'qr_pago_url');

            return response()->json([
                'message' => 'Evento encontrado',
                'evento' => $evento
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Error al obtener el evento',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request, $id_evento): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nombre_asistente' => 'required|string|max:255',
            'ci' => 'required|digits_between:6,20',
            'email_inscripcion' => 'nullable|email|max:255',
            'celular_inscripcion' => 'nullable|digits_between:7,10',
            'comprobante_pago' => 'nullable|image|max:5120', // 5MB
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            // Buscar o crear asistente
            $asistente = Asistente::firstOrCreate(
                ['ci' => $request->ci],
                ['nombre_asistente' => $request->nombre_asistente]
            );

            $yaInscrito = Inscripcion::where('id_evento', $id_evento)
                ->where('id_asistente', $asistente->id_asistente)
                ->exists();

            if ($yaInscrito) {
                return response()->json([
                    'error' => 'El asistente ya está inscrito en este evento.'
                ], 409); // 409 Conflict
            }

            // Crear inscripción
            $inscripcion = new Inscripcion([
                'id_asistente' => $asistente->id_asistente,
                'id_evento' => $id_evento,
                'email_inscripcion' => $request->email_inscripcion,
                'celular_inscripcion' => $request->celular_inscripcion,
                'habilitado' => true,
                'certificado_entregado' => false,
                'entrada' => false,
                'salida' => false,
            ]);

            $inscripcion->save();

            // Guardar comprobante si se envió
            if ($request->hasFile('comprobante_pago')) {
                $ruta = "private/comprobantes/{$inscripcion->id_inscripcion}";
                $archivo = $request->file('comprobante_pago')->store($ruta);
                $inscripcion->comprobante_pago = $archivo;
                $inscripcion->save();
            }

            DB::commit();
            return response()->json([
                'message' => 'Inscripción registrada correctamente',
                'inscripcion' => $inscripcion
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Error al registrar la inscripción',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function storePublic(Request $request, $id_evento): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'nombre_asistente'   => 'required|string|max:255',
            'ci'                 => 'required|digits_between:6,20',
            'email_inscripcion'  => 'nullable|email|max:255',
            'celular_inscripcion' => 'nullable|digits_between:7,10',
            'comprobante_pago'   => 'nullable|image|max:5120', // 5MB
            'texto_ocr'          => 'nullable|string',
            'monto'              => 'nullable|numeric',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        DB::beginTransaction();
        try {
            $evento = Evento::findOrFail($id_evento);

            // Buscar o crear asistente
            $asistente = Asistente::firstOrCreate(
                ['ci' => $request->ci],
                ['nombre_asistente' => $request->nombre_asistente]
            );

            // Verificar si ya existe la inscripción
            $inscripcionExistente = Inscripcion::where('id_evento', $id_evento)
                ->where('id_asistente', $asistente->id_asistente)
                ->first();

            if ($inscripcionExistente) {
                return response()->json([
                    'message' => 'Ya estás inscrito en este evento. Si tienes dudas, comunícate con nosotros desde la sección de contacto.'
                ], 200);
            }

            // Nueva inscripción
            $inscripcion = new Inscripcion([
                'id_asistente'        => $asistente->id_asistente,
                'id_evento'           => $id_evento,
                'email_inscripcion'   => $request->email_inscripcion,
                'celular_inscripcion' => $request->celular_inscripcion,
                'habilitado'          => false, // por defecto
                'certificado_entregado' => false,
                'entrada'             => false,
                'salida'              => false,
            ]);

            $inscripcion->save();

            // Procesar comprobante si se envía
            if ($request->hasFile('comprobante_pago')) {
                // Guardar comprobante
                $ruta = "private/comprobantes/{$inscripcion->id_inscripcion}";
                $archivo = $request->file('comprobante_pago')->store($ruta);
                $inscripcion->comprobante_pago = $archivo;

                // Determinar el monto a comparar
                $montoDetectado = $request->monto;
                if (!$montoDetectado && $request->filled('texto_ocr')) {
                    $montoDetectado = $this->extraerMontoDesdeTexto($request->texto_ocr);
                }

                // Validar el monto
                if ($montoDetectado && (float)$montoDetectado === (float)$evento->costo) {
                    $inscripcion->habilitado = true;

                    // Notificar solo si tiene correo
                    if ($inscripcion->email_inscripcion) {
                        Mail::to($inscripcion->email_inscripcion)->send(new InscripcionHabilitada(
                            $asistente->nombre_asistente,
                            $evento->titulo_evento,
                            $evento->fecha_evento
                        ));
                    }
                } else {
                    // Monto incorrecto, no habilitar ni notificar
                    $inscripcion->habilitado = false;
                }
            } else {
                // Evento gratuito: habilitar e informar
                $inscripcion->habilitado = true;

                if ($inscripcion->email_inscripcion) {
                    Mail::to($inscripcion->email_inscripcion)->send(new InscripcionHabilitada(
                        $asistente->nombre_asistente,
                        $evento->titulo_evento,
                        $evento->fecha_evento
                    ));
                }
            }

            $inscripcion->save();
            DB::commit();

            return response()->json([
                'message' => '¡Inscripción realizada exitosamente! Recibirás un correo de confirmación.',
                'inscripcion' => $inscripcion->load('asistente')
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Error al procesar la inscripción',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    private function extraerMontoDesdeTexto(string $texto_ocr): ?float
    {
        // Normalizamos el texto a minúsculas para buscar
        $texto = strtolower($texto_ocr);

        // Patrones de búsqueda comunes para monto
        $patrones = [
            '/la suma de bs\.\s*([\d,.]+)/i',
            '/monto\s*[:]\s*bs?\.\s*([\d,.]+)/i',
            '/monto a transferir\s*[:]\s*bs?\.\s*([\d,.]+)/i',
            '/pag[oó]\s*bs\.\s*([\d,.]+)/i',
            '/importe pagado\s*bs?\.\s*([\d,.]+)/i',
            '/bs\.\s*([\d,.]+)/i',
        ];

        foreach ($patrones as $patron) {
            if (preg_match($patron, $texto, $matches)) {
                $monto = str_replace(',', '.', $matches[1]); // Reemplazar coma por punto
                return (float) $monto;
            }
        }

        // Si no encontró nada
        return null;
    }


    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */

    public function update(Request $request, $id): JsonResponse
    {
        $request->validate([
            'nombre_asistente' => 'required|string|max:255',
            'ci' => 'required|digits_between:6,20',
            'email_inscripcion' => 'nullable|email|max:255',
            'celular_inscripcion' => 'nullable|string|max:15',
            'habilitado' => 'boolean',
            'certificado_entregado' => 'boolean',
            'entrada' => 'boolean',
            'salida' => 'boolean',
        ]);

        DB::beginTransaction();

        try {
            $inscripcion = Inscripcion::findOrFail($id);
            $evento_id = $inscripcion->id_evento;

            // Buscar o crear asistente
            $asistente = Asistente::firstOrCreate(
                ['ci' => $request->ci],
                ['nombre_asistente' => $request->nombre_asistente]
            );

            // Verificar si se está intentando cambiar a otro asistente ya inscrito en este evento
            $existeInscripcion = Inscripcion::where('id_evento', $evento_id)
                ->where('id_asistente', $asistente->id_asistente)
                ->where('id_inscripcion', '!=', $inscripcion->id_inscripcion)
                ->exists();

            if ($existeInscripcion) {
                return response()->json([
                    'error' => 'El nuevo asistente ya está inscrito en este evento.'
                ], 409);
            }

            // Actualizar nombre si es diferente
            if (!$asistente->wasRecentlyCreated && $asistente->nombre_asistente !== $request->nombre_asistente) {
                $asistente->nombre_asistente = $request->nombre_asistente;
                $asistente->save();
            }

            // Guardamos el estado anterior de "habilitado"
            $habilitadoAnterior = $inscripcion->habilitado;

            // Actualizar inscripción
            $inscripcion->update([
                'id_asistente' => $asistente->id_asistente,
                'email_inscripcion' => $request->email_inscripcion,
                'celular_inscripcion' => $request->celular_inscripcion,
                'habilitado' => $request->boolean('habilitado'),
                'certificado_entregado' => $request->boolean('certificado_entregado'),
                'entrada' => $request->boolean('entrada'),
                'salida' => $request->boolean('salida'),
            ]);

            // Si habilitado pasa de false a true, enviar correo
            if (!$habilitadoAnterior && $inscripcion->habilitado) {
                if ($inscripcion->email_inscripcion) {
                    Mail::to($inscripcion->email_inscripcion)->send(new InscripcionHabilitada(
                        $asistente->nombre_asistente,
                        $inscripcion->evento->titulo_evento,
                        $inscripcion->evento->fecha_evento
                    ));
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Inscripción actualizada correctamente',
                'data' => $inscripcion->load('asistente')
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'error' => 'Error al actualizar la inscripción',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): JsonResponse
    {
        DB::beginTransaction();

        try {
            $inscripcion = Inscripcion::findOrFail($id);

            // Eliminar carpeta del comprobante si existe
            if ($inscripcion->comprobante_pago && Storage::exists($inscripcion->comprobante_pago)) {
                $directorio = dirname($inscripcion->comprobante_pago);
                Storage::deleteDirectory($directorio);
            }

            $inscripcion->delete();

            DB::commit();

            return response()->json(['message' => 'Inscripción eliminada correctamente']);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'error' => 'Error al eliminar la inscripción',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function obtenerComprobante($id)
    {
        $inscripcion = Inscripcion::findOrFail($id);

        if (!$inscripcion->comprobante_pago || !Storage::exists($inscripcion->comprobante_pago)) {
            abort(404, 'Comprobante no encontrado');
        }

        return response()->file(storage_path('app/' . $inscripcion->comprobante_pago));
    }
}
