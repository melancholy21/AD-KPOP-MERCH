import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import mongoose from 'mongoose';
import connectDB from '@/config/db';
import Order from '@/models/Order';
import User from '@/models/User';
import Address from '@/models/Address';
import Product from '@/models/Product';
import authSeller from '@/lib/authSeller';
import { inngest } from '@/config/inngest';
import { rateLimit } from '@/lib/rateLimiter';

// GET: Fetch orders (user orders or seller orders)
export async function GET(req) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        
        // Check if query is for seller orders
        const { searchParams } = new URL(req.url);
        const isSellerRequest = searchParams.get('seller') === 'true';

        let orders;
        if (isSellerRequest) {
            const isSeller = await authSeller(userId);
            if (!isSeller) {
                return NextResponse.json({ success: false, message: "Only sellers can view seller orders" }, { status: 403 });
            }
            // Sellers see all orders in this implementation
            orders = await Order.find({})
                .populate('items.product')
                .sort({ date: -1 });
        } else {
            // Regular user sees only their own orders
            orders = await Order.find({ userId })
                .populate('items.product')
                .sort({ date: -1 });
        }

        // Manually populate legacy ObjectId addresses
        const populatedOrders = await Promise.all(orders.map(async (order) => {
            const orderObj = order.toObject();
            if (orderObj.address && mongoose.Types.ObjectId.isValid(orderObj.address)) {
                try {
                    const addr = await Address.findById(orderObj.address);
                    orderObj.address = addr ? addr.toObject() : null;
                } catch (e) {
                    orderObj.address = null;
                }
            }
            return orderObj;
        }));

        return NextResponse.json({ success: true, orders: populatedOrders });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST: Place a new order
export async function POST(req) {
    try {
        // Rate limit: 5 order creations per minute per IP
        const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
        const { isLimited } = await rateLimit(ip, 5, 60000);
        if (isLimited) {
            return NextResponse.json(
                { success: false, message: "Too many checkout requests. Please wait a minute before trying again." },
                { status: 429 }
            );
        }

        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { addressId, items, amount } = await req.json();
        if (!addressId || !items || !amount) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        await connectDB();

        // Verify address exists
        const address = await Address.findById(addressId);
        if (!address) {
            return NextResponse.json({ success: false, message: "Shipping address not found" }, { status: 404 });
        }

        // Validate stock for all products in the order
        for (const item of items) {
            const dbProduct = await Product.findById(item.product);
            if (!dbProduct) {
                return NextResponse.json({ success: false, message: `Product not found` }, { status: 404 });
            }
            if (dbProduct.stock < item.quantity) {
                return NextResponse.json({ 
                    success: false, 
                    message: `Insufficient stock for product: ${dbProduct.name}. Available: ${dbProduct.stock}, Requested: ${item.quantity}` 
                }, { status: 400 });
            }
        }

        // Decrement stock for all items
        for (const item of items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: -item.quantity }
            });
        }

        // Create the order
        const newOrder = await Order.create({
            userId,
            items,
            amount,
            address: {
                fullName: address.fullName,
                phoneNumber: address.phoneNumber,
                pincode: address.pincode,
                area: address.area,
                city: address.city,
                state: address.state
            },
            status: "Order Placed",
            date: Date.now()
        });

        // Clear user's cart in DB
        await User.findByIdAndUpdate(userId, { cartItems: {} });

        // Retrieve fully populated order to return to client
        const populatedOrder = await Order.findById(newOrder._id)
            .populate('items.product');

        // Fetch user email to send receipt
        const user = await User.findById(userId);
        const userEmail = user?.email;

        // Trigger order confirmation email event via Inngest
        if (userEmail) {
            try {
                await inngest.send({
                    name: 'order.created',
                    data: {
                        orderId: newOrder._id,
                        userEmail: userEmail,
                        userName: user.name,
                        amount: amount,
                        items: items.map(item => ({
                            productId: item.product,
                            quantity: item.quantity
                        }))
                    }
                });
            } catch (inngestError) {
                console.error("Failed to dispatch order.created event to Inngest:", inngestError);
            }
        }

        return NextResponse.json({
            success: true,
            message: "Order placed successfully",
            order: populatedOrder
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PUT: Update order status (Seller only)
export async function PUT(req) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Only sellers can update order status" }, { status: 403 });
        }

        const { orderId, status } = await req.json();
        if (!orderId || !status) {
            return NextResponse.json({ success: false, message: "Order ID and status are required" }, { status: 400 });
        }

        await connectDB();

        let updatedOrder = await Order.findByIdAndUpdate(
            orderId,
            { status },
            { new: true }
        ).populate('items.product');

        if (!updatedOrder) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
        }

        const orderObj = updatedOrder.toObject();
        if (orderObj.address && mongoose.Types.ObjectId.isValid(orderObj.address)) {
            try {
                const addr = await Address.findById(orderObj.address);
                orderObj.address = addr ? addr.toObject() : null;
            } catch (e) {
                orderObj.address = null;
            }
        }

        return NextResponse.json({ success: true, message: "Order status updated successfully", order: orderObj });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE: Delete an order (Seller only)
export async function DELETE(req) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Only sellers can delete orders" }, { status: 403 });
        }

        const { searchParams } = new URL(req.url);
        const orderId = searchParams.get('orderId');

        if (!orderId) {
            return NextResponse.json({ success: false, message: "Order ID is required" }, { status: 400 });
        }

        await connectDB();

        const deletedOrder = await Order.findByIdAndDelete(orderId);
        if (!deletedOrder) {
            return NextResponse.json({ success: false, message: "Order not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Order deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
