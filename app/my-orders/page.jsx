'use client';
import React, { useEffect, useState } from "react";
import { assets, orderDummyData } from "@/assets/assets";
import Image from "next/image";
import { useAppContext } from "@/context/AppContext";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import Loading from "@/components/Loading";

const getStatusStyle = (status) => {
    switch (status) {
        case "Delivered":
            return "bg-green-100 text-green-700 border-green-200";
        case "Shipped":
        case "Out for Delivery":
            return "bg-blue-100 text-blue-700 border-blue-200";
        case "Packing":
            return "bg-orange-100 text-orange-700 border-orange-200";
        case "Cancelled":
            return "bg-red-100 text-red-700 border-red-200";
        case "Order Placed":
        default:
            return "bg-gray-100 text-gray-600 border-gray-200";
    }
};

const getStatusDot = (status) => {
    switch (status) {
        case "Delivered":
            return "bg-green-500";
        case "Shipped":
        case "Out for Delivery":
            return "bg-blue-500";
        case "Packing":
            return "bg-orange-500";
        case "Cancelled":
            return "bg-red-500";
        case "Order Placed":
        default:
            return "bg-gray-400";
    }
};

const MyOrders = () => {

    const { currency } = useAppContext();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async () => {
        try {
            const res = await fetch("/api/orders");
            const data = await res.json();
            if (data.success && data.orders) {
                setOrders(data.orders);
            } else {
                setOrders([]);
            }
        } catch (error) {
            console.error("Error fetching orders:", error);
            setOrders([]);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        fetchOrders();
    }, []);

    return (
        <>
            <Navbar />
            <div className="flex flex-col justify-between px-6 md:px-16 lg:px-32 py-6 min-h-screen pb-24 md:pb-6">
                <div className="space-y-5">
                    <h2 className="text-lg font-medium mt-6">My Orders</h2>
                    {loading ? <Loading /> : (
                        orders.length > 0 ? (
                            <div className="max-w-5xl border-t border-gray-300 text-sm">
                                {orders.map((order, index) => (
                                    <div key={index} className="flex flex-col md:flex-row gap-5 justify-between p-5 border-b border-gray-300">
                                        <div className="flex-1 flex gap-5 max-w-80">
                                            <Image
                                                className="max-w-16 max-h-16 object-cover"
                                                src={assets.box_icon}
                                                alt="box_icon"
                                            />
                                            <p className="flex flex-col gap-3">
                                                <span className="font-medium text-base">
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
                                                {/* Status Badge */}
                                                <span className={`inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-medium border w-fit ${getStatusStyle(order.status)}`}>
                                                    <span className={`w-1.5 h-1.5 rounded-full ${getStatusDot(order.status)}`}></span>
                                                    {order.status || "Order Placed"}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-16 border rounded-lg bg-gray-50/50 mt-4 text-gray-500">
                                <p className="text-base font-medium">You haven&apos;t placed any orders yet.</p>
                                <button onClick={() => router.push('/all-products')} className="mt-4 px-6 py-2 bg-orange-500 text-white rounded hover:bg-orange-600 transition text-sm">
                                    Start Shopping
                                </button>
                            </div>
                        )
                    )}
                </div>
            </div>
            <Footer />
        </>
    );
};

export default MyOrders;