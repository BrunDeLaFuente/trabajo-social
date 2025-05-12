<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('persona_correo', function (Blueprint $table) {
            $table->id('id_persona_correo');
            $table->unsignedBigInteger('id_persona');
            $table->string('email_persona');
            $table->timestamps();

            $table->foreign('id_persona')
                ->references('id_persona')
                ->on('persona')
                ->onDelete('cascade')
                ->onUpdate('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('persona_correo');
    }
};
