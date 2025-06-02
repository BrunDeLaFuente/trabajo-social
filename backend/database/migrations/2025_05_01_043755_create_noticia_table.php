<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('noticia', function (Blueprint $table) {
            $table->id('id_noticia');
            $table->string('titulo_noticia');
            $table->timestamp('fecha_publicacion_noticia')->useCurrent();
            $table->string('autor')->nullable();
            $table->text('contenido');
            $table->enum('categoria', ['Articulo', 'Comunicado']);
            $table->boolean('es_publico')->default(true);
            $table->string('slug')->unique();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('noticia');
    }
};
