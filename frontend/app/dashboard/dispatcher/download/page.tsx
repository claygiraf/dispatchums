'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface DownloadedCase {
  id: number;
  case_number: string;
  call_date: string;
  downloaded_at: string;
  case_data: string;
}

export default function DownloadPage() {
  const router = useRouter();
  const [downloads, setDownloads] = useState<DownloadedCase[]>([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Load from localStorage (in production, this would be from backend)
  useEffect(() => {
    const saved = localStorage.getItem('downloaded_cases');
    if (saved) {
      setDownloads(JSON.parse(saved));
    }
  }, []);

  const handleDownloadAgain = (caseData: string, caseNumber: string) => {
    const blob = new Blob([caseData], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `call-card-${caseNumber}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDelete = (id: number) => {
    const updated = downloads.filter(d => d.id !== id);
    setDownloads(updated);
    localStorage.setItem('downloaded_cases', JSON.stringify(updated));
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Navigation Bar - EXACT COPY FROM DASHBOARD */}
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
                  href="/dashboard/dispatcher"
                  className="text-white hover:text-[#1D9BF0] transition font-medium text-lg"
                >
                  Dashboard
                </Link>
                <Link
                  href="/dashboard/dispatcher/feedback"
                  className="text-white hover:text-[#1D9BF0] transition font-medium text-lg"
                >
                  Feedback
                </Link>
                <Link
                  href="/dashboard/dispatcher/download"
                  className="text-[#1D9BF0] hover:text-[#1D9BF0] transition font-medium text-lg"
                >
                  Download
                </Link>
                <Link
                  href="/dashboard/dispatcher/trash"
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
                <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-2xl border border-gray-200 z-50 min-w-[220px] overflow-hidden">
                  <Link
                    href="/profile/dispatcher"
                    onClick={() => setShowProfileMenu(false)}
                    className="block w-full text-left px-5 py-3 hover:bg-gradient-to-r hover:from-blue-500 hover:to-blue-600 hover:text-white text-gray-700 font-medium transition flex items-center gap-3 border-b border-gray-100"
                  >
                    <span className="text-xl">👤</span>
                    <span>Profile Settings</span>
                  </Link>
                  <button 
                    onClick={() => {
                      localStorage.removeItem('access_token');
                      localStorage.removeItem('user_data');
                      router.push('/login');
                    }}
                    className="w-full text-left px-5 py-3 hover:bg-gradient-to-r hover:from-red-500 hover:to-red-600 hover:text-white text-gray-700 font-medium transition flex items-center gap-3"
                  >
                    <span className="text-xl">🚪</span>
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 min-h-screen">
        <div className="max-w-7xl mx-auto px-6 py-8">
        <h1 className="text-3xl font-bold text-white mb-6">Downloaded Call Cards</h1>
        
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {downloads.length === 0 ? (
            <div className="p-12 text-center text-gray-500">
              <p className="text-xl">No downloaded call cards</p>
              <p className="mt-2">Download call cards from the dashboard to see them here</p>
            </div>
          ) : (
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Case Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Call Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Downloaded At
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {downloads.map((download) => (
                  <tr key={download.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {download.case_number}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(download.call_date).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                      {new Date(download.downloaded_at).toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleDownloadAgain(download.case_data, download.case_number)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Download Again
                      </button>
                      <button
                        onClick={() => handleDelete(download.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Delete
                      </button>
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
