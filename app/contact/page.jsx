'use client'
import React, { useState } from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import toast from "react-hot-toast";

const Contact = () => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        subject: "",
        message: ""
    });
    const [sending, setSending] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSending(true);
        const toastId = toast.loading("Sending message...");
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });
            const data = await res.json();
            if (data.success) {
                toast.success("Message sent successfully! We'll get back to you soon.", { id: toastId });
                setFormData({ name: "", email: "", subject: "", message: "" });
            } else {
                toast.error(data.message || "Failed to send message. Please try again.", { id: toastId });
            }
        } catch (error) {
            toast.error("Something went wrong. Please try again later.", { id: toastId });
        } finally {
            setSending(false);
        }
    };

    return (
        <>
            <Navbar />
            <div className="px-6 md:px-16 lg:px-32 py-14 min-h-screen">

                {/* Header */}
                <div className="text-center max-w-2xl mx-auto mb-14">
                    <p className="text-sm font-medium text-orange-500 uppercase tracking-widest mb-3">Contact Us</p>
                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
                        Get in <span className="text-orange-500">Touch</span>
                    </h1>
                    <div className="w-20 h-0.5 bg-orange-500 mx-auto mb-6"></div>
                    <p className="text-gray-500">
                        Have questions about our products, custom orders, or collaborations? We&apos;d love to hear from you!
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 max-w-5xl mx-auto">

                    {/* Contact Info Cards */}
                    <div className="lg:col-span-2 space-y-5">
                        <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-2xl p-6">
                            <div className="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
                                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-800 text-sm mb-1">Email</h3>
                            <p className="text-sm text-gray-500">angelodn1234@gmail.com</p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-2xl p-6">
                            <div className="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
                                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-800 text-sm mb-1">Phone</h3>
                            <p className="text-sm text-gray-500">+63 206 345 6789</p>
                        </div>

                        <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-2xl p-6">
                            <div className="w-11 h-11 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
                                <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                            <h3 className="font-semibold text-gray-800 text-sm mb-1">Location</h3>
                            <p className="text-sm text-gray-500">Philippines</p>
                        </div>

                        {/* Social Links */}
                        <div className="flex items-center gap-3 pt-2">
                            <span className="text-xs text-gray-400 font-medium">Follow us:</span>
                            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-orange-50 hover:text-orange-500 transition text-gray-400">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" /></svg>
                            </a>
                            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-orange-50 hover:text-orange-500 transition text-gray-400">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" /></svg>
                            </a>
                            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-orange-50 hover:text-orange-500 transition text-gray-400">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
                            </a>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-3">
                        <form onSubmit={handleSubmit} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm space-y-5">
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">Send us a Message</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-gray-700" htmlFor="contact-name">Name</label>
                                    <input
                                        id="contact-name"
                                        name="name"
                                        type="text"
                                        value={formData.name}
                                        onChange={handleChange}
                                        placeholder="Your name"
                                        className="outline-none py-2.5 px-4 rounded-lg border border-gray-200 focus:border-orange-400 transition text-sm bg-gray-50/50"
                                        required
                                    />
                                </div>
                                <div className="flex flex-col gap-1.5">
                                    <label className="text-sm font-medium text-gray-700" htmlFor="contact-email">Email</label>
                                    <input
                                        id="contact-email"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        className="outline-none py-2.5 px-4 rounded-lg border border-gray-200 focus:border-orange-400 transition text-sm bg-gray-50/50"
                                        required
                                    />
                                </div>
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700" htmlFor="contact-subject">Subject</label>
                                <input
                                    id="contact-subject"
                                    name="subject"
                                    type="text"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    placeholder="What's this about?"
                                    className="outline-none py-2.5 px-4 rounded-lg border border-gray-200 focus:border-orange-400 transition text-sm bg-gray-50/50"
                                    required
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <label className="text-sm font-medium text-gray-700" htmlFor="contact-message">Message</label>
                                <textarea
                                    id="contact-message"
                                    name="message"
                                    rows="5"
                                    value={formData.message}
                                    onChange={handleChange}
                                    placeholder="Tell us what's on your mind..."
                                    className="outline-none py-2.5 px-4 rounded-lg border border-gray-200 focus:border-orange-400 transition text-sm bg-gray-50/50 resize-none"
                                    required
                                ></textarea>
                            </div>
                            <button
                                type="submit"
                                disabled={sending}
                                className="w-full py-3 bg-orange-500 text-white rounded-lg font-medium hover:bg-orange-600 transition disabled:bg-orange-300"
                            >
                                {sending ? "Sending..." : "Send Message"}
                            </button>
                        </form>
                    </div>
                </div>

            </div>
            <Footer />
        </>
    );
};

export default Contact;
