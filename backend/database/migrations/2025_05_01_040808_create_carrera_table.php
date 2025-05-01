<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('carrera', function (Blueprint $table) {
            $table->id('id_carrera');
            $table->string('nombre_carrera');
            $table->string('facultad');
            $table->string('duracion', 50);
            $table->string('ensenanza');
            $table->string('idiomas');
            $table->string('grado', 100);
            $table->text('direccion');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('carrera');
    }
};
