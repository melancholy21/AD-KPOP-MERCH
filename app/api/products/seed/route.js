import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/config/db';
import Product from '@/models/Product';
import { productsDummyData } from '@/assets/assets';
import authSeller from '@/lib/authSeller';

export async function GET() {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized. Please sign in." }, { status: 401 });
        }

        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Only sellers can seed products" }, { status: 403 });
        }

        await connectDB();

        // Map dummy products to use the current seller's user ID and auto-generate new _ids
        const productsToInsert = productsDummyData.map(product => {
            const { _id, ...rest } = product;
            return {
                ...rest,
                userId,
                date: Date.now()
            };
        });

        // Insert products into MongoDB
        const result = await Product.insertMany(productsToInsert);

        return NextResponse.json({ 
            success: true, 
            message: `${result.length} dummy K-pop products seeded successfully into database under your seller ID!`,
            products: result
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
