'use client'
import React from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import { useUser } from "@clerk/nextjs";
import { useClerk } from "@clerk/nextjs";

const Wishlist = () => {
    const { products, wishlist } = useAppContext();
    const { isSignedIn } = useUser();
    const { openSignIn } = useClerk();

    const wishlistedProducts = products.filter(p => wishlist.includes(p._id));

    if (!isSignedIn) {
        return (
            <>
                <Navbar />
                <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 md:px-16 lg:px-32">
                    <div className="text-center space-y-4">
                        <div className="w-20 h-20 mx-auto rounded-full bg-orange-50 flex items-center justify-center">
                            <svg className="w-10 h-10 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-medium text-gray-800">Your Wishlist</h2>
                        <p className="text-gray-500 text-sm max-w-md">Sign in to view and manage your saved products. Never lose track of the items you love!</p>
                        <button
                            onClick={openSignIn}
                            className="px-8 py-2.5 bg-orange-500 text-white rounded-full font-medium hover:bg-orange-600 transition mt-2"
                        >
                            Sign In
                        </button>
                    </div>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-start px-6 md:px-16 lg:px-32 min-h-screen w-full pb-20">
                <div className="pt-12 mb-8">
                    <p className="text-2xl font-medium">My <span className="text-orange-500">Wishlist</span></p>
                    <div className="w-16 h-0.5 bg-orange-600 rounded-full mt-1"></div>
                    <p className="text-sm text-gray-500 mt-2">{wishlistedProducts.length} item{wishlistedProducts.length !== 1 ? 's' : ''} saved</p>
                </div>

                {wishlistedProducts.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 w-full">
                        {wishlistedProducts.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center w-full py-20 text-gray-400">
                        <div className="w-20 h-20 rounded-full bg-gray-50 flex items-center justify-center mb-4">
                            <svg className="w-10 h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <p className="text-lg font-medium text-gray-500">Your wishlist is empty</p>
                        <p className="text-sm text-gray-400 mt-1">Start adding products you love!</p>
                        <button
                            onClick={() => window.location.href = '/all-products'}
                            className="mt-4 px-6 py-2 bg-orange-500 text-white rounded-full text-sm hover:bg-orange-600 transition"
                        >
                            Browse Products
                        </button>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

export default Wishlist;
