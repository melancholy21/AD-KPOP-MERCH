"use client"
import { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Image from "next/image";
import { useParams } from "next/navigation";
import Loading from "@/components/Loading";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";
import { useAppContext } from "@/context/AppContext";

const Product = () => {

    const { id } = useParams();

    const { products, router, addToCart } = useAppContext()

    const { isSignedIn, user } = useUser();

    const [mainImage, setMainImage] = useState(null);
    const [productData, setProductData] = useState(null);

    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [isAnonymous, setIsAnonymous] = useState(false);
    const [submittingReview, setSubmittingReview] = useState(false);

    const fetchProductData = async () => {
        const product = products.find(product => product._id === id);
        setProductData(product);
    }

    const getAverageRating = () => {
        if (!productData?.reviews || productData.reviews.length === 0) return 0;
        const total = productData.reviews.reduce((sum, review) => sum + review.rating, 0);
        return Math.round((total / productData.reviews.length) * 10) / 10;
    }

    const renderStars = (ratingVal) => {
        return (
            <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                    <Image
                        key={i}
                        className="h-4 w-4"
                        src={i < Math.floor(ratingVal) ? assets.star_icon : assets.star_dull_icon}
                        alt="star"
                    />
                ))}
            </div>
        )
    }

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        if (!comment.trim()) return;
        setSubmittingReview(true);
        const toastId = toast.loading("Submitting review...");
        try {
            const res = await fetch(`/api/products/${productData._id}/review`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ rating, comment, isAnonymous })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Review submitted successfully!", { id: toastId });
                setProductData(data.product);
                setComment("");
                setIsAnonymous(false);
            } else {
                toast.error(data.message || "Failed to submit review", { id: toastId });
            }
        } catch (error) {
            toast.error("Error submitting review", { id: toastId });
        } finally {
            setSubmittingReview(false);
        }
    }

    useEffect(() => {
        fetchProductData();
    }, [id, products.length])

    // Prepare JSON-LD structured data for Google Search SEO
    const jsonLd = productData ? {
        "@context": "https://schema.org",
        "@type": "Product",
        "name": productData.name,
        "image": productData.image,
        "description": productData.description,
        "offers": {
            "@type": "Offer",
            "priceCurrency": "PHP",
            "price": productData.offerPrice,
            "itemCondition": "https://schema.org/NewCondition",
            "availability": productData.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
        }
    } : null;

    return productData ? (<>
        {jsonLd && (
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        )}
        <Navbar />
        <div className="px-6 md:px-16 lg:px-32 pt-14 space-y-10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                <div className="px-5 lg:px-16 xl:px-20">
                    <div className="rounded-lg overflow-hidden bg-gray-500/10 mb-4">
                        <Image
                            src={mainImage || productData.image[0]}
                            alt="alt"
                            className="w-full h-auto object-cover mix-blend-multiply"
                            width={1280}
                            height={720}
                        />
                    </div>

                    <div className="grid grid-cols-4 gap-4">
                        {productData.image.map((image, index) => (
                            <div
                                key={index}
                                onClick={() => setMainImage(image)}
                                className="cursor-pointer rounded-lg overflow-hidden bg-gray-500/10"
                            >
                                <Image
                                    src={image}
                                    alt="alt"
                                    className="w-full h-auto object-cover mix-blend-multiply"
                                    width={1280}
                                    height={720}
                                />
                            </div>

                        ))}
                    </div>
                </div>

                <div className="flex flex-col">
                    <h1 className="text-3xl font-medium text-gray-800/90 mb-4">
                        {productData.name}
                    </h1>
                    <div className="flex items-center gap-2">
                        {renderStars(getAverageRating())}
                        <p>({getAverageRating() || "No reviews yet"})</p>
                    </div>
                    <p className="text-gray-600 mt-3">
                        {productData.description}
                    </p>
                    <p className="text-3xl font-medium mt-6">
                        ₱{productData.offerPrice}
                        <span className="text-base font-normal text-gray-800/60 line-through ml-2">
                            ₱{productData.price}
                        </span>
                    </p>
                    <hr className="bg-gray-600 my-6" />
                    <div className="overflow-x-auto">
                        <table className="table-auto border-collapse w-full max-w-72">
                            <tbody>
                                <tr>
                                    <td className="text-gray-600 font-medium">Type</td>
                                    <td className="text-gray-800/50 ">Merchandise</td>
                                </tr>
                                <tr>
                                    <td className="text-gray-600 font-medium">Color</td>
                                    <td className="text-gray-800/50 ">{productData.color}</td>
                                </tr>
                                <tr>
                                    <td className="text-gray-600 font-medium">Category</td>
                                    <td className="text-gray-800/50">
                                        {productData.category}
                                    </td>
                                </tr>
                                <tr>
                                    <td className="text-gray-600 font-medium">Availability</td>
                                    <td className="font-semibold">
                                        {productData.stock > 0 ? (
                                            productData.stock <= 5 ? (
                                                <span className="text-orange-500">Only {productData.stock} left in stock!</span>
                                            ) : (
                                                <span className="text-green-600">In Stock ({productData.stock} available)</span>
                                            )
                                        ) : (
                                            <span className="text-red-500">Out of Stock</span>
                                        )}
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div className="flex items-center mt-10 gap-4">
                        {productData.stock > 0 ? (
                            <>
                                <button onClick={() => {
                                    if (!isSignedIn) {
                                        toast.error("Please sign in to add items to cart");
                                        return;
                                    }
                                    addToCart(productData._id);
                                }} className="w-full py-3.5 bg-gray-100 text-gray-800/80 hover:bg-gray-200 transition">
                                    Add to Cart
                                </button>
                                <button onClick={() => {
                                    if (!isSignedIn) {
                                        toast.error("Please sign in to purchase items");
                                        return;
                                    }
                                    addToCart(productData._id);
                                    router.push('/cart');
                                }} className="w-full py-3.5 bg-orange-500 text-white hover:bg-orange-600 transition">
                                    Buy now
                                </button>
                            </>
                        ) : (
                            <button disabled className="w-full py-3.5 bg-gray-300 text-gray-500 cursor-not-allowed">
                                Out of Stock
                            </button>
                        )}
                    </div>
                </div>
            </div>
            {/* Reviews Section */}
            <div className="border-t pt-10 mt-10">
                <h3 className="text-2xl font-medium mb-6">Customer Reviews</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                    {/* Reviews List */}
                    <div className="space-y-6">
                        {productData.reviews && productData.reviews.length > 0 ? (
                            productData.reviews.map((rev, index) => (
                                <div key={index} className="border-b pb-4 last:border-0">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="font-semibold text-gray-800">{rev.isAnonymous ? "Anonymous User" : rev.userName}</p>
                                        <p className="text-xs text-gray-500">{new Date(rev.date).toLocaleDateString()}</p>
                                    </div>
                                    <div className="flex items-center gap-2 mb-2">
                                        {renderStars(rev.rating)}
                                    </div>
                                    <p className="text-gray-600 text-sm">{rev.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500">No reviews yet for this product.</p>
                        )}
                    </div>

                    {/* Review Form */}
                    <div className="bg-gray-55 p-6 rounded-lg border">
                        <h4 className="text-lg font-medium mb-4 text-gray-800">Write a Review</h4>
                        {isSignedIn ? (
                            productData.reviews?.some(r => r.userId === user?.id) ? (
                                <div className="text-center py-6">
                                    <p className="text-sm font-medium text-orange-600 bg-orange-50 rounded-md p-3">
                                        You have already submitted a review for this product. Thank you!
                                    </p>
                                </div>
                            ) : (
                                <form onSubmit={handleReviewSubmit} className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                                        <select
                                            value={rating}
                                            onChange={(e) => setRating(Number(e.target.value))}
                                            className="w-full border rounded p-2 focus:ring-1 focus:ring-orange-500 outline-none"
                                        >
                                            <option value="5">5 Stars - Excellent</option>
                                            <option value="4">4 Stars - Good</option>
                                            <option value="3">3 Stars - Average</option>
                                            <option value="2">2 Stars - Poor</option>
                                            <option value="1">1 Star - Terrible</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                                        <textarea
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                            rows="4"
                                            placeholder="Share your thoughts about this product..."
                                            className="w-full border rounded p-2 focus:ring-1 focus:ring-orange-500 outline-none resize-none"
                                            required
                                        ></textarea>
                                    </div>
                                    <div className="flex items-center py-1">
                                        <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none">
                                            <input
                                                type="checkbox"
                                                checked={isAnonymous}
                                                onChange={(e) => setIsAnonymous(e.target.checked)}
                                                className="rounded text-orange-500 focus:ring-orange-500 w-4 h-4 cursor-pointer"
                                            />
                                            Review anonymously
                                        </label>
                                    </div>
                                    <button
                                        type="submit"
                                        disabled={submittingReview}
                                        className="w-full py-2.5 bg-orange-500 text-white rounded hover:bg-orange-600 transition disabled:bg-orange-300"
                                    >
                                        {submittingReview ? "Submitting..." : "Submit Review"}
                                    </button>
                                </form>
                            )
                        ) : (
                            <p className="text-sm text-gray-500">Please sign in to write a review.</p>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center">
                <div className="flex flex-col items-center mb-4 mt-16">
                    <p className="text-3xl font-medium">Featured <span className="font-medium text-orange-500">Products</span></p>
                    <div className="w-28 h-0.5 bg-orange-500 mt-2"></div>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-6 pb-14 w-full">
                    {products.slice(0, 5).map((product, index) => <ProductCard key={index} product={product} />)}
                </div>
                <button className="px-8 py-2 mb-16 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
                    See more
                </button>
            </div>
        </div>
        <Footer />
    </>
    ) : <Loading />
};

export default Product;