import React from 'react'
import { assets } from '@/assets/assets'
import Image from 'next/image';
import { useAppContext } from '@/context/AppContext';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const ProductCard = ({ product }) => {

    const { user, currency, router, wishlist, toggleWishlist, addToCart } = useAppContext()

    const getAverageRating = () => {
        if (!product?.reviews || product.reviews.length === 0) return 0;
        const total = product.reviews.reduce((sum, review) => sum + review.rating, 0);
        return Math.round((total / product.reviews.length) * 10) / 10;
    }

    const isWishlisted = wishlist && wishlist.includes(product._id);

    const getAspectClass = (category) => {
        switch (category) {
            case 'LOMO Cards':
            case 'Photocards':
                return 'aspect-[2/3]'; // Portrait
            case 'Banner':
                return 'aspect-[16/9]'; // Landscape
            default:
                return 'aspect-square'; // Square
        }
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 15 }}
            whileHover={{ y: -6, scale: 1.02 }}
            transition={{ duration: 0.3 }}
            onClick={() => { router.push('/product/' + product._id); scrollTo(0, 0) }}
            className="flex flex-col items-start gap-0.5 max-w-[200px] w-full cursor-pointer bg-white rounded-xl p-2 border border-gray-100 shadow-sm"
        >
            <div className={`cursor-pointer group relative bg-gray-50 rounded-lg w-full flex items-center justify-center overflow-hidden ${getAspectClass(product.category)}`}>
                <Image
                    src={product.image[0]}
                    alt={product.name}
                    className="group-hover:scale-105 transition object-contain w-full h-full p-1 mix-blend-multiply"
                    width={800}
                    height={800}
                />
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        toggleWishlist(product._id);
                    }}
                    className={`absolute top-2 right-2 p-2 rounded-full shadow-md transition ${
                        isWishlisted ? "bg-orange-500 hover:bg-orange-600" : "bg-white hover:bg-gray-100"
                    }`}
                    title={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                >
                    <Image
                        className={`h-3 w-3 ${isWishlisted ? "brightness-0 invert" : ""}`}
                        src={assets.heart_icon}
                        alt="heart_icon"
                    />
                </button>
            </div>

            <p className="md:text-base font-medium pt-2 w-full truncate">{product.name}</p>
            <p className="w-full text-xs text-gray-500/70 max-sm:hidden truncate">{product.description}</p>
            <div className="flex items-center gap-2">
                <p className="text-xs">{getAverageRating() || "No reviews yet"}</p>
                <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <Image
                            key={index}
                            className="h-3 w-3"
                            src={
                                index < Math.floor(getAverageRating())
                                    ? assets.star_icon
                                    : assets.star_dull_icon
                            }
                            alt="star_icon"
                        />
                    ))}
                </div>
            </div>

            <div className="flex items-end justify-between w-full mt-1">
                <p className="text-base font-medium">{currency}{product.offerPrice}</p>
                <button
                    onClick={(e) => {
                        e.stopPropagation();
                        if (!user) {
                            toast.error("Please sign in to buy items");
                            return;
                        }
                        addToCart(product._id);
                        router.push('/cart');
                    }}
                    className="max-sm:hidden px-4 py-1.5 text-gray-500 border border-gray-500/20 rounded-full text-xs hover:bg-slate-50 transition"
                >
                    Buy now
                </button>
            </div>
        </motion.div>
    )
}

export default ProductCard