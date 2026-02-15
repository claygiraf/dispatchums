'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../../lib/api';
import SuccessDialog from '@/components/shared/SuccessDialog';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('dispatcher');
  const [username, setUsername] = useState('');
  const [unit, setUnit] = useState('MECC HUMS'); // Default to first option
  
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [emailError, setEmailError] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<any>(null);
  
  const router = useRouter();

  // Check if email already exists
  const checkEmailExists = async (emailToCheck: string) => {
    if (!emailToCheck || !emailToCheck.includes('@')) return;
    
    setIsCheckingEmail(true);
    setEmailError('');
    
    try {
      // Try to login with a dummy password to check if email exists
      await api.login({
        username: emailToCheck,
        password: 'dummy_password_check'
      });
      // If it doesn't throw an error about wrong password, email exists
    } catch (err: any) {
      if (err.message && err.message.includes('Invalid credentials')) {
        // Email exists but password is wrong - that's what we want to detect
        setEmailError('This email is already registered. Please use the login page.');
      }
      // If it's a different error, email might not exist (which is good for registration)
    } finally {
      setIsCheckingEmail(false);
    }
  };

  // Handle email field changes with debounced checking
  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    setEmailError('');
    
    // Debounce email checking
    if (newEmail && newEmail.includes('@')) {
      setTimeout(() => {
        if (email === newEmail) { // Only check if email hasn't changed
          checkEmailExists(newEmail);
        }
      }, 1000);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Don't submit if email already exists
    if (emailError) {
      setError('Please correct the errors before submitting.');
      return;
    }
    
    setIsLoading(true);
    setError('');
    setSuccess('');
    
    try {
      const userData = {
        username: username || email.split('@')[0], // Use email prefix if no username provided
        email,
        password,
        full_name: `${firstName} ${lastName}`.trim(),
        unit: unit, // Required field
        role: role.toLowerCase()
      };
      
      console.log('Registering user:', userData);
      
      const result = await api.register(userData);
      
      console.log('Registration successful:', result);
      
      // Store authentication data (registration now returns token and user)
      if (result.access_token) {
        localStorage.setItem('access_token', result.access_token);
      }
      if (result.user) {
        localStorage.setItem('user_data', JSON.stringify(result.user));
      }
      
      setRegistrationResult(result);
      setShowSuccessDialog(true);
      
      // Success dialog will handle the redirect
      
    } catch (err: any) {
      console.error('Registration error:', err);
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuccessDialogClose = () => {
    console.log('Success dialog closing, attempting redirect...');
    setShowSuccessDialog(false);
    
    // Add a small delay to ensure dialog state is updated
    setTimeout(() => {
      try {
        // Use dashboard_route from backend response
        const dashboardRoute = registrationResult?.dashboard_route || '/dashboard/dispatcher';
        console.log('Redirecting to:', dashboardRoute);
        router.push(dashboardRoute);
      } catch (error) {
        console.warn('Router.push failed, using window.location:', error);
        // Fallback to window.location
        const dashboardRoute = registrationResult?.dashboard_route || '/dashboard/dispatcher';
        window.location.href = dashboardRoute;
      }
    }, 100);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-block mb-6">
  <h1 className="text-3xl font-serif text-white tracking-wide hover:text-[#1D9BF0] transition">
    DISPATCHUMS
  </h1>
</Link>
          
          <h2 className="text-3xl font-bold text-white mb-2">Create an Account</h2>
          <p className="text-[#9CA3AF]">Join our platform to streamline emergency response.</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass rounded-2xl p-8">
          {/* Error/Success Messages */}
          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded-lg text-red-400 text-sm">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 p-3 bg-green-500/20 border border-green-500 rounded-lg text-green-400 text-sm">
              {success}
            </div>
          )}

          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="john_dispatcher"
              className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-lg text-white placeholder-[#9CA3AF] focus:border-[#1D9BF0] focus:outline-none transition"
            />
            <p className="text-xs text-[#9CA3AF] mt-1">Leave blank to use email prefix</p>
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">
              First Name
            </label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              placeholder="John"
              className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-lg text-white placeholder-[#9CA3AF] focus:border-[#1D9BF0] focus:outline-none transition"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">
              Last Name
            </label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Doe"
              className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-lg text-white placeholder-[#9CA3AF] focus:border-[#1D9BF0] focus:outline-none transition"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">
              Email Address
            </label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={handleEmailChange}
                placeholder="name@example.com"
                className={`w-full px-4 py-3 bg-[#0A0A0A] border rounded-lg text-white placeholder-[#9CA3AF] focus:outline-none transition ${
                  emailError 
                    ? 'border-red-500 focus:border-red-500' 
                    : 'border-[#27272A] focus:border-[#1D9BF0]'
                }`}
                required
              />
              {isCheckingEmail && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="w-4 h-4 border-2 border-[#1D9BF0] border-t-transparent rounded-full animate-spin"></div>
                </div>
              )}
            </div>
            {emailError && (
              <p className="text-red-400 text-xs mt-1 flex items-center">
                <span className="mr-1">⚠️</span>
                {emailError}
                <Link href="/login" className="ml-1 text-[#1D9BF0] hover:underline">
                  Login here
                </Link>
              </p>
            )}
          </div>

          <div className="mb-4">
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
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">
              Unit <span className="text-red-400">*</span>
            </label>
            <select
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-lg text-white focus:border-[#1D9BF0] focus:outline-none transition appearance-none cursor-pointer"
              required
            >
              <option value="MECC HUMS">MECC HUMS</option>
              <option value="MECC HQE">MECC HQE</option>
              <option value="MECC Tawau">MECC Tawau</option>
              <option value="MECC Keningau">MECC Keningau</option>
              <option value="MECC Beaufort">MECC Beaufort</option>
              <option value="MECC Semporna">MECC Semporna</option>
              <option value="MECC Lahad Datu">MECC Lahad Datu</option>
              <option value="MECC Sandakan">MECC Sandakan</option>
            </select>
            <p className="text-xs text-[#9CA3AF] mt-1">Dispatcher ID will be auto-assigned (starting from PED001)</p>
          </div>

          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">
              Your Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-lg text-white focus:border-[#1D9BF0] focus:outline-none transition appearance-none cursor-pointer"
            >
              <option value="dispatcher">Dispatcher</option>
              <option value="responder">Responder</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading || emailError !== '' || isCheckingEmail}
            className="w-full py-3 bg-[#1D9BF0] text-white font-semibold rounded-lg hover:bg-[#1a8cd8] transition shadow-lg shadow-[#1D9BF0]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : isCheckingEmail ? 'Checking Email...' : 'Create Account'}
          </button>

          <p className="text-center text-[#9CA3AF] mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[#1D9BF0] hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
      
      {/* Success Dialog */}
      <SuccessDialog
        isOpen={showSuccessDialog}
        title="Account Registered Successfully!"
        message={`Welcome to Dispatchums, ${registrationResult?.full_name || 'User'}! Your dispatcher ID is ${registrationResult?.dispatcher_id}. You will now be redirected to your dashboard.`}
        onClose={handleSuccessDialogClose}
        autoClose={true}
        autoCloseDelay={4000}
      />
    </div>
  );
}