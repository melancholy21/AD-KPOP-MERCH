'use client';
import React, { useEffect, useState } from "react";
import { assets, orderDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/seller/Footer";
import Loading from "@/components/Loading";

import toast from "react-hot-toast";

const Orders = () => {

    const { currency } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchSellerOrders = async () => {
        try {
            const res = await fetch("/api/orders?seller=true");
            const data = await res.json();
            if (data.success && data.orders) {
                setOrders(data.orders);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error("Error fetching seller orders:", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }

    const handleStatusChange = async (orderId, newStatus) => {
        const toastId = toast.loading("Updating status...");
        try {
            const res = await fetch("/api/orders", {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ orderId, status: newStatus })
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Order status updated!", { id: toastId });
                setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
            } else {
                toast.error(data.message || "Failed to update order status", { id: toastId });
            }
        } catch (error) {
            toast.error("Error updating order status", { id: toastId });
        }
    }

    useEffect(() => {
        fetchSellerOrders();
    }, []);

    return (
        <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm w-full overflow-x-hidden">
            {loading ? <Loading /> : <div className="md:p-10 p-4 space-y-5">
                <h2 className="text-lg font-medium">Orders</h2>
                {orders.length > 0 ? (
                    <div className="max-w-4xl rounded-md">
                        {orders.map((order, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-t border-gray-300">
                                <div className="flex-1 flex gap-5 max-w-80">
                                    <Image
                                        className="max-w-16 max-h-16 object-cover"
                                        src={assets.box_icon}
                                        alt="box_icon"
                                    />
                                    <p className="flex flex-col gap-3">
                                        <span className="font-medium">
                                            {order.items.map((item) => (item.product?.name || "Deleted Product") + ` x ${item.quantity}`).join(", ")}
                                        </span>
                                        <span>Items : {order.items.length}</span>
                                    </p>
                                </div>
                                <div>
                                    {order.address ? (
                                        <p>
                                            <span className="font-medium">{order.address.fullName}</span>
                                            <br />
                                            <span>{order.address.area}</span>
                                            <br />
                                            <span>{`${order.address.city}, ${order.address.state}`}</span>
                                            <br />
                                            <span>{order.address.phoneNumber}</span>
                                        </p>
                                    ) : (
                                        <p className="text-gray-400 italic">Address details unavailable</p>
                                    )}
                                </div>
                                <p className="font-medium my-auto">{currency}{order.amount}</p>
                                <div>
                                    <div className="flex flex-col gap-1">
                                        <span>Method : COD</span>
                                        <span>Date : {new Date(order.date).toLocaleDateString()}</span>
                                        <span>Payment : Pending</span>
                                        <div className="mt-2">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                className="border rounded p-1 text-xs bg-white text-gray-700 outline-none focus:border-orange-500"
                                            >
                                                <option value="Order Placed">Order Placed</option>
                                                <option value="Packing">Packing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Out for Delivery">Out for Delivery</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 border rounded-lg bg-gray-50/50 mt-4 text-gray-500 max-w-4xl">
                        <p className="text-base font-medium">No orders have been placed yet.</p>
                    </div>
                )}
            </div>}
            <Footer />
        </div>
    );
};

export default Orders;