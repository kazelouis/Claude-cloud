import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/Navbar";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "BGC Carpool",
  description:
    "Coordinate carpools with fellow BGC employees — safer, easier commutes in tough weather.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <footer className="border-t border-amber-100 bg-white/60 px-4 py-6 pb-24 text-center text-sm text-stone-500 sm:pb-6">
          <p>
            BGC Carpool · Participation is voluntary and arranged between
            employees directly.
          </p>
          <p className="mt-1">
            BGC is not responsible for transportation arrangements made through
            this group.
          </p>
        </footer>
      </body>
    </html>
  );
}
