<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('tbl_users', function (Blueprint $table) {
            $table->id('user_id');
            $table->string('profile_image')->nullable();
            $table->string('first_name', 55);
            $table->string('middle_name', 55)->nullable();
            $table->string('last_name', 55);
            $table->string('suffix_name', 55)->nullable();
            $table->string('age');
            $table->enum('gender', ['female', 'male', 'others']);
            $table->string('contact', 55);
            $table->string('address', 255);
            $table->unsignedBigInteger('role_id');
            $table->string('email', 55)->unique();
            $table->string('password', 255);
            $table->timestamps();


            $table->foreign('role_id')
                ->references('role_id')
                ->on('tbl_roles')
                ->onUpdate('cascade')
                ->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('tbl_users_');
    }
};
