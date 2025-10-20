'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Dispatcher');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Register:', { firstName, lastName, email, password, role });
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

          <div className="mb-6">
            <label className="block text-white text-sm font-medium mb-2">
              Your Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-4 py-3 bg-[#0A0A0A] border border-[#27272A] rounded-lg text-white focus:border-[#1D9BF0] focus:outline-none transition appearance-none cursor-pointer"
            >
              <option value="Dispatcher">Dispatcher</option>
              <option value="Medical Responder">Medical Responder</option>
              <option value="Administrator">Administrator</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-[#1D9BF0] text-white font-semibold rounded-lg hover:bg-[#1a8cd8] transition shadow-lg shadow-[#1D9BF0]/20"
          >
            Create Account
          </button>

          <p className="text-center text-[#9CA3AF] mt-6">
            Already have an account?{' '}
            <Link href="/login" className="text-[#1D9BF0] hover:underline">
              Log in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}