import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/config/db';
import User from '@/models/User';
import { getOrCreateUser } from '@/lib/getOrCreateUser';

// GET: Fetch user's cart
export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const user = await getOrCreateUser(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, cartItems: user.cartItems || {} });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST: Update/sync user's cart in database
export async function POST(req) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { cartItems } = await req.json();
        if (!cartItems) {
            return NextResponse.json({ success: false, message: "Missing cartItems" }, { status: 400 });
        }

        const user = await getOrCreateUser(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        user.cartItems = cartItems;
        await user.save();

        return NextResponse.json({ success: true, message: "Cart updated successfully", cartItems: user.cartItems });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
