<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('enlace', function (Blueprint $table) {
            $table->id('id_enlace');
            $table->unsignedBigInteger('id_evento');
            $table->enum('plataforma', ['Google Meet', 'Zoom']);
            $table->string('url_enlace', 500);
            $table->string('password_enlace')->nullable();
            $table->timestamps();

            $table->foreign('id_evento')
                ->references('id_evento')
                ->on('evento')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('enlace');
    }
};
