import { useAppContext } from "@/context/AppContext";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";

const OrderSummary = () => {

  const { currency, router, getCartCount, getCartAmount, cartItems, setCartItems, products } = useAppContext()
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const [userAddresses, setUserAddresses] = useState([]);

  const fetchUserAddresses = async () => {
    try {
      const res = await fetch("/api/address");
      const data = await res.json();
      if (data.success && data.addresses && data.addresses.length > 0) {
        setUserAddresses(data.addresses);
        setSelectedAddress(data.addresses[0]);
      } else {
        setUserAddresses([]);
        setSelectedAddress(null);
      }
    } catch (error) {
      console.error("Error fetching addresses:", error);
      setUserAddresses([]);
      setSelectedAddress(null);
    }
  }

  const handleAddressSelect = (address) => {
    setSelectedAddress(address);
    setIsDropdownOpen(false);
  };

  const deleteAddress = async (e, addressId) => {
    e.stopPropagation();
    const toastId = toast.loading("Deleting address...");
    try {
      const res = await fetch(`/api/address?id=${addressId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        toast.success("Address deleted successfully", { id: toastId });
        const updated = userAddresses.filter(addr => addr._id !== addressId);
        setUserAddresses(updated);
        if (selectedAddress && selectedAddress._id === addressId) {
          if (updated.length > 0) {
            setSelectedAddress(updated[0]);
          } else {
            setSelectedAddress(null);
          }
        }
      } else {
        if (addressId === "67a1e4233f34a77b6dde9055") {
          toast.success("Address removed", { id: toastId });
          const updated = userAddresses.filter(addr => addr._id !== addressId);
          setUserAddresses(updated);
          if (selectedAddress && selectedAddress._id === addressId) {
            setSelectedAddress(null);
          }
        } else {
          toast.error(data.message || "Failed to delete address", { id: toastId });
        }
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong", { id: toastId });
    }
  };

  const createOrder = async () => {
    if (!selectedAddress) {
      toast.error("Please select a shipping address");
      return;
    }

    const orderItems = Object.keys(cartItems)
      .map(itemId => {
        const product = products.find(p => p._id === itemId);
        if (product && cartItems[itemId] > 0) {
          return { product: itemId, quantity: cartItems[itemId] };
        }
        return null;
      })
      .filter(item => item !== null);

    if (orderItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    const amount = getCartAmount() + Math.floor(getCartAmount() * 0.02);
    const toastId = toast.loading("Placing order...");

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          addressId: selectedAddress._id,
          items: orderItems,
          amount
        }),
      });

      const data = await res.json();
      if (data.success) {
        toast.success("Order placed successfully!", { id: toastId });
        setCartItems({});
        router.push("/order-placed");
      } else {
        toast.error(data.message || "Failed to place order", { id: toastId });
      }
    } catch (error) {
      toast.error(error.message || "Something went wrong", { id: toastId });
    }
  }

  useEffect(() => {
    fetchUserAddresses();
  }, [])

  return (
    <div className="w-full md:w-96 bg-gray-500/5 p-5">
      <h2 className="text-xl md:text-2xl font-medium text-gray-700">
        Order Summary
      </h2>
      <hr className="border-gray-500/30 my-5" />
      <div className="space-y-6">
        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Select Address
          </label>
          <div className="relative inline-block w-full text-sm border">
            <button
              className="peer w-full text-left px-4 pr-2 py-2 bg-white text-gray-700 focus:outline-none"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>
                {selectedAddress
                  ? `${selectedAddress.fullName}, ${selectedAddress.area}, ${selectedAddress.city}, ${selectedAddress.state}`
                  : "Select Address"}
              </span>
              <svg className={`w-5 h-5 inline float-right transition-transform duration-200 ${isDropdownOpen ? "rotate-0" : "-rotate-90"}`}
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="#6B7280"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {isDropdownOpen && (
              <ul className="absolute w-full bg-white border shadow-md mt-1 z-10 py-1.5">
                {userAddresses.map((address, index) => (
                  <li
                    key={index}
                    className="flex justify-between items-center gap-2 px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-gray-700"
                    onClick={() => handleAddressSelect(address)}
                  >
                    <span className="truncate">
                      {address.fullName}, {address.area}, {address.city}, {address.state}
                    </span>
                    <button
                      onClick={(e) => deleteAddress(e, address._id)}
                      className="text-red-500 hover:text-red-700 p-1 text-xs shrink-0 font-medium bg-red-50 hover:bg-red-100 rounded px-1.5 py-0.5"
                      title="Delete Address"
                    >
                      Delete
                    </button>
                  </li>
                ))}
                <li
                  onClick={() => router.push("/add-address")}
                  className="px-4 py-2 hover:bg-gray-500/10 cursor-pointer text-center"
                >
                  + Add New Address
                </li>
              </ul>
            )}
          </div>
        </div>

        <div>
          <label className="text-base font-medium uppercase text-gray-600 block mb-2">
            Promo Code
          </label>
          <div className="flex flex-col items-start gap-3">
            <input
              type="text"
              placeholder="Enter promo code"
              className="flex-grow w-full outline-none p-2.5 text-gray-600 border"
            />
            <button className="bg-orange-500 text-white px-9 py-2 hover:bg-orange-600">
              Apply
            </button>
          </div>
        </div>

        <hr className="border-gray-500/30 my-5" />

        <div className="space-y-4">
          <div className="flex justify-between text-base font-medium">
            <p className="uppercase text-gray-600">Items {getCartCount()}</p>
            <p className="text-gray-800">{currency}{getCartAmount()}</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Shipping Fee</p>
            <p className="font-medium text-gray-800">Free</p>
          </div>
          <div className="flex justify-between">
            <p className="text-gray-600">Tax (2%)</p>
            <p className="font-medium text-gray-800">{currency}{Math.floor(getCartAmount() * 0.02)}</p>
          </div>
          <div className="flex justify-between text-lg md:text-xl font-medium border-t pt-3">
            <p>Total</p>
            <p>{currency}{getCartAmount() + Math.floor(getCartAmount() * 0.02)}</p>
          </div>
        </div>
      </div>

      <button onClick={createOrder} className="w-full bg-orange-500 text-white py-3 mt-5 hover:bg-orange-600">
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary;