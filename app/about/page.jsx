'use client'
import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const About = () => {
    const team = [
        {
            name: "Angelo Dela Torre",
            role: "Full-Stack Developer",
            bio: "Angelo is the technical powerhouse behind AD KPOP MERCH. He designed and built the entire e-commerce platform from scratch using Next.js, MongoDB, and modern web technologies. From payment flows to real-time inventory management, Angelo ensures every feature runs smoothly and every fan gets a seamless shopping experience.",
            linkedin: "https://www.linkedin.com/in/dela-torre-angelo-2103z/",
            github: "https://github.com/melancholy21",
            initial: "A"
        },
        {
            name: "Dur Ramos",
            role: "Graphic Designer",
            bio: "Dur brings every product to life with stunning visuals and creative designs. From bubble stickers to banners and LOMO cards, Dur's artistic vision defines the unique aesthetic of AD KPOP MERCH. With a keen eye for detail and a deep love for K-pop culture, Dur ensures every piece of merchandise is a work of art.",
            linkedin: "https://www.linkedin.com/in/durramos/",
            instagram: "https://www.instagram.com/xxddor",
            initial: "D"
        }
    ];

    return (
        <>
            <Navbar />
            <div className="px-6 md:px-16 lg:px-32 py-14 min-h-screen">

                {/* Hero Section */}
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <p className="text-sm font-medium text-orange-500 uppercase tracking-widest mb-3">About Us</p>
                    <h1 className="text-3xl md:text-4xl font-semibold text-gray-800 mb-4">
                        The Story Behind <span className="text-orange-500">AD KPOP MERCH</span>
                    </h1>
                    <div className="w-20 h-0.5 bg-orange-500 mx-auto mb-6"></div>
                    <p className="text-gray-500 leading-relaxed">
                        Born from a shared love for K-pop and entrepreneurship, AD KPOP MERCH is a passion project created as part of our Technopreneurship subject.
                        What started as an academic requirement quickly grew into something we truly believe in — a platform where Filipino K-pop fans can discover and shop for high-quality,
                        beautifully designed merchandise without breaking the bank.
                    </p>
                </div>

                {/* Mission Section */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
                    <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-2xl p-8 text-center">
                        <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">Our Mission</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            To make high-quality K-pop merchandise accessible and affordable to every fan in the Philippines, while supporting local creativity and design.
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-2xl p-8 text-center">
                        <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">Our Vision</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            To become the go-to online destination for K-pop fans seeking unique, customizable, and collectible merchandise that celebrates their favorite artists.
                        </p>
                    </div>
                    <div className="bg-gradient-to-br from-orange-50 to-white border border-orange-100 rounded-2xl p-8 text-center">
                        <div className="w-14 h-14 bg-orange-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                            <svg className="w-7 h-7 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                            </svg>
                        </div>
                        <h3 className="font-semibold text-gray-800 mb-2">Our Values</h3>
                        <p className="text-sm text-gray-500 leading-relaxed">
                            Fan-first quality, creative excellence, and a genuine passion for K-pop culture drive everything we do — from product design to customer experience.
                        </p>
                    </div>
                </div>

                {/* What We Offer */}
                <div className="mb-20 max-w-3xl mx-auto text-center">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">What We Offer</h2>
                    <div className="w-16 h-0.5 bg-orange-500 mx-auto mb-6"></div>
                    <p className="text-gray-500 mb-8 leading-relaxed">
                        AD KPOP MERCH is more than just a store — it&apos;s a creative space where fans can celebrate their love for K-pop through unique, high-quality, and customizable merchandise.
                    </p>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {["Bubble Stickers", "Banners", "Photocards", "LOMO Cards"].map((item) => (
                            <div key={item} className="bg-gray-50 rounded-xl py-4 px-3 text-sm font-medium text-gray-600 border border-gray-100 hover:border-orange-200 hover:bg-orange-50 transition">
                                {item}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Team Section */}
                <div className="mb-16">
                    <div className="text-center mb-12">
                        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Meet the Team</h2>
                        <div className="w-16 h-0.5 bg-orange-500 mx-auto mb-4"></div>
                        <p className="text-sm text-gray-500">The duo behind AD KPOP MERCH — built with 💛 for YOU</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                        {team.map((member) => (
                            <div key={member.name} className="bg-white border border-gray-100 rounded-2xl p-8 shadow-sm hover:shadow-md transition text-center">
                                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center mx-auto mb-4 shadow-lg">
                                    <span className="text-2xl font-bold text-white">{member.initial}</span>
                                </div>
                                <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                                <p className="text-sm font-medium text-orange-500 mb-3">{member.role}</p>
                                <p className="text-sm text-gray-500 leading-relaxed mb-5">{member.bio}</p>
                                <div className="flex items-center justify-center gap-3">
                                    <a
                                        href={member.linkedin}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-blue-50 hover:text-blue-600 transition text-gray-500"
                                        title="LinkedIn"
                                    >
                                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                        </svg>
                                    </a>
                                    {member.github && (
                                        <a
                                            href={member.github}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 hover:text-gray-800 transition text-gray-500"
                                            title="GitHub"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                            </svg>
                                        </a>
                                    )}
                                    {member.instagram && (
                                        <a
                                            href={member.instagram}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-orange-50 hover:text-orange-500 transition text-gray-500"
                                            title="Instagram"
                                        >
                                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                                            </svg>
                                        </a>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Technopreneurship Badge */}
                <div className="text-center py-10 border-t border-gray-100">
                    <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 rounded-full px-6 py-2.5">
                        <svg className="w-4 h-4 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                        </svg>
                        <span className="text-sm font-medium text-orange-600">Built for YOU!</span>
                    </div>
                </div>

            </div>
            <Footer />
        </>
    );
};

export default About;
