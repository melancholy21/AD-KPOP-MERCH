import React from "react";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";
import { useAppContext } from "@/context/AppContext";

const HomeProducts = () => {

  const { products, loadingProducts, router } = useAppContext()

  const getAverageRating = (product) => {
    if (!product.reviews || product.reviews.length === 0) return 0;
    const total = product.reviews.reduce((sum, r) => sum + r.rating, 0);
    return total / product.reviews.length;
  };

  const popularProducts = [...products]
    .sort((a, b) => getAverageRating(b) - getAverageRating(a))
    .slice(0, 10);

  return (
    <div className="flex flex-col items-center pt-14">
      <p className="text-2xl font-medium text-left w-full">Popular products</p>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex-col items-center gap-6 mt-6 pb-14 w-full">
        {loadingProducts
          ? Array.from({ length: 10 }).map((_, index) => (
              <ProductCardSkeleton key={index} />
            ))
          : popularProducts.map((product, index) => (
              <ProductCard key={index} product={product} />
            ))}
      </div>
      <button onClick={() => { router.push('/all-products') }} className="px-12 py-2.5 border rounded text-gray-500/70 hover:bg-slate-50/90 transition">
        See more
      </button>
    </div>
  );
};

export default HomeProducts;
