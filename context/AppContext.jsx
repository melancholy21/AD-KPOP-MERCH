'use client'
import { productsDummyData, userDummyData } from "@/assets/assets";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { createContext, useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY
    const router = useRouter()

    const { user } = useUser()

    const [products, setProducts] = useState([])
    const [loadingProducts, setLoadingProducts] = useState(true)
    const [userData, setUserData] = useState(false)
    const [isSeller, setIsSeller] = useState(false)
    const [cartItems, setCartItems] = useState({})
    const [wishlist, setWishlist] = useState([])
    
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("All");
    const [sortOption, setSortOption] = useState("default");

    const fetchProductData = async () => {
        setLoadingProducts(true)
        try {
            const res = await fetch('/api/products')
            const data = await res.json()
            if (data.success && data.products && data.products.length > 0) {
                setProducts(data.products)
            } else {
                setProducts(productsDummyData)
            }
        } catch (error) {
            console.error("Error fetching products, falling back to dummy data:", error)
            setProducts(productsDummyData)
        } finally {
            setLoadingProducts(false)
        }
    }

    const fetchUserData = async () => {
        if (user) {
            setUserData({
                _id: user.id,
                name: user.fullName,
                email: user.primaryEmailAddress?.emailAddress,
                imageUrl: user.imageUrl,
            })
        } else {
            setUserData(userDummyData)
        }
    }

    const fetchCartData = async () => {
        if (user) {
            try {
                const res = await fetch('/api/cart')
                const data = await res.json()
                if (data.success) {
                    setCartItems(data.cartItems || {})
                }
            } catch (error) {
                console.error("Error fetching cart data:", error)
            }
        } else {
            setCartItems({})
        }
    }

    const addToCart = async (itemId) => {
        if (!user) {
            toast.error("Please sign in to add items to cart");
            return false;
        }

        const product = products.find(p => p._id === itemId);
        const availableStock = product && product.stock !== undefined ? product.stock : 50;
        let cartData = structuredClone(cartItems);
        const currentQty = cartData[itemId] || 0;

        if (currentQty + 1 > availableStock) {
            toast.error(`Cannot add more. Only ${availableStock} units available in stock.`);
            return false;
        }

        if (cartData[itemId]) {
            cartData[itemId] += 1;
        }
        else {
            cartData[itemId] = 1;
        }
        setCartItems(cartData);
        toast.success("Added to cart!");

        try {
            await fetch('/api/cart', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartItems: cartData })
            });
            return true;
        } catch (error) {
            console.error("Error updating cart:", error);
            return false;
        }
    }

    const updateCartQuantity = async (itemId, quantity) => {
        const product = products.find(p => p._id === itemId);
        const availableStock = product && product.stock !== undefined ? product.stock : 50;

        if (quantity > availableStock) {
            toast.error(`Cannot set quantity. Only ${availableStock} units available in stock.`);
            return false;
        }

        let cartData = structuredClone(cartItems);
        if (quantity === 0) {
            delete cartData[itemId];
        } else {
            cartData[itemId] = quantity;
        }
        setCartItems(cartData)

        if (user) {
            try {
                await fetch('/api/cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cartItems: cartData })
                });
                return true;
            } catch (error) {
                console.error("Error updating cart quantity:", error);
                return false;
            }
        }
        return true;
    }

    const getCartCount = () => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }

    const getCartAmount = () => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (itemInfo && cartItems[items] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }

    const fetchWishlist = async () => {
        if (user) {
            try {
                const res = await fetch('/api/wishlist');
                const data = await res.json();
                if (data.success) {
                    setWishlist(data.wishlist || []);
                }
            } catch (error) {
                console.error("Error fetching wishlist:", error);
            }
        } else {
            setWishlist([]);
        }
    };

    const toggleWishlist = async (productId) => {
        if (!user) {
            toast.error("Please sign in to manage your wishlist");
            return;
        }
        try {
            const res = await fetch('/api/wishlist', {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ productId })
            });
            const data = await res.json();
            if (data.success) {
                setWishlist(data.wishlist || []);
                toast.success(
                    data.wishlist.includes(productId) 
                        ? "Added to wishlist!" 
                        : "Removed from wishlist!"
                );
            } else {
                toast.error(data.message || "Failed to update wishlist");
            }
        } catch (error) {
            console.error("Error toggling wishlist:", error);
            toast.error("Something went wrong");
        }
    };

    useEffect(() => {
        fetchProductData()
    }, [])

    useEffect(() => {
        fetchUserData()
        fetchCartData()
        fetchWishlist()
        if (user) {
            setIsSeller(user.publicMetadata?.role === 'seller')
        } else {
            setIsSeller(false)
        }
    }, [user])

    const value = {
        user,
        currency, router,
        isSeller, setIsSeller,
        userData, fetchUserData,
        products, fetchProductData,
        loadingProducts,
        cartItems, setCartItems,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount,
        searchQuery, setSearchQuery,
        selectedCategory, setSelectedCategory,
        sortOption, setSortOption,
        wishlist, toggleWishlist
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}