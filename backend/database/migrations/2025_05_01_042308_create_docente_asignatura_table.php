<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('docente_asignatura', function (Blueprint $table) {
            $table->id('id_doc_asig');
            $table->unsignedBigInteger('id_persona');
            $table->unsignedBigInteger('id_asignatura');
            $table->timestamps();

            $table->foreign('id_persona')
                ->references('id_persona')->on('persona')
                ->onDelete('cascade')->onUpdate('cascade');

            $table->foreign('id_asignatura')
                ->references('id_asignatura')->on('asignatura')
                ->onDelete('cascade')->onUpdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('docente_asignatura');
    }
};
