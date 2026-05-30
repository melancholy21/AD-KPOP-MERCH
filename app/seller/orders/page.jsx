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
    const [activeTab, setActiveTab] = useState('active'); // 'active' or 'completed'

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

    const handleDeleteOrder = async (orderId) => {
        if (!confirm("Are you sure you want to permanently delete this order?")) return;
        const toastId = toast.loading("Deleting order...");
        try {
            const res = await fetch(`/api/orders?orderId=${orderId}`, {
                method: "DELETE"
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Order deleted successfully!", { id: toastId });
                setOrders(orders.filter(o => o._id !== orderId));
            } else {
                toast.error(data.message || "Failed to delete order", { id: toastId });
            }
        } catch (error) {
            toast.error("Error deleting order", { id: toastId });
        }
    }

    useEffect(() => {
        fetchSellerOrders();
    }, []);

    const filteredOrders = orders.filter(order => {
        const isCompleted = order.status === "Delivered" || order.status === "Cancelled";
        return activeTab === 'completed' ? isCompleted : !isCompleted;
    });

    return (
        <div className="flex-1 h-screen overflow-scroll flex flex-col justify-between text-sm w-full overflow-x-hidden">
            {loading ? <Loading /> : <div className="md:p-10 p-4 space-y-5">
                <div className="flex justify-between items-center max-w-4xl">
                    <h2 className="text-xl font-semibold text-gray-800">Manage Orders</h2>
                </div>
                
                {/* Active vs Completed Tab Headers */}
                <div className="flex border-b border-gray-200 max-w-4xl">
                    <button
                        onClick={() => setActiveTab('active')}
                        className={`py-2.5 px-4 text-sm font-medium border-b-2 transition ${
                            activeTab === 'active'
                                ? 'border-orange-500 text-orange-600 font-semibold'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Active Orders ({orders.filter(o => o.status !== "Delivered" && o.status !== "Cancelled").length})
                    </button>
                    <button
                        onClick={() => setActiveTab('completed')}
                        className={`py-2.5 px-4 text-sm font-medium border-b-2 transition ${
                            activeTab === 'completed'
                                ? 'border-orange-500 text-orange-600 font-semibold'
                                : 'border-transparent text-gray-500 hover:text-gray-700'
                        }`}
                    >
                        Completed & Archived ({orders.filter(o => o.status === "Delivered" || o.status === "Cancelled").length})
                    </button>
                </div>

                {filteredOrders.length > 0 ? (
                    <div className="max-w-4xl rounded-md bg-white border border-gray-200 divide-y divide-gray-200">
                        {filteredOrders.map((order, index) => (
                            <div key={index} className="flex flex-col md:flex-row gap-5 justify-between p-5 hover:bg-gray-50/50 transition">
                                <div className="flex-1 flex gap-5 max-w-80">
                                    <Image
                                        className="max-w-16 max-h-16 object-cover"
                                        src={assets.box_icon}
                                        alt="box_icon"
                                    />
                                    <p className="flex flex-col gap-2">
                                        <span className="font-medium text-gray-800">
                                            {order.items.map((item) => (item.product?.name || "Deleted Product") + ` x ${item.quantity}`).join(", ")}
                                        </span>
                                        <span className="text-gray-500 text-xs">Total Items : {order.items.length}</span>
                                    </p>
                                </div>
                                <div>
                                    {order.address ? (
                                        <p className="text-gray-600 leading-relaxed">
                                            <span className="font-semibold text-gray-800">{order.address.fullName}</span>
                                            <br />
                                            <span>{order.address.area}</span>
                                            <br />
                                            <span>{`${order.address.city}, ${order.address.state}`}</span>
                                            <br />
                                            <span className="text-xs text-gray-500">{order.address.phoneNumber}</span>
                                        </p>
                                    ) : (
                                        <p className="text-red-400 italic font-medium">Address details unavailable</p>
                                    )}
                                </div>
                                <p className="font-semibold text-gray-800 my-auto text-base">{currency}{order.amount}</p>
                                <div>
                                    <div className="flex flex-col gap-1.5">
                                        <span className="text-gray-500 text-xs">Method : COD</span>
                                        <span className="text-gray-500 text-xs">Date : {new Date(order.date).toLocaleDateString()}</span>
                                        <span className="text-gray-500 text-xs">Payment : Pending</span>
                                        <div className="flex flex-row items-center gap-2 mt-2">
                                            <select
                                                value={order.status}
                                                onChange={(e) => handleStatusChange(order._id, e.target.value)}
                                                className="border rounded px-2 py-1 text-xs bg-white text-gray-700 outline-none focus:border-orange-500 font-medium"
                                            >
                                                <option value="Order Placed">Order Placed</option>
                                                <option value="Packing">Packing</option>
                                                <option value="Shipped">Shipped</option>
                                                <option value="Out for Delivery">Out for Delivery</option>
                                                <option value="Delivered">Delivered</option>
                                                <option value="Cancelled">Cancelled</option>
                                            </select>
                                            
                                            {/* Delete Order Button */}
                                            <button 
                                                onClick={() => handleDeleteOrder(order._id)}
                                                className="p-1.5 border border-red-200 text-red-500 rounded hover:bg-red-50 hover:border-red-300 transition duration-150"
                                                title="Delete Order"
                                            >
                                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                </svg>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 border rounded-lg bg-gray-50/50 mt-4 text-gray-500 max-w-4xl">
                        <p className="text-base font-medium">No {activeTab} orders found.</p>
                    </div>
                )}
            </div>}
            <Footer />
        </div>
    );
};

export default Orders;