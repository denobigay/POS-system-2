<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;

class OrderController extends Controller
{
    public function storeOrder(Request $request)
    {
        try {
            $request->validate([
                'customerName' => 'required|string',
                'customerEmail' => 'required|email',
                'items' => 'required|array',
                'items.*.productId' => 'required|exists:tbl_products,product_id',
                'items.*.quantity' => 'required|integer|min:1',
                'items.*.price' => 'required|numeric|min:0',
                'amountPaid' => 'required|numeric|min:0',
                'paymentMethod' => 'required|string',
                'discount' => 'required|numeric|min:0',
                'total' => 'required|numeric|min:0',
            ]);

            DB::beginTransaction();

            // Create order
            $order = Order::create([
                'user_id' => Auth::id(),
                'customer_name' => $request->customerName,
                'customer_email' => $request->customerEmail,
                'total_amount' => $request->total,
                'amount_paid' => $request->amountPaid,
                'change_amount' => $request->amountPaid - $request->total,
                'payment_method' => $request->paymentMethod,
                'status' => 'completed',
                'discount' => $request->discount,
            ]);

            // Create order items
            foreach ($request->items as $item) {
                OrderItem::create([
                    'order_id' => $order->order_id,
                    'product_id' => $item['productId'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'subtotal' => $item['price'] * $item['quantity'],
                ]);

                // Update product quantity
                $product = Product::find($item['productId']);
                $product->quantity -= $item['quantity'];
                $product->save();
            }

            DB::commit();

            // Send email notification using Make.com webhook
            $this->sendOrderConfirmationEmail($order);

            return response()->json([
                'status' => 'success',
                'message' => 'Order placed successfully',
                'order' => $order->load('orderItems.product'),
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'status' => 'error',
                'message' => $e->getMessage(),
            ], 500);
        }
    }

    private function sendOrderConfirmationEmail($order)
    {
        try {
            $webhookUrl = env('MAKE_WEBHOOK_URL');
            if (!$webhookUrl) {
                Log::warning('Make.com webhook URL not configured');
                return;
            }

            $payload = [
                'customer_name' => $order->customer_name,
                'customer_email' => $order->customer_email,
                'order_id' => $order->order_id,
                'total_amount' => $order->total_amount,
                'order_items' => $order->orderItems->map(function ($item) {
                    return [
                        'product_name' => $item->product->product_name,
                        'quantity' => $item->quantity,
                        'price' => $item->price,
                        'subtotal' => $item->subtotal,
                    ];
                }),
                'feedback_link' => env('APP_FRONTEND_URL') . '/feedback/' . $order->order_id,
            ];

            Http::post($webhookUrl, $payload);
        } catch (\Exception $e) {
            Log::error('Failed to send order confirmation email: ' . $e->getMessage());
        }
    }
}
