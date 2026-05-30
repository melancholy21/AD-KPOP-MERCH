'use client'
import React from 'react';
import { usePathname } from 'next/navigation';
import { useAppContext } from '@/context/AppContext';
import { useUser } from '@clerk/nextjs';
import { useClerk } from '@clerk/nextjs';

const BottomNav = () => {
    const pathname = usePathname();
    const { router, getCartCount } = useAppContext();
    const { isSignedIn } = useUser();
    const { openSignIn } = useClerk();

    // Hide bottom nav on seller dashboard pages
    if (pathname?.startsWith('/seller')) return null;

    const cartCount = getCartCount();

    const navItems = [
        {
            label: "Home",
            path: "/",
            icon: (active) => (
                <svg className="w-5 h-5" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="m4 12 8-8 8 8M6 10.5V19a1 1 0 0 0 1 1h3v-3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v3h3a1 1 0 0 0 1-1v-8.5" />
                </svg>
            )
        },
        {
            label: "Shop",
            path: "/all-products",
            icon: (active) => (
                <svg className="w-5 h-5" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            )
        },
        {
            label: "Cart",
            path: "/cart",
            icon: (active) => (
                <svg className="w-5 h-5" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" />
                </svg>
            ),
            badge: cartCount
        },
        {
            label: "Account",
            path: null,
            icon: (active) => (
                <svg className="w-5 h-5" fill={active ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
            ),
            action: () => {
                if (isSignedIn) {
                    router.push('/my-orders');
                } else {
                    openSignIn();
                }
            }
        }
    ];

    const isActive = (path) => {
        if (!path) return false;
        if (path === '/') return pathname === '/';
        return pathname?.startsWith(path);
    };

    return (
        <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-lg border-t border-gray-200 z-50 pb-[env(safe-area-inset-bottom)]">
            <div className="flex items-center justify-around py-2">
                {navItems.map((item) => {
                    const active = isActive(item.path);
                    return (
                        <button
                            key={item.label}
                            onClick={() => {
                                if (item.action) {
                                    item.action();
                                } else if (item.path) {
                                    router.push(item.path);
                                }
                            }}
                            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg transition-all ${
                                active ? 'text-orange-500' : 'text-gray-400 hover:text-gray-600'
                            }`}
                        >
                            <div className="relative">
                                {item.icon(active)}
                                {item.badge > 0 && (
                                    <span className="absolute -top-1.5 -right-2 bg-orange-500 text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                                        {item.badge > 9 ? '9+' : item.badge}
                                    </span>
                                )}
                            </div>
                            <span className={`text-[10px] font-medium ${active ? 'text-orange-500' : ''}`}>
                                {item.label}
                            </span>
                        </button>
                    );
                })}
            </div>
        </nav>
    );
};

export default BottomNav;
