import React from "react";
import Link from "next/link";

const Footer = () => {
  return (
    <footer>
      <div className="flex flex-col md:flex-row items-start justify-center px-6 md:px-16 lg:px-32 gap-10 py-14 border-b border-gray-500/30 text-gray-500">
        <div className="w-4/5">
          <Link href="/" className="text-xl md:text-2xl font-bold text-orange-600 tracking-wide">
            AD KPOP MERCH
          </Link>
          <p className="mt-6 text-sm">
            AD K-POP MERCH is more than just a store, it is a creative space where fans can celebrate their love for K-pop through unique, high-quality, and customizable merchandise.
          </p>
        </div>

        <div className="w-1/2 flex items-center justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Company</h2>
            <ul className="text-sm space-y-2">
              <li>
                <Link className="hover:underline transition" href="/">Home</Link>
              </li>
              <li>
                <Link className="hover:underline transition" href="/about">About us</Link>
              </li>
              <li>
                <Link className="hover:underline transition" href="/contact">Contact us</Link>
              </li>
              <li>
                <Link className="hover:underline transition" href="/all-products">Shop</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="w-1/2 flex items-start justify-start md:justify-center">
          <div>
            <h2 className="font-medium text-gray-900 mb-5">Get in touch</h2>
            <div className="text-sm space-y-2">
              <p>+63 206 345 6789</p>
              <p>angelodn1234@gmail.com</p>
            </div>
          </div>
        </div>
      </div>
      <p className="py-4 text-center text-xs md:text-sm">
        Copyright 2026 © AD-KPOP MERCH | All Right Reserved.
      </p>
    </footer>
  );
};

export default Footer;