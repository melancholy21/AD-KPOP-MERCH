import React from 'react';

const ProductCardSkeleton = () => {
    return (
        <div className="flex flex-col items-start gap-0.5 max-w-[200px] w-full bg-white rounded-xl p-2 border border-gray-100 shadow-sm animate-pulse">
            {/* Image Placeholder */}
            <div className="relative bg-gray-200/60 rounded-lg w-full h-52 overflow-hidden">
                {/* Shimmer overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
            </div>

            {/* Title Placeholder */}
            <div className="relative h-4 bg-gray-200/60 rounded w-4/5 mt-3 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
            </div>

            {/* Description Placeholder */}
            <div className="relative h-3 bg-gray-100 rounded w-11/12 mt-2 max-sm:hidden overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
            </div>

            {/* Rating Placeholder */}
            <div className="flex items-center gap-2 mt-2 w-full">
                <div className="relative h-3 bg-gray-200/60 rounded w-6 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
                </div>
                <div className="flex gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <div key={i} className="relative h-3 w-3 bg-gray-200/60 rounded-full overflow-hidden">
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price and CTA Placeholder */}
            <div className="flex items-center justify-between w-full mt-3 pt-0.5">
                <div className="relative h-5 bg-gray-200/60 rounded w-1/3 overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
                </div>
                <div className="relative h-7 bg-gray-200/60 rounded-full w-20 max-sm:hidden overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full animate-shimmer"></div>
                </div>
            </div>
        </div>
    );
};

export default ProductCardSkeleton;
