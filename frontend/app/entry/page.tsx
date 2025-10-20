"use client"

import React, { useState } from 'react';
import { ChevronRight, Clock, AlertCircle } from 'lucide-react';

export default function AllCallersInterrogation() {
  const [formData, setFormData] = useState({
    location: '',
    phoneNumber: '',
    emergency: '',
    numHurt: '',
    age: '',
    conscious: '',
    breathing: '',
    gender: '',
    callerName: ''
  });

  const handleInputChange = (field: string, value: string) => {
  setFormData(prev => ({ ...prev, [field]: value }));
};

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-[#27272A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <h1 className="text-3xl font-serif text-white tracking-wide hover:text-[#1D9BF0] transition cursor-pointer">
              DISPATCHUMS
            </h1>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-[#9CA3AF]">
                <Clock size={16} />
                <span className="text-sm font-mono">00:20</span>
              </div>
              <div className="h-6 w-px bg-[#27272A]" />
              <div className="text-[#9CA3AF] text-sm">CASE-988030</div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="pt-32 pb-16 px-6 lg:px-8">
        <div className="max-w-5xl mx-auto space-y-6">
          
          {/* Header */}
          <div className="bg-[#27272A] border border-[#27272A] rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Clock className="text-[#1D9BF0]" size={24} />
              <h2 className="text-2xl font-semibold text-white">ALL CALLERS INTERROGATION</h2>
            </div>
            <p className="text-[#9CA3AF]">CASE-988030 | Awaiting Protocol Selection</p>
          </div>

          {/* Key Questions Section */}
          <div className="bg-[#27272A] border border-[#27272A] rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <AlertCircle className="text-[#10B981]" size={20} />
              Key Questions
            </h3>

            <div className="space-y-6">
              
              {/* Question 1 - Location */}
              <div className="space-y-2">
                <label className="flex items-start gap-2 text-white font-medium">
                  <span className="text-[#1D9BF0] min-w-[24px]">1.</span>
                  <div className="flex-1">
                    <span>Where is your emergency?</span>
                    <span className="text-[#9CA3AF] text-sm ml-2">(address or location)</span>
                  </div>
                </label>
                <div className="ml-6">
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Confirm location"
                    className="w-full bg-[#0A0A0A] border border-[#27272A] text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#1D9BF0] transition placeholder:text-[#9CA3AF]"
                  />
                </div>
              </div>

              {/* Question 2 - Phone Number */}
              <div className="space-y-2">
                <label className="flex items-start gap-2 text-white font-medium">
                  <span className="text-[#1D9BF0] min-w-[24px]">2.</span>
                  <span>What is the phone number you are calling from?</span>
                </label>
                <div className="ml-6">
                  <input
                    type="tel"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                    placeholder="Confirm phone number"
                    className="w-full bg-[#0A0A0A] border border-[#27272A] text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#1D9BF0] transition placeholder:text-[#9CA3AF]"
                  />
                </div>
              </div>

              {/* Question 3 - Emergency Type */}
              <div className="space-y-2">
                <label className="flex items-start gap-2 text-white font-medium">
                  <span className="text-[#1D9BF0] min-w-[24px]">3.</span>
                  <span>What is the emergency?</span>
                </label>
                <div className="ml-6 space-y-2">
                  <input
                    type="text"
                    value={formData.emergency}
                    onChange={(e) => handleInputChange('emergency', e.target.value)}
                    placeholder="Describe the emergency"
                    className="w-full bg-[#0A0A0A] border border-[#27272A] text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#1D9BF0] transition placeholder:text-[#9CA3AF]"
                  />
                  <p className="text-[#9CA3AF] text-sm italic">If MVC, jump to the T10: MVC Card</p>
                </div>
              </div>

              {/* Question 4 - Number Hurt */}
              <div className="space-y-2">
                <label className="flex items-start gap-2 text-white font-medium">
                  <span className="text-[#1D9BF0] min-w-[24px]">4.</span>
                  <div className="flex-1">
                    <span>How many people are hurt?</span>
                    <span className="text-[#9CA3AF] text-sm ml-2">(if not obvious)</span>
                  </div>
                </label>
                <div className="ml-6">
                  <input
                    type="number"
                    min="1"
                    value={formData.numHurt}
                    onChange={(e) => handleInputChange('numHurt', e.target.value)}
                    placeholder="1"
                    className="w-full bg-[#0A0A0A] border border-[#27272A] text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#1D9BF0] transition placeholder:text-[#9CA3AF]"
                  />
                </div>
              </div>

              {/* Question 5 - Age */}
              <div className="space-y-2">
                <label className="flex items-start gap-2 text-white font-medium">
                  <span className="text-[#1D9BF0] min-w-[24px]">5.</span>
                  <span>How old is the person?</span>
                </label>
                <div className="ml-6">
                  <input
                    type="number"
                    min="0"
                    value={formData.age}
                    onChange={(e) => handleInputChange('age', e.target.value)}
                    placeholder="55"
                    className="w-full bg-[#0A0A0A] border border-[#27272A] text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#1D9BF0] transition placeholder:text-[#9CA3AF]"
                  />
                </div>
              </div>

              {/* Question 6 - Conscious */}
              <div className="space-y-3">
                <label className="flex items-start gap-2 text-white font-medium">
                  <span className="text-[#1D9BF0] min-w-[24px]">6.</span>
                  <span>Is the person conscious?</span>
                </label>
                <div className="ml-6 space-y-3">
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleInputChange('conscious', 'yes')}
                      className={`flex-1 px-4 py-3 rounded-lg border transition font-medium ${
                        formData.conscious === 'yes'
                          ? 'bg-[#10B981] border-[#10B981] text-white'
                          : 'bg-[#0A0A0A] border-[#27272A] text-white hover:border-[#1D9BF0]'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => handleInputChange('conscious', 'no')}
                      className={`flex-1 px-4 py-3 rounded-lg border transition font-medium ${
                        formData.conscious === 'no'
                          ? 'bg-red-600 border-red-600 text-white'
                          : 'bg-[#0A0A0A] border-[#27272A] text-white hover:border-[#1D9BF0]'
                      }`}
                    >
                      No
                    </button>
                  </div>
                  {formData.conscious === 'no' && (
                    <div className="p-4 bg-red-600/10 border border-red-600/30 rounded-lg">
                      <p className="text-red-400 text-sm font-medium">
                        If No, Send a Code Red Response. Advise Caller help has been dispatched.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Question 7 - Breathing */}
              <div className="space-y-3">
                <label className="flex items-start gap-2 text-white font-medium">
                  <span className="text-[#1D9BF0] min-w-[24px]">7.</span>
                  <span>Is the person breathing?</span>
                </label>
                <div className="ml-6 space-y-3">
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      onClick={() => handleInputChange('breathing', 'yes')}
                      className={`px-4 py-3 rounded-lg border transition text-sm font-medium ${
                        formData.breathing === 'yes'
                          ? 'bg-[#10B981] border-[#10B981] text-white'
                          : 'bg-[#0A0A0A] border-[#27272A] text-white hover:border-[#1D9BF0]'
                      }`}
                    >
                      Yes
                    </button>
                    <button
                      onClick={() => handleInputChange('breathing', 'uncertain')}
                      className={`px-4 py-3 rounded-lg border transition text-sm font-medium ${
                        formData.breathing === 'uncertain'
                          ? 'bg-yellow-600 border-yellow-600 text-white'
                          : 'bg-[#0A0A0A] border-[#27272A] text-white hover:border-[#1D9BF0]'
                      }`}
                    >
                      Uncertain
                    </button>
                    <button
                      onClick={() => handleInputChange('breathing', 'no')}
                      className={`px-4 py-3 rounded-lg border transition text-sm font-medium ${
                        formData.breathing === 'no'
                          ? 'bg-red-600 border-red-600 text-white'
                          : 'bg-[#0A0A0A] border-[#27272A] text-white hover:border-[#1D9BF0]'
                      }`}
                    >
                      No
                    </button>
                  </div>
                  
                  {formData.breathing === 'yes' && (
                    <div className="p-4 bg-[#10B981]/10 border border-[#10B981]/30 rounded-lg">
                      <p className="text-[#10B981] text-sm font-medium">
                        If Yes, Go to the C6: Unconscious/Fainting Card
                      </p>
                    </div>
                  )}
                  
                  {formData.breathing === 'uncertain' && (
                    <div className="p-4 bg-yellow-600/10 border border-yellow-600/30 rounded-lg">
                      <p className="text-yellow-400 text-sm font-medium">
                        If Uncertain, tell caller to Go and See if the chest is rising, then come back to the phone
                      </p>
                    </div>
                  )}
                  
                  {formData.breathing === 'no' && (
                    <div className="p-4 bg-red-600/10 border border-red-600/30 rounded-lg">
                      <p className="text-red-400 text-sm font-medium">
                        If No, go to the C1: Cardiac Arrest Card
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Question 8 - Gender */}
              <div className="space-y-2">
                <label className="flex items-start gap-2 text-white font-medium">
                  <span className="text-[#1D9BF0] min-w-[24px]">8.</span>
                  <div className="flex-1">
                    <span>Is the person male or female?</span>
                    <span className="text-[#9CA3AF] text-sm ml-2">(if not obvious)</span>
                  </div>
                </label>
                <div className="ml-6">
                  <div className="flex gap-4">
                    <button
                      onClick={() => handleInputChange('gender', 'male')}
                      className={`flex-1 px-4 py-3 rounded-lg border transition font-medium ${
                        formData.gender === 'male'
                          ? 'bg-[#1D9BF0] border-[#1D9BF0] text-white'
                          : 'bg-[#0A0A0A] border-[#27272A] text-white hover:border-[#1D9BF0]'
                      }`}
                    >
                      Male
                    </button>
                    <button
                      onClick={() => handleInputChange('gender', 'female')}
                      className={`flex-1 px-4 py-3 rounded-lg border transition font-medium ${
                        formData.gender === 'female'
                          ? 'bg-[#1D9BF0] border-[#1D9BF0] text-white'
                          : 'bg-[#0A0A0A] border-[#27272A] text-white hover:border-[#1D9BF0]'
                      }`}
                    >
                      Female
                    </button>
                  </div>
                </div>
              </div>

              {/* Question 9 - Caller Name */}
              <div className="space-y-2">
                <label className="flex items-start gap-2 text-white font-medium">
                  <span className="text-[#1D9BF0] min-w-[24px]">9.</span>
                  <span>What is your name?</span>
                </label>
                <div className="ml-6">
                  <input
                    type="text"
                    value={formData.callerName}
                    onChange={(e) => handleInputChange('callerName', e.target.value)}
                    placeholder="Caller name"
                    className="w-full bg-[#0A0A0A] border border-[#27272A] text-white px-4 py-3 rounded-lg focus:outline-none focus:border-[#1D9BF0] transition placeholder:text-[#9CA3AF]"
                  />
                </div>
              </div>

            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-end">
            <button className="flex items-center gap-2 bg-[#1D9BF0] text-white px-6 py-3 rounded-lg hover:bg-[#1a8cd8] transition font-medium">
              Next
              <ChevronRight size={20} />
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}