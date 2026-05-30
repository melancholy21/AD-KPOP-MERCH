import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/config/db';
import Product from '@/models/Product';
import { uploadImage } from '@/lib/cloudinary';
import authSeller from '@/lib/authSeller';

// GET: Fetch all products
export async function GET() {
    try {
        await connectDB();
        const products = await Product.find({}).sort({ date: -1 });
        return NextResponse.json({ success: true, products });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// POST: Add new product (Seller only)
export async function POST(req) {
    try {
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Only sellers can add products" }, { status: 403 });
        }

        await connectDB();
        const formData = await req.formData();

        const name = formData.get('name');
        const description = formData.get('description');
        const category = formData.get('category');
        const price = Number(formData.get('price'));
        const offerPrice = Number(formData.get('offerPrice'));
        const color = formData.get('color') || 'Multi';

        if (!name || !description || !category || isNaN(price) || isNaN(offerPrice)) {
            return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
        }

        // Handle image uploads
        const imageUrls = [];
        for (let i = 0; i < 4; i++) {
            const file = formData.get(`image${i}`);
            if (file && typeof file !== 'string') {
                const buffer = Buffer.from(await file.arrayBuffer());
                const url = await uploadImage(buffer);
                imageUrls.push(url);
            }
        }

        if (imageUrls.length === 0) {
            // Add a default placeholder if no images are uploaded
            imageUrls.push("https://i.ibb.co/bRJ8LPw1/BUBBLE-AESPA-KARINA.png");
        }

        const newProduct = await Product.create({
            userId,
            name,
            description,
            price,
            offerPrice,
            image: imageUrls,
            category,
            color,
            date: Date.now()
        });

        return NextResponse.json({ success: true, message: "Product added successfully", product: newProduct });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
