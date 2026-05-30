'use client'
import React, { useEffect, useState } from "react";
import { assets, productsDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";
import toast from "react-hot-toast";

const ProductList = () => {

  const { router } = useAppContext()

  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const maxPage = Math.max(1, Math.ceil(products.length / ITEMS_PER_PAGE));
    if (currentPage > maxPage) {
      setCurrentPage(maxPage);
    }
  }, [products, currentPage]);

  const fetchSellerProduct = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success && data.products && data.products.length > 0) {
        setProducts(data.products);
      } else {
        setProducts(productsDummyData);
      }
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts(productsDummyData);
    } finally {
      setLoading(false);
    }
  }

  const handleDelete = async (productId) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    const toastId = toast.loading("Deleting product...");
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE"
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Product deleted successfully!", { id: toastId });
        setProducts(products.filter(p => p._id !== productId));
      } else {
        toast.error(data.message || "Failed to delete product", { id: toastId });
      }
    } catch (error) {
      toast.error("Error deleting product", { id: toastId });
    }
  }

  useEffect(() => {
    fetchSellerProduct();
  }, []);

  const totalPages = Math.ceil(products.length / ITEMS_PER_PAGE);
  const paginatedProducts = products.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between w-full overflow-hidden">
      {loading ? <Loading /> : <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Product</h2>
        <div className="max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <div className="w-full overflow-x-auto">
            <table className="table-auto w-full min-w-[600px] sm:min-w-0">
              <thead className="text-gray-900 text-sm text-left border-b">
                <tr>
                  <th className="px-4 py-3 font-medium truncate w-1/3">Product</th>
                  <th className="px-4 py-3 font-medium truncate max-sm:hidden w-1/5">Category</th>
                  <th className="px-4 py-3 font-medium truncate w-1/6">Price</th>
                  <th className="px-4 py-3 font-medium truncate w-1/6">Stock</th>
                  <th className="px-4 py-3 font-medium truncate w-1/5">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-500">
                {paginatedProducts.map((product, index) => (
                  <tr key={index} className="border-b last:border-0 border-gray-500/20 hover:bg-gray-50/50">
                    <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                      <div className="bg-gray-500/10 rounded p-1.5 flex-shrink-0">
                        <Image
                          src={product.image[0]}
                          alt="product Image"
                          className="w-12 h-12 object-cover rounded"
                          width={1280}
                          height={720}
                        />
                      </div>
                      <span className="truncate font-medium text-gray-800">
                        {product.name}
                      </span>
                    </td>
                    <td className="px-4 py-3 max-sm:hidden">{product.category}</td>
                    <td className="px-4 py-3 font-medium">₱{product.offerPrice}</td>
                    <td className="px-4 py-3 font-semibold">
                      {product.stock !== undefined ? (
                        product.stock > 0 ? (
                          <span className="text-green-600">{product.stock}</span>
                        ) : (
                          <span className="text-red-500">Out of stock</span>
                        )
                      ) : (
                        <span className="text-gray-400">50 (Default)</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <button onClick={() => router.push(`/product/${product._id}`)} className="px-2 py-1 text-xs bg-orange-500 text-white rounded hover:bg-orange-600 transition">
                          Visit
                        </button>
                        <button onClick={() => router.push(`/seller/edit-product/${product._id}`)} className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600 transition">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(product._id)} className="px-2 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* Table Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 px-4 py-3 bg-gray-50 text-xs sm:text-sm">
              <div className="text-gray-500">
                Showing <span className="font-medium">{(currentPage - 1) * ITEMS_PER_PAGE + 1}</span> to{" "}
                <span className="font-medium">{Math.min(currentPage * ITEMS_PER_PAGE, products.length)}</span> of{" "}
                <span className="font-medium">{products.length}</span> products
              </div>
              <div className="flex gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="px-3 py-1.5 border rounded bg-white text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Previous
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="px-3 py-1.5 border rounded bg-white text-gray-700 hover:bg-gray-100 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      </div>}
      <Footer />
    </div>
  );
};

export default ProductList;