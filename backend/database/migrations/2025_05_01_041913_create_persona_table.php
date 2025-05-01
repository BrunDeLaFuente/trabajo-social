<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('persona', function (Blueprint $table) {
            $table->id('id_persona');
            $table->unsignedBigInteger('id_tipo_persona');
            $table->string('nombre_persona');
            $table->string('cargo');
            $table->string('imagen_persona')->nullable();
            $table->timestamps();

            $table->foreign('id_tipo_persona')
                ->references('id_tipo_persona')
                ->on('tipo_persona')
                ->onDelete('restrict')
                ->onUpdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('persona');
    }
};
