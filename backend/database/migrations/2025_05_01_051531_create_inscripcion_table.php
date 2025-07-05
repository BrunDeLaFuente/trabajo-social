<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('inscripcion', function (Blueprint $table) {
            $table->id('id_inscripcion');
            $table->unsignedBigInteger('id_asistente');
            $table->unsignedBigInteger('id_evento');
            $table->dateTime('fecha_registro')->useCurrent();
            $table->string('email_inscripcion')->nullable();
            $table->char('celular_inscripcion', 8)->nullable();
            $table->string('comprobante_pago')->nullable();
            $table->boolean('certificado_entregado')->default(false);
            $table->boolean('entrada')->default(false);
            $table->boolean('salida')->default(false);
            $table->timestamps();

            $table->foreign('id_asistente')->references('id_asistente')->on('asistente')->onDelete('cascade');
            $table->foreign('id_evento')->references('id_evento')->on('evento')->onDelete('cascade');
            $table->unique(['id_asistente', 'id_evento']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('inscripcion');
    }
};
