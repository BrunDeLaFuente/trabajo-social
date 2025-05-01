<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('materia', function (Blueprint $table) {
            $table->id('id_materia');
            $table->unsignedBigInteger('id_semestre');
            $table->string('nombre_materia', 255);
            $table->string('codigo_materia', 50)->unique();
            $table->timestamps();

            $table->foreign('id_semestre')->references('id_semestre')->on('semestre')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('materia');
    }
};
