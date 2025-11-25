'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
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
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showSuccessDialog, setShowSuccessDialog] = useState(false);
  const [registrationResult, setRegistrationResult] = useState<any>(null);
  
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
    console.log('Success dialog closing, attempting redirect to dashboard...');
    setShowSuccessDialog(false);
    
    // Add a small delay to ensure dialog state is updated
    setTimeout(() => {
      try {
        console.log('Attempting Next.js router push to /dashboard');
        router.push('/dashboard');
      } catch (error) {
        console.warn('Router.push failed, using window.location:', error);
        // Fallback to window.location
        window.location.href = '/dashboard';
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
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-lg text-white placeholder-[#9CA3AF] focus:border-[#1D9BF0] focus:outline-none transition"
              required
            />
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
              <option value="supervisor">Supervisor</option>
              <option value="admin">Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-[#1D9BF0] text-white font-semibold rounded-lg hover:bg-[#1a8cd8] transition shadow-lg shadow-[#1D9BF0]/20 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Creating Account...' : 'Create Account'}
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