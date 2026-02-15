'use client';

import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Text Logo */}
          <Link href="/" className="group">
            <h1 className="text-3xl font-serif text-white tracking-wide hover:text-[#1D9BF0] transition">
              DISPATCHUMS
            </h1>
          </Link>

          {/* Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            <Link href="#features" className="text-[#9CA3AF] hover:text-[#1D9BF0] transition">
              Features
            </Link>
            <Link href="#testimonials" className="text-[#9CA3AF] hover:text-[#1D9BF0] transition">
              Testimonials
            </Link>
            <Link href="/login" className="text-[#9CA3AF] hover:text-[#1D9BF0] transition">
              Login
            </Link>
            <Link 
              href="/register" 
              className="px-6 py-2.5 bg-[#1D9BF0] text-white rounded-full font-semibold hover:bg-[#1a8cd8] transition shadow-lg shadow-[#1D9BF0]/20"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}