'use client';

import { useEffect, useState } from 'react';

export default function DiagnosticPage() {
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    // Get token from localStorage
    const token = localStorage.getItem('access_token');
    const user = localStorage.getItem('user_data');
    
    if (token) {
      setTokenInfo({
        token: token.substring(0, 50) + '...',
        length: token.length
      });
    }
    
    if (user) {
      try {
        setUserData(JSON.parse(user));
      } catch (e) {
        setUserData({ error: 'Failed to parse user data' });
      }
    }
  }, []);

  const clearStorage = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-white mb-8">Login Diagnostic</h1>
        
        <div className="glass rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Current Token</h2>
          {tokenInfo ? (
            <div className="text-[#9CA3AF] space-y-2">
              <p><strong className="text-white">Token:</strong> {tokenInfo.token}</p>
              <p><strong className="text-white">Length:</strong> {tokenInfo.length} characters</p>
            </div>
          ) : (
            <p className="text-red-400">No token found in localStorage</p>
          )}
        </div>

        <div className="glass rounded-xl p-6 mb-6">
          <h2 className="text-xl font-bold text-white mb-4">Current User Data</h2>
          {userData ? (
            <pre className="text-[#9CA3AF] text-sm overflow-auto">
              {JSON.stringify(userData, null, 2)}
            </pre>
          ) : (
            <p className="text-red-400">No user data found in localStorage</p>
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={clearStorage}
            className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Clear localStorage & Reload
          </button>
          
          <a
            href="/login"
            className="px-6 py-3 bg-[#1D9BF0] text-white rounded-lg hover:bg-[#1a8cd8] transition inline-block"
          >
            Go to Login
          </a>
        </div>

        <div className="glass rounded-xl p-6 mt-6">
          <h3 className="text-lg font-bold text-white mb-2">Admin Credentials:</h3>
          <p className="text-[#9CA3AF]">Email: admin@hums.edu.my</p>
          <p className="text-[#9CA3AF]">Password: Admin123</p>
        </div>
      </div>
    </div>
  );
}
