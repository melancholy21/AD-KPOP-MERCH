'use client'
import React, { useState, useEffect } from "react";
import ProductCard from "@/components/ProductCard";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { assets } from "@/assets/assets";

const AllProducts = () => {

    const { 
        products, 
        searchQuery, 
        setSearchQuery, 
        selectedCategory, 
        setSelectedCategory, 
        sortOption, 
        setSortOption 
    } = useAppContext();

    const [currentPage, setCurrentPage] = useState(1);
    const ITEMS_PER_PAGE = 12;

    const categories = ["All", "Bubble Sticker", "Banner", "Photocards", "LOMO Cards"];

    // Reset to page 1 when search query, category or sort changes
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, selectedCategory, sortOption]);

    const filteredProducts = products
        .filter(product => {
            const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                                   product.description.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory = selectedCategory === "All" || product.category === selectedCategory;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            if (sortOption === "low-high") {
                return a.offerPrice - b.offerPrice;
            } else if (sortOption === "high-low") {
                return b.offerPrice - a.offerPrice;
            } else if (sortOption === "newest") {
                return b.date - a.date;
            }
            return 0; // default
        });

    const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE);
    const paginatedProducts = filteredProducts.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <>
            <Navbar />
            <div className="flex flex-col items-start px-6 md:px-16 lg:px-32 min-h-screen w-full">
                
                {/* Header & Search Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between w-full pt-12 gap-4">
                    <div>
                        <p className="text-2xl font-medium">All Products</p>
                        <div className="w-16 h-0.5 bg-orange-600 rounded-full mt-1"></div>
                    </div>
                    
                    {/* Search Bar for mobile and desktop catalog browsing */}
                    <div className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-2 bg-gray-50/50 w-full sm:max-w-xs">
                        <input 
                            type="text" 
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search merch..." 
                            className="bg-transparent outline-none text-sm w-full"
                        />
                        <Image className="w-4 h-4 opacity-60" src={assets.search_icon} alt="search icon" />
                    </div>
                </div>

                {/* Filters and Search Info */}
                <div className="flex flex-col md:flex-row md:items-center justify-between w-full mt-8 gap-4 border-b pb-5">
                    {/* Category tabs */}
                    <div className="flex flex-wrap items-center gap-2">
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setSelectedCategory(category)}
                                className={`px-4 py-1.5 rounded-full text-xs font-medium transition ${
                                    selectedCategory === category
                                        ? "bg-orange-500 text-white"
                                        : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>

                    {/* Sorting dropdown */}
                    <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">Sort by:</span>
                        <select
                            value={sortOption}
                            onChange={(e) => setSortOption(e.target.value)}
                            className="text-xs border rounded px-3 py-1.5 bg-white text-gray-700 outline-none focus:border-orange-500"
                        >
                            <option value="default">Default</option>
                            <option value="low-high">Price: Low to High</option>
                            <option value="high-low">Price: High to Low</option>
                            <option value="newest">Newest Arrivals</option>
                        </select>
                    </div>
                </div>

                {/* Search query feedback */}
                {searchQuery && (
                    <p className="text-xs text-gray-500 mt-4">
                        Showing results for &quot;<span className="font-semibold">{searchQuery}</span>&quot; ({filteredProducts.length} items found)
                    </p>
                )}

                {/* Products Grid */}
                {paginatedProducts.length > 0 ? (
                    <>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
                            {paginatedProducts.map((product, index) => (
                                <ProductCard key={index} product={product} />
                            ))}
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-2 pb-14 w-full text-xs sm:text-sm">
                                <button
                                    disabled={currentPage === 1}
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    className="px-3 py-1.5 border rounded-md bg-white hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-medium"
                                >
                                    Previous
                                </button>
                                
                                {[...Array(totalPages)].map((_, i) => {
                                    const pageNum = i + 1;
                                    return (
                                        <button
                                            key={pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={`w-8 h-8 border rounded-md transition font-medium ${
                                                currentPage === pageNum
                                                    ? "bg-orange-500 text-white border-orange-500"
                                                    : "bg-white text-gray-700 hover:bg-gray-50"
                                            }`}
                                        >
                                            {pageNum}
                                        </button>
                                    );
                                })}

                                <button
                                    disabled={currentPage === totalPages}
                                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                    className="px-3 py-1.5 border rounded-md bg-white hover:bg-gray-50 transition disabled:opacity-50 disabled:cursor-not-allowed text-gray-700 font-medium"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center w-full py-20 text-gray-400">
                        <p className="text-lg">No products found matching your criteria.</p>
                        <button 
                            onClick={() => { setSelectedCategory("All"); setSortOption("default"); }} 
                            className="text-xs text-orange-500 underline mt-2"
                        >
                            Reset filters
                        </button>
                    </div>
                )}

            </div>
            <Footer />
        </>
    );
};

export default AllProducts;
