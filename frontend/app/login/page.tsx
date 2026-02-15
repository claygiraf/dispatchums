'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('');
  const [forgotPasswordSuccess, setForgotPasswordSuccess] = useState(false);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    
    try {
      // The backend expects identifier (which can be email or dispatcher ID) and password
      const result = await api.login({
        identifier: email, // Can be email or dispatcher ID
        password: password
      });
      
      console.log('Login successful:', result);
      
      // Store the access token in localStorage
      localStorage.setItem('access_token', result.access_token);
      localStorage.setItem('user_data', JSON.stringify(result.user));
      
      // Redirect using dashboard_route from backend
      const dashboardRoute = result.dashboard_route || '/dashboard/dispatcher'; // fallback
      console.log('Redirecting to:', dashboardRoute);
      router.push(dashboardRoute);
      
    } catch (err: any) {
      console.error('Login error:', err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!forgotPasswordEmail || !forgotPasswordEmail.includes('@')) {
      alert('Please enter a valid personal email address');
      return;
    }

    setIsLoading(true);
    try {
      await api.forgotPassword(forgotPasswordEmail);
      setForgotPasswordSuccess(true);
    } catch (err: any) {
      alert(err.message || 'Failed to send temporary password. Please check if the email is correct.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
  <h1 className="text-3xl font-serif text-white tracking-wide hover:text-[#1D9BF0] transition">
    DISPATCHUMS
  </h1>
</Link>
          
          <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-[#9CA3AF]">Enter your email and password to access your account.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          
          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-lg text-white placeholder-[#9CA3AF] focus:border-[#1D9BF0] focus:outline-none transition"
              required
              disabled={isLoading}
            />
          </div>

          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-lg text-white placeholder-[#9CA3AF] focus:border-[#1D9BF0] focus:outline-none transition"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#1D9BF0] text-white font-semibold rounded-lg hover:bg-[#1a8cd8] transition shadow-lg shadow-[#1D9BF0]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>

          <p className="text-center text-[#9CA3AF] mt-6">
            Don't have an account?{' '}
            <Link href="/register" className="text-[#1D9BF0] hover:underline">
              Register here
            </Link>
          </p>

          <p className="text-center text-[#9CA3AF] mt-2">
            <button 
              onClick={() => setShowForgotPassword(true)}
              className="text-[#1D9BF0] hover:underline"
              type="button"
            >
              Forgot password?
            </button>
          </p>
        </form>

        {/* Forgot Password Dialog */}
        {showForgotPassword && (
          <div className="fixed inset-0 flex items-center justify-center z-[9999] pointer-events-none">
            <div className="fixed inset-0 bg-black/70 pointer-events-auto" onClick={() => !forgotPasswordSuccess && setShowForgotPassword(false)}></div>
            <div className="relative glass rounded-2xl p-8 shadow-2xl pointer-events-auto max-w-md w-full mx-4">
              {!forgotPasswordSuccess ? (
                <>
                  <h3 className="text-2xl font-bold text-white mb-4">Forgot Password</h3>
                  <p className="text-[#9CA3AF] mb-4">
                    Enter your verified personal email address to receive a temporary password.
                  </p>
                  <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-3 mb-6">
                    <p className="text-xs text-blue-300">
                      ⓘ Your personal email must be verified from Dashboard → Profile Settings before you can receive a temporary password.
                    </p>
                  </div>
                  <input
                    type="email"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    placeholder="personal@gmail.com"
                    className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-lg text-white placeholder-[#9CA3AF] focus:border-[#1D9BF0] focus:outline-none transition mb-6"
                    disabled={isLoading}
                  />
                  <div className="flex gap-3 justify-end">
                    <button
                      onClick={() => setShowForgotPassword(false)}
                      className="px-6 py-2 bg-[#27272A] text-white rounded-lg hover:bg-[#3A3A3A] transition"
                      disabled={isLoading}
                    >
                      Back
                    </button>
                    <button
                      onClick={handleForgotPassword}
                      disabled={isLoading}
                      className="px-6 py-2 bg-[#1D9BF0] text-white rounded-lg hover:bg-[#1a8cd8] transition disabled:opacity-50"
                    >
                      {isLoading ? 'Sending...' : 'Send Password'}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-2xl font-bold text-white mb-4">Password Sent!</h3>
                  <p className="text-[#9CA3AF] mb-4">
                    A temporary password has been sent to your personal email. Please check your inbox and use it to login.
                  </p>
                  <button
                    onClick={() => {
                      setShowForgotPassword(false);
                      setForgotPasswordSuccess(false);
                      setForgotPasswordEmail('');
                    }}
                    className="w-full px-6 py-3 bg-[#1D9BF0] text-white rounded-lg hover:bg-[#1a8cd8] transition"
                  >
                    Back to Login
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}