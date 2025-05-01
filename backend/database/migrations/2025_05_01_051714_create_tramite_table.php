<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('tramite', function (Blueprint $table) {
            $table->id('id_tramite');
            $table->string('titulo_tramite')->unique();
            $table->text('descripcion_tramite');
            $table->string('planilla_url', 500)->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('tramite');
    }
};
