<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('semestre', function (Blueprint $table) {
            $table->id('id_semestre');
            $table->unsignedBigInteger('id_malla');
            $table->string('numero', 50);
            $table->timestamps();

            $table->foreign('id_malla')->references('id_malla')->on('malla_curricular')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('semestre');
    }
};
