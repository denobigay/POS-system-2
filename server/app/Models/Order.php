<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Order extends Model
{
    use HasFactory;

    protected $table = 'tbl_orders';
    protected $primaryKey = 'order_id';

    protected $fillable = [
        'user_id',
        'customer_name',
        'customer_email',
        'total_amount',
        'amount_paid',
        'change_amount',
        'payment_method',
        'status',
        'discount'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class, 'user_id', 'user_id');
    }

    public function orderItems(): HasMany
    {
        return $this->hasMany(OrderItem::class, 'order_id', 'order_id');
    }
}
