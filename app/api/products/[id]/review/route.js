import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import connectDB from '@/config/db';
import Product from '@/models/Product';

// POST: Add review to a product
export async function POST(req, { params }) {
    try {
        const { id: productId } = await params;
        const { userId } = await auth();
        
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const user = await currentUser();
        const userName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || "K-Pop Fan" : "Anonymous";

        const { rating, comment, isAnonymous } = await req.json();
        if (!rating || !comment) {
            return NextResponse.json({ success: false, message: "Rating and comment are required" }, { status: 400 });
        }

        await connectDB();

        const product = await Product.findById(productId);
        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        // Prevent duplicate reviews from the same user
        const alreadyReviewed = product.reviews.some(r => r.userId === userId);
        if (alreadyReviewed) {
            return NextResponse.json({ success: false, message: "You have already reviewed this product." }, { status: 400 });
        }

        product.reviews.push({
            userId,
            userName,
            rating: Number(rating),
            comment,
            isAnonymous: Boolean(isAnonymous),
            date: Date.now()
        });

        await product.save();

        return NextResponse.json({
            success: true,
            message: "Review added successfully",
            product
        });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
