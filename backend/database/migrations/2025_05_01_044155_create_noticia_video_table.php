<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('noticia_video', function (Blueprint $table) {
            $table->id('id_noticia_video');
            $table->unsignedBigInteger('id_noticia');
            $table->string('ruta_video_noticia', 255);
            $table->timestamps();

            $table->foreign('id_noticia')
                ->references('id_noticia')
                ->on('noticia')
                ->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('noticia_video');
    }
};
