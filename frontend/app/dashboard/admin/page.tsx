'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface Case {
  id: number;
  case_number: string;
  call_date: string;
  location: string;
  dispatcher_name: string;
  status: string;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [cases, setCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState(true);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  useEffect(() => {
    // Check if user is admin
    const userData = localStorage.getItem('user_data');
    if (userData) {
      const user = JSON.parse(userData);
      if (user.role !== 'admin') {
        alert('Access denied. Admin only.');
        const userDashboard = user.role === 'dispatcher' ? '/dashboard/dispatcher' : '/dashboard/responder';
        router.push(userDashboard);
        return;
      }
      // User is admin, continue
      fetchAllCases();
    } else {
      // No user data, redirect to login
      router.push('/login');
    }
  }, []);

  const fetchAllCases = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) return;

      const response = await fetch('http://127.0.0.1:8001/api/v1/cases/', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (response.ok) {
        const data = await response.json();
        setCases(data);
      }
    } catch (error) {
      console.error('Error fetching cases:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Navigation Bar */}
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
                  className="text-[#1D9BF0] hover:text-[#1D9BF0] transition font-medium text-lg"
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
                  className="text-white hover:text-[#1D9BF0] transition font-medium text-lg"
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
        <h1 className="text-3xl font-bold text-white mb-6">Admin Dashboard - All Cases</h1>
        
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {loading ? (
            <div className="p-12 text-center text-gray-500">Loading...</div>
          ) : cases.length === 0 ? (
            <div className="p-12 text-center text-gray-500">No cases found</div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Case #</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Call Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Dispatcher</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {cases.map((caseItem) => (
                  <tr key={caseItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">{caseItem.case_number}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {new Date(caseItem.call_date).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{caseItem.location}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">{caseItem.dispatcher_name}</td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-2 py-1 rounded text-xs ${
                        caseItem.status === 'completed' ? 'bg-green-100 text-green-800' :
                        caseItem.status === 'active' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {caseItem.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}
