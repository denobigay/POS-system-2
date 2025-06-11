<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('tbl_products', function (Blueprint $table) {
            $table->id('product_id');
            $table->string('product_picture')->nullable();
            $table->string('product_name');
            $table->decimal('price', 10, 2);
            $table->integer('quantity');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('tbl_products');
    }
};
