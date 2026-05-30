import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import connectDB from '@/config/db';
import Product from '@/models/Product';
import { uploadImage } from '@/lib/cloudinary';
import authSeller from '@/lib/authSeller';

// GET: Fetch single product details (optional, but good for edit page fetch fallback)
export async function GET(req, { params }) {
    try {
        const { id } = await params;
        await connectDB();
        const product = await Product.findById(id);
        if (!product) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }
        return NextResponse.json({ success: true, product });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// DELETE: Delete a product (Seller only)
export async function DELETE(req, { params }) {
    try {
        const { id } = await params;
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Only sellers can delete products" }, { status: 403 });
        }

        await connectDB();
        const deletedProduct = await Product.findByIdAndDelete(id);
        
        if (!deletedProduct) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Product deleted successfully" });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}

// PUT: Update a product (Seller only)
export async function PUT(req, { params }) {
    try {
        const { id } = await params;
        const { userId } = await auth();
        if (!userId) {
            return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 });
        }

        const isSeller = await authSeller(userId);
        if (!isSeller) {
            return NextResponse.json({ success: false, message: "Only sellers can update products" }, { status: 403 });
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

        // Process images (both existing URLs and new file uploads)
        const imageUrls = [];
        for (let i = 0; i < 4; i++) {
            const file = formData.get(`image${i}`);
            if (file) {
                if (typeof file === 'string' && file.startsWith('http')) {
                    // It's an existing image URL, preserve it
                    imageUrls.push(file);
                } else if (file instanceof File || file.name) {
                    // It's a new file upload
                    const buffer = Buffer.from(await file.arrayBuffer());
                    const url = await uploadImage(buffer);
                    imageUrls.push(url);
                }
            }
        }

        // Fallback placeholder if all images were removed
        if (imageUrls.length === 0) {
            imageUrls.push("https://i.ibb.co/bRJ8LPw1/BUBBLE-AESPA-KARINA.png");
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            id,
            {
                name,
                description,
                price,
                offerPrice,
                image: imageUrls,
                category,
                color
            },
            { new: true }
        );

        if (!updatedProduct) {
            return NextResponse.json({ success: false, message: "Product not found" }, { status: 404 });
        }

        return NextResponse.json({ success: true, message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 });
    }
}
