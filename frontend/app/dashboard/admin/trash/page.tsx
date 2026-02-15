'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function AdminTrashPage() {
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  return (
    <div className="min-h-screen bg-[#0A0A0A] text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-[#27272A]">
        <div className="w-full px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-8">
              <Link href="/" className="group">
                <h1 className="text-3xl font-serif text-white tracking-wide hover:text-[#1D9BF0] transition">
                  DISPATCHUMS
                </h1>
              </Link>
              
              {/* Modern Navigation Menu */}
              <div className="flex items-center gap-6">
                <Link
                  href="/dashboard/admin"
                  className="text-white hover:text-[#1D9BF0] transition font-medium text-lg"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/admin/users"
                  className="text-white hover:text-[#1D9BF0] transition font-medium text-lg"
                >
                  Users
                </Link>
                <Link
                  href="/dashboard/admin/design"
                  className="text-white hover:text-[#1D9BF0] transition font-medium text-lg"
                >
                  Design
                </Link>
                <Link
                  href="/dashboard/admin/feedback"
                  className="text-white hover:text-[#1D9BF0] transition font-medium text-lg"
                >
                  Feedback
                </Link>
                <Link
                  href="/dashboard/admin/testimonial"
                  className="text-white hover:text-[#1D9BF0] transition font-medium text-lg"
                >
                  Testimonial
                </Link>
                <Link
                  href="/dashboard/admin/download"
                  className="text-white hover:text-[#1D9BF0] transition font-medium text-lg"
                >
                  Download
                </Link>
                <Link
                  href="/dashboard/admin/trash"
                  className="text-[#1D9BF0] hover:text-[#1D9BF0] transition font-medium text-lg"
                >
                  Trash
                </Link>
              </div>
            </div>
            
            {/* Profile Icon */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="p-2 text-white hover:text-[#1D9BF0] transition"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </button>
              
              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-48 bg-[#1A1A1A] rounded-lg shadow-xl border border-[#27272A] py-2">
                  <Link 
                    href="/profile/admin" 
                    className="block px-4 py-2 text-white hover:bg-[#27272A] transition"
                  >
                    Profile
                  </Link>
                  <button
                    onClick={() => {
                      localStorage.clear();
                      window.location.href = '/login';
                    }}
                    className="w-full text-left px-4 py-2 text-white hover:bg-[#27272A] transition"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-24 px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-6">All Deleted Cases</h1>
          <div className="glass rounded-xl p-8">
            <p className="text-[#9CA3AF]">Admin can view all users' trash items here...</p>
          </div>
        </div>
      </div>
    </div>
  );
}
