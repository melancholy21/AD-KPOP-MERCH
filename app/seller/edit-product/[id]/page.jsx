'use client'
import React, { useEffect, useState } from "react";
import { assets } from "@/assets/assets";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useAppContext } from "@/context/AppContext";
import toast from "react-hot-toast";
import Loading from "@/components/Loading";

const EditProduct = () => {
  const { id } = useParams();
  const { fetchProductData, router } = useAppContext();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('Bubble Sticker');
  const [price, setPrice] = useState('');
  const [offerPrice, setOfferPrice] = useState('');
  const [images, setImages] = useState([null, null, null, null]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const fetchProductDetails = async () => {
    try {
      const res = await fetch(`/api/products/${id}`);
      const data = await res.json();
      if (data.success) {
        setName(data.product.name);
        setDescription(data.product.description);
        setCategory(data.product.category);
        setPrice(data.product.price);
        setOfferPrice(data.product.offerPrice);
        
        // Populate images array
        const productImgs = [...data.product.image];
        while (productImgs.length < 4) {
          productImgs.push(null);
        }
        setImages(productImgs);
      } else {
        toast.error("Failed to load product details");
      }
    } catch (error) {
      toast.error("Error loading product details");
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchProductDetails();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const toastId = toast.loading("Updating product...");

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("offerPrice", offerPrice);
      
      images.forEach((img, index) => {
        if (img) {
          formData.append(`image${index}`, img);
        }
      });

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        body: formData,
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Product updated successfully!", { id: toastId });
        await fetchProductData();
        router.push("/seller/product-list");
      } else {
        toast.error(data.message || "Failed to update product.", { id: toastId });
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  const getPreviewSrc = (item) => {
    if (!item) return assets.upload_area;
    if (typeof item === 'string') return item;
    return URL.createObjectURL(item);
  };

  if (fetching) return <div className="flex-1 min-h-screen flex items-center justify-center"><Loading /></div>;

  return (
    <div className="flex-1 min-h-screen flex flex-col justify-between">
      <form onSubmit={handleSubmit} className="md:p-10 p-4 space-y-5 max-w-lg">
        <h2 className="text-xl font-semibold text-gray-800">Edit Product</h2>
        
        <div>
          <p className="text-base font-medium">Product Image</p>
          <div className="flex flex-wrap items-center gap-3 mt-2">
            {images.map((img, index) => (
              <label key={index} htmlFor={`image${index}`}>
                <input 
                  onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) {
                      const updatedImages = [...images];
                      updatedImages[index] = file;
                      setImages(updatedImages);
                    }
                  }} 
                  type="file" 
                  id={`image${index}`} 
                  hidden 
                />
                <Image
                  className="max-w-24 max-h-24 object-cover cursor-pointer border rounded bg-gray-50"
                  src={getPreviewSrc(img)}
                  alt=""
                  width={100}
                  height={100}
                  unoptimized={typeof img === 'string'}
                />
              </label>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-name">
            Product Name
          </label>
          <input
            id="product-name"
            type="text"
            placeholder="Type here"
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
          />
        </div>

        <div className="flex flex-col gap-1 max-w-md">
          <label className="text-base font-medium" htmlFor="product-description">
            Product Description
          </label>
          <textarea
            id="product-description"
            rows={4}
            className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40 resize-none"
            placeholder="Type here"
            onChange={(e) => setDescription(e.target.value)}
            value={description}
            required
          ></textarea>
        </div>

        <div className="flex items-center gap-5 flex-wrap">
          <div className="flex flex-col gap-1 w-36">
            <label className="text-base font-medium" htmlFor="category">
              Category
            </label>
            <select
              id="category"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
            >
              <option value="Bubble Sticker">Bubble Sticker</option>
              <option value="Banner">Banner</option>
              <option value="Photocards">Photocards</option>
              <option value="LOMO Cards">LOMO Cards</option>
            </select>
          </div>

          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="product-price">
              Product Price
            </label>
            <input
              id="product-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setPrice(e.target.value)}
              value={price}
              required
            />
          </div>

          <div className="flex flex-col gap-1 w-32">
            <label className="text-base font-medium" htmlFor="offer-price">
              Offer Price
            </label>
            <input
              id="offer-price"
              type="number"
              placeholder="0"
              className="outline-none md:py-2.5 py-2 px-3 rounded border border-gray-500/40"
              onChange={(e) => setOfferPrice(e.target.value)}
              value={offerPrice}
              required
            />
          </div>
        </div>

        <div className="flex gap-4">
          <button 
            disabled={loading} 
            type="submit" 
            className="px-8 py-2.5 bg-orange-500 text-white font-medium rounded disabled:bg-orange-300 hover:bg-orange-600 transition"
          >
            {loading ? 'Updating...' : 'Save Changes'}
          </button>
          <button 
            type="button"
            onClick={() => router.push("/seller/product-list")}
            className="px-8 py-2.5 border border-gray-300 text-gray-700 font-medium rounded hover:bg-gray-50 transition"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditProduct;
