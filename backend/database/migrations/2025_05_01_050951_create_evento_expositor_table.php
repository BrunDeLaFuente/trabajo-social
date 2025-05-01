<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('evento_expositor', function (Blueprint $table) {
            $table->id('id_evento_expositor');
            $table->unsignedBigInteger('id_evento');
            $table->unsignedBigInteger('id_expositor');
            $table->timestamps();

            $table->foreign('id_evento')->references('id_evento')->on('evento')->onDelete('cascade');
            $table->foreign('id_expositor')->references('id_expositor')->on('expositor')->onDelete('cascade');

            $table->unique(['id_evento', 'id_expositor']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('evento_expositor');
    }
};
