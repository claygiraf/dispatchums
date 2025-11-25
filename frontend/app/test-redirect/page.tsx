'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function TestRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    console.log('Test redirect page loaded');
  }, []);

  const testRedirect = () => {
    console.log('Testing redirect to dashboard...');
    try {
      router.push('/dashboard');
      console.log('Router.push called successfully');
    } catch (error) {
      console.error('Router.push failed:', error);
      window.location.href = '/dashboard';
    }
  };

  const testWindowLocation = () => {
    console.log('Testing window.location redirect...');
    window.location.href = '/dashboard';
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="text-center space-y-6">
        <h1 className="text-3xl font-bold text-white">Test Redirect Page</h1>
        <div className="space-y-4">
          <button
            onClick={testRedirect}
            className="block w-full py-3 bg-[#1D9BF0] text-white font-semibold rounded-lg hover:bg-[#1a8cd8] transition"
          >
            Test Router.push('/dashboard')
          </button>
          <button
            onClick={testWindowLocation}
            className="block w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
          >
            Test window.location.href = '/dashboard'
          </button>
        </div>
      </div>
    </div>
  );
}