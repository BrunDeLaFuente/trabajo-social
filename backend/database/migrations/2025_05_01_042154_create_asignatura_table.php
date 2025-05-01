<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('asignatura', function (Blueprint $table) {
            $table->id('id_asignatura');
            $table->string('nombre_asignatura');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('asignatura');
    }
};
