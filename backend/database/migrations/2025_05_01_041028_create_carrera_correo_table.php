<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('carrera_correo', function (Blueprint $table) {
            $table->id('id_carrera_correo');
            $table->unsignedBigInteger('id_carrera');
            $table->string('correo_carrera', 255);
            $table->timestamps();

            $table->foreign('id_carrera')
                ->references('id_carrera')
                ->on('carrera')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carrera_correo');
    }
};
