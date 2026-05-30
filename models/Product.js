import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    offerPrice: { type: Number, required: true },
    image: { type: [String], required: true },
    category: { type: String, required: true },
    color: { type: String, required: true },
    date: { type: Number, required: true },
    stock: { type: Number, default: 50 },
    reviews: [{
        userId: { type: String, required: true },
        userName: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        isAnonymous: { type: Boolean, default: false },
        date: { type: Number, default: Date.now }
    }]
});

const Product = mongoose.models.product || mongoose.model("product", productSchema);

export default Product;
