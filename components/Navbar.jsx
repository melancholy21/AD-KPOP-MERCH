"use client"
import React from "react";
import { assets, BagIcon, BoxIcon, CartIcon, HomeIcon} from "@/assets/assets";
import Link from "next/link"
import { useAppContext } from "@/context/AppContext";
import Image from "next/image";
import { useClerk, UserButton } from "@clerk/nextjs";

const HeartMenuIcon = () => (
  <svg className="w-5 h-5 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
  </svg>
);

const Navbar = () => {

  const { isSeller, router, user, getCartCount } = useAppContext();
  const {openSignIn} = useClerk();

  const cartCount = getCartCount();

  return (
    <nav className="flex items-center justify-between px-6 md:px-16 lg:px-32 py-3 border-b border-gray-300 text-gray-700">
      <span
        className="cursor-pointer text-xl md:text-2xl font-bold text-orange-600 tracking-wide"
        onClick={() => router.push('/')}
      >
        AD KPOP MERCH
      </span>
      <div className="flex items-center gap-4 lg:gap-8 max-md:hidden">
        <Link href="/" className="hover:text-gray-900 transition">
          Home
        </Link>
        <Link href="/all-products" className="hover:text-gray-900 transition">
          Shop
        </Link>
        <Link href="/about" className="hover:text-gray-900 transition">
          About Us
        </Link>
        <Link href="/contact" className="hover:text-gray-900 transition">
          Contact
        </Link>

        {isSeller && <button onClick={() => router.push('/seller')} className="text-xs border px-4 py-1.5 rounded-full">Seller Dashboard</button>}

      </div>

      <ul className="hidden md:flex items-center gap-4 ">
        {/* Cart icon with badge */}
        <li className="relative cursor-pointer" onClick={() => router.push('/cart')}>
          <Image src={assets.cart_icon} alt="cart" className="w-5 h-5 opacity-70 hover:opacity-100 transition" />
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-orange-500 text-white text-[10px] font-bold w-4.5 h-4.5 min-w-[18px] min-h-[18px] rounded-full flex items-center justify-center leading-none">
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          )}
        </li>
        {
        user 
        ? <>
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Action label="Home" labelIcon={<HomeIcon />} onClick={()=> router.push('/')} />
          </UserButton.MenuItems>
          <UserButton.MenuItems>
            <UserButton.Action label="Products" labelIcon={<BoxIcon/>} onClick={()=> router.push('/all-products')} />
          </UserButton.MenuItems>
          <UserButton.MenuItems>
            <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={()=> router.push('/cart')} />
          </UserButton.MenuItems>
          <UserButton.MenuItems>
            <UserButton.Action label="Wishlist" labelIcon={<HeartMenuIcon />} onClick={()=> router.push('/wishlist')} />
          </UserButton.MenuItems>
          <UserButton.MenuItems>
            <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={()=> router.push('/my-orders')} />
          </UserButton.MenuItems>
        </UserButton>
        </> 
        : <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
          <Image src={assets.user_icon} alt="user icon" />
          Account
        </button>
        }
      </ul>

      <div className="flex items-center md:hidden gap-3">
        {isSeller && <button onClick={() => router.push('/seller')} className="text-xs border px-4 py-1.5 rounded-full">Seller Dashboard</button>}
        {
        user 
        ? <>
        <UserButton>
          <UserButton.MenuItems>
            <UserButton.Action label="Home" labelIcon={<HomeIcon />} onClick={()=> router.push('/')} />
          </UserButton.MenuItems>
          <UserButton.MenuItems>
            <UserButton.Action label="Products" labelIcon={<BoxIcon/>} onClick={()=> router.push('/all-products')} />
          </UserButton.MenuItems>
          <UserButton.MenuItems>
            <UserButton.Action label="Cart" labelIcon={<CartIcon />} onClick={()=> router.push('/cart')} />
          </UserButton.MenuItems>
          <UserButton.MenuItems>
            <UserButton.Action label="Wishlist" labelIcon={<HeartMenuIcon />} onClick={()=> router.push('/wishlist')} />
          </UserButton.MenuItems>
          <UserButton.MenuItems>
            <UserButton.Action label="My Orders" labelIcon={<BagIcon />} onClick={()=> router.push('/my-orders')} />
          </UserButton.MenuItems>
        </UserButton>
        </> 
        : <button onClick={openSignIn} className="flex items-center gap-2 hover:text-gray-900 transition">
          <Image src={assets.user_icon} alt="user icon" />
          Account
        </button>
        }
      </div>
    </nav>
  );
};

export default Navbar;