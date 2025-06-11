<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class OrderController extends Controller
{
    public function loadOrders()
    {
        $orders = Order::with(['user', 'orderItems.product'])->get();
        // Map orders to always include customer_name and customer_email
        $orders = $orders->map(function ($order) {
            return [
                'order_id' => $order->order_id,
                'user_id' => $order->user_id,
                'customer_name' => $order->customer_name,
                'customer_email' => $order->customer_email,
                'total_amount' => $order->total_amount,
                'amount_paid' => $order->amount_paid,
                'change_amount' => $order->change_amount,
                'payment_method' => $order->payment_method,
                'status' => $order->status,
                'discount' => $order->discount,
                'created_at' => $order->created_at,
                'user' => $order->user,
                'order_items' => $order->orderItems,
            ];
        })->values()->all();
        return response()->json([
            'orders' => $orders,
        ], 200);
    }

    public function storeOrder(Request $request)
    {
        $validated = $request->validate([
            'userId' => ['nullable', 'exists:tbl_users,user_id'],
            'customerName' => ['nullable', 'string', 'max:255'],
            'customerEmail' => ['nullable', 'string', 'max:255'],
            'items' => ['required', 'array', 'min:1'],
            'items.*.productId' => ['required', 'exists:tbl_products,product_id'],
            'items.*.quantity' => ['required', 'integer', 'min:1'],
            'amountPaid' => ['required', 'numeric', 'min:0'],
            'discount' => ['nullable', 'numeric', 'min:0'],
        ]);

        try {
            DB::beginTransaction();

            // Calculate total amount
            $totalAmount = 0;
            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['productId']);
                if ($product->quantity < $item['quantity']) {
                    throw new \Exception("Insufficient stock for product: {$product->product_name}");
                }
                $totalAmount += $product->price * $item['quantity'];
            }

            $tax = $totalAmount * 0.12;
            $discountPercent = isset($validated['discount']) ? floatval($validated['discount']) : 0;
            $discountAmount = ($totalAmount + $tax) * ($discountPercent / 100);
            $totalAfterDiscount = max($totalAmount + $tax - $discountAmount, 0);

            // Create order
            $order = Order::create([
                'user_id' => $validated['userId'] ?? null,
                'customer_name' => $validated['customerName'] ?? null,
                'customer_email' => $validated['customerEmail'] ?? null,
                'total_amount' => $totalAfterDiscount,
                'amount_paid' => $validated['amountPaid'],
                'change_amount' => $validated['amountPaid'] - $totalAfterDiscount,
                'status' => 'completed',
                'discount' => $discountPercent
            ]);

            // Create order items and update product quantities
            foreach ($validated['items'] as $item) {
                $product = Product::findOrFail($item['productId']);

                OrderItem::create([
                    'order_id' => $order->order_id,
                    'product_id' => $item['productId'],
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'subtotal' => $product->price * $item['quantity']
                ]);

                // Update product quantity
                $product->update([
                    'quantity' => $product->quantity - $item['quantity']
                ]);
            }

            DB::commit();

            return response()->json([
                'message' => 'Order created successfully',
                'order' => $order->load(['user', 'orderItems.product'])
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error creating order: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getOrder($id)
    {
        $order = Order::with(['user', 'orderItems.product'])->findOrFail($id);
        return response()->json([
            'order' => $order
        ], 200);
    }

    public function cancelOrder($id)
    {
        try {
            DB::beginTransaction();

            $order = Order::findOrFail($id);

            if ($order->status === 'cancelled') {
                throw new \Exception('Order is already cancelled');
            }

            // Restore product quantities
            foreach ($order->orderItems as $item) {
                $product = Product::find($item->product_id);
                $product->update([
                    'quantity' => $product->quantity + $item->quantity
                ]);
            }

            $order->update(['status' => 'cancelled']);

            DB::commit();

            return response()->json([
                'message' => 'Order cancelled successfully'
            ], 200);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Error cancelling order: ' . $e->getMessage()
            ], 500);
        }
    }
}
