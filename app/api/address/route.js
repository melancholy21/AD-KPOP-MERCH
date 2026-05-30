import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/config/db';
import Address from '@/models/Address';

// GET: Fetch user's saved addresses
export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        await connectDB();
        const addresses = await Address.find({ userId });
        return NextResponse.json({ success: true, addresses });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST: Save shipping address
export async function POST(req) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { fullName, phoneNumber, pincode, area, city, state } = await req.json();
        if (!fullName || !phoneNumber || !pincode || !area || !city || !state) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        await connectDB();
        const newAddress = await Address.create({
            userId,
            fullName,
            phoneNumber,
            pincode: Number(pincode),
            area,
            city,
            state
        });

        return NextResponse.json({ success: true, message: "Address saved successfully", address: newAddress });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE: Remove shipping address
export async function DELETE(req) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const { searchParams } = new URL(req.url);
        const id = searchParams.get('id');
        if (!id) {
            return NextResponse.json({ success: false, message: "Missing address ID" }, { status: 400 });
        }

        await connectDB();
        const deletedAddress = await Address.findOneAndDelete({ _id: id, userId });
        if (!deletedAddress) {
            return NextResponse.json({ success: false, message: "Address not found or unauthorized" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Address deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

