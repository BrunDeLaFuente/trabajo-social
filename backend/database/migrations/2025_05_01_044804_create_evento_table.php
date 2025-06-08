<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('evento', function (Blueprint $table) {
            $table->id('id_evento');
            $table->string('titulo_evento');
            $table->dateTime('fecha_publicacion_evento')->useCurrent();
            $table->dateTime('fecha_evento');
            $table->string('ubicacion');
            $table->enum('modalidad', ['Presencial', 'Virtual']);
            $table->boolean('es_pago')->default(false);
            $table->decimal('costo', 10, 2)->nullable();
            $table->boolean('es_publico')->default(true);
            $table->boolean('formulario')->default(false);
            $table->string('imagen_evento')->nullable();
            $table->string('qr_pago')->nullable();
            $table->string('slug')->unique()->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evento');
    }
};
