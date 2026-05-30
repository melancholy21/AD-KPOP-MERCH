import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/config/db';
import User from '@/models/User';
import { getOrCreateUser } from '@/lib/getOrCreateUser';

// GET: Fetch user's wishlist
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

        return NextResponse.json({ success: true, wishlist: user.wishlist || [] });
    } catch (error) {
        console.error("Wishlist GET error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST: Toggle product in wishlist
export async function POST(req) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { productId } = await req.json();
        if (!productId) {
            return NextResponse.json({ success: false, message: "Missing product ID" }, { status: 400 });
        }

        const user = await getOrCreateUser(userId);
        if (!user) {
            return NextResponse.json({ success: false, message: "User not found" }, { status: 404 });
        }

        const wishlist = user.wishlist || [];
        const index = wishlist.indexOf(productId);

        if (index > -1) {
            wishlist.splice(index, 1); // remove
        } else {
            wishlist.push(productId); // add
        }

        user.wishlist = wishlist;
        await user.save();

        return NextResponse.json({ success: true, wishlist });
    } catch (error) {
        console.error("Wishlist POST error:", error);
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
