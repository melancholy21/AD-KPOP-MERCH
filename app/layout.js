import { Outfit } from "next/font/google";
import "./globals.css";
import { AppContextProvider } from "@/context/AppContext";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import BottomNav from "@/components/BottomNav";

const outfit = Outfit({ subsets: ['latin'], weight: ["300", "400", "500"] })

export const metadata = {
  title: "AD-KPOP MERCH",
  description: "E-Commerce with Next.js for AD-KPOP MERCH",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${outfit.className} antialiased text-gray-700`} >
          <Toaster />
          <AppContextProvider>
            {children}
            <BottomNav />
          </AppContextProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}
