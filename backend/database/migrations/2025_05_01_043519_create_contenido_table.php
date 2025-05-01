<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('contenido', function (Blueprint $table) {
            $table->id('id_contenido');
            $table->unsignedBigInteger('id_materia');
            $table->text('descripcion');
            $table->timestamps();

            $table->foreign('id_materia')
                ->references('id_materia')->on('materia')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('contenido');
    }
};
