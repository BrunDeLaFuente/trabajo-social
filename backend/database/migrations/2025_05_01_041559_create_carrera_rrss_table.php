<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{

    public function up(): void
    {
        Schema::create('carrera_rrss', function (Blueprint $table) {
            $table->id('id_carrera_rrss');
            $table->unsignedBigInteger('id_carrera');
            $table->string('nombre_rrss', 100)->unique();
            $table->string('url_rrss', 500);
            $table->boolean('es_publico')->default(true);
            $table->timestamps();

            $table->foreign('id_carrera')->references('id_carrera')->on('carrera')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('carrera_rrss');
    }
};
