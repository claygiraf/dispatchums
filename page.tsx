'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function DashboardPage() {
  const [caseNumber, setCaseNumber] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showSpecLogMenu, setShowSpecLogMenu] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showTabsMenu, setShowTabsMenu] = useState(false);
  const [showSearchIncident, setShowSearchIncident] = useState(false);
  const [showAbortReason, setShowAbortReason] = useState(false);
  const [showPickupCase, setShowPickupCase] = useState(false);
  const [showChangeCaseNumber, setShowChangeCaseNumber] = useState(false);
  const [showPrintCase, setShowPrintCase] = useState(false);
  const [showLogoffConfirmation, setShowLogoffConfirmation] = useState(false);
  const [showLogComments, setShowLogComments] = useState(false);
  const [showUrgentMessage, setShowUrgentMessage] = useState(false);
  const [showHazmatInfo, setShowHazmatInfo] = useState(false);
  const [showCBRN, setShowCBRN] = useState(false);
  const [showSARS, setShowSARS] = useState(false);
  const [showVersionInfo, setShowVersionInfo] = useState(false);
  const [showSpecificPAI, setShowSpecificPAI] = useState(false);
  const [showLanguageApplyConfirm, setShowLanguageApplyConfirm] = useState(false);
  const [selectedOperatorLanguage, setSelectedOperatorLanguage] = useState('ENGLISH');
  const [selectedCallerLanguage, setSelectedCallerLanguage] = useState('ENGLISH');
  const [expandedPAI, setExpandedPAI] = useState({});
  const [selectedPAI, setSelectedPAI] = useState([]);
  const [hintsEnabled, setHintsEnabled] = useState(true);
  const [sortChiefComplaints, setSortChiefComplaints] = useState(false);

  const handleConfirm = () => {
    if (caseNumber.trim()) {
      setShowConfirmation(true);
    }
  };

  const handleYes = () => {
    window.location.href = `/entry?case=${encodeURIComponent(caseNumber)}`;
  };

  const handleNo = () => {
    setShowConfirmation(false);
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A]">
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-sm border-b border-[#27272A]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <Link href="/" className="group">
              <h1 className="text-3xl font-serif text-white tracking-wide hover:text-[#1D9BF0] transition">
                DISPATCHUMS
              </h1>
            </Link>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-20 min-h-screen flex flex-col">
        {/* Menu Bar */}
        <div className="bg-[#C0C0C0] border-b border-gray-400 relative">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex gap-6 text-black text-sm font-medium">
              {/* File Menu */}
              <div className="relative">
                <button 
                  className="py-1 hover:underline"
                  onClick={() => {
                    setShowFileMenu(!showFileMenu);
                    setShowViewMenu(false);
                    setShowSpecLogMenu(false);
                    setShowOptionsMenu(false);
                    setShowLanguageMenu(false);
                    setShowTabsMenu(false);
                  }}
                >
                  File
                </button>
                
                {showFileMenu && (
                  <div className="absolute top-full left-0 mt-0 bg-[#D3D3D3] border border-gray-400 shadow-lg z-50 min-w-[200px]">
                    <button 
                      onClick={() => {
                        setShowFileMenu(false);
                        setCaseNumber('');
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black"
                    >
                      <span>New case</span>
                      <span className="text-xs">Ctrl+N</span>
                    </button>
                    <button 
                      onClick={() => {
                        setShowFileMenu(false);
                        setShowSearchIncident(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black"
                    >
                      <span>Open case...</span>
                      <span className="text-xs">Ctrl+O</span>
                    </button>
                    <button 
                      onClick={() => {
                        setShowFileMenu(false);
                        setShowAbortReason(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black"
                    >
                      <span>Close case</span>
                      <span className="text-xs">Ctrl+F4</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black">
                      Caller hangup
                    </button>
                    <div className="border-t border-gray-400 my-1"></div>
                    <button className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black">
                      <span>Hold case</span>
                      <span className="text-xs">Ctrl+H</span>
                    </button>
                    <button 
                      onClick={() => {
                        setShowFileMenu(false);
                        setShowPickupCase(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black"
                    >
                      <span>Pick-up case...</span>
                      <span className="text-xs">Ctrl+P</span>
                    </button>
                    <div className="border-t border-gray-400 my-1"></div>
                    <button 
                      onClick={() => {
                        setShowFileMenu(false);
                        setShowChangeCaseNumber(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                    >
                      Change case number...
                    </button>
                    <div className="border-t border-gray-400 my-1"></div>
                    <button 
                      onClick={() => {
                        setShowFileMenu(false);
                        setShowPrintCase(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                    >
                      Print case...
                    </button>
                    <div className="border-t border-gray-400 my-1"></div>
                    <button 
                      onClick={() => {
                        setShowFileMenu(false);
                        setShowLogoffConfirmation(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                    >
                      Exit
                    </button>
                  </div>
                )}
              </div>

              {/* View Menu */}
              <div className="relative">
                <button 
                  className="py-1 hover:underline"
                  onClick={() => {
                    setShowViewMenu(!showViewMenu);
                    setShowFileMenu(false);
                    setShowSpecLogMenu(false);
                    setShowOptionsMenu(false);
                    setShowLanguageMenu(false);
                    setShowTabsMenu(false);
                  }}
                >
                  View
                </button>
                
                {showViewMenu && (
                  <div className="absolute top-full left-0 mt-0 bg-[#D3D3D3] border border-gray-400 shadow-lg z-50 min-w-[200px]">
                    <button 
                      onClick={() => setHintsEnabled(!hintsEnabled)}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex items-center gap-2 text-black"
                    >
                      <span className="w-4">{hintsEnabled ? '✓' : ''}</span>
                      <span>Hints</span>
                    </button>
                    <button 
                      onClick={() => setSortChiefComplaints(!sortChiefComplaints)}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex items-center gap-2 text-black"
                    >
                      <span className="w-4">{sortChiefComplaints ? '✓' : ''}</span>
                      <span>Sort Chief Complaints</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Spec Log Menu */}
              <div className="relative">
                <button 
                  className="py-1 hover:underline"
                  onClick={() => {
                    setShowSpecLogMenu(!showSpecLogMenu);
                    setShowFileMenu(false);
                    setShowViewMenu(false);
                    setShowOptionsMenu(false);
                    setShowLanguageMenu(false);
                    setShowTabsMenu(false);
                  }}
                >
                  Spec Log
                </button>
                
                {showSpecLogMenu && (
                  <div className="absolute top-full left-0 mt-0 bg-[#D3D3D3] border border-gray-400 shadow-lg z-50 min-w-[200px]">
                    <button 
                      onClick={() => {
                        setShowSpecLogMenu(false);
                        setShowLogComments(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black"
                    >
                      <span>Log comments</span>
                      <span className="text-xs">Ctrl+L</span>
                    </button>
                    <button 
                      onClick={() => {
                        setShowSpecLogMenu(false);
                        setShowHazmatInfo(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black"
                    >
                      <span>HAZMAT Info</span>
                      <span className="text-xs">Shift+Ctrl+H</span>
                    </button>
                    <button 
                      onClick={() => {
                        setShowSpecLogMenu(false);
                        setShowUrgentMessage(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                    >
                      Urgent Message
                    </button>
                    <div className="border-t border-gray-400 my-1"></div>
                    <button 
                      onClick={() => {
                        setShowSpecLogMenu(false);
                        setShowCBRN(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                    >
                      CBRN
                    </button>
                    <button 
                      onClick={() => {
                        setShowSpecLogMenu(false);
                        setShowSARS(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                    >
                      SARS
                    </button>
                  </div>
                )}
              </div>

              {/* Options Menu */}
              <div className="relative">
                <button 
                  className="py-1 hover:underline"
                  onClick={() => {
                    setShowOptionsMenu(!showOptionsMenu);
                    setShowFileMenu(false);
                    setShowViewMenu(false);
                    setShowSpecLogMenu(false);
                    setShowLanguageMenu(false);
                    setShowTabsMenu(false);
                  }}
                >
                  Options
                </button>
                
                {showOptionsMenu && (
                  <div className="absolute top-full left-0 mt-0 bg-[#D3D3D3] border border-gray-400 shadow-lg z-50 min-w-[200px]">
                    <button 
                      onClick={() => {
                        setShowOptionsMenu(false);
                        setShowLogoffConfirmation(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                    >
                      Logout operator
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black">
                      Go to protocol...
                    </button>
                    <button 
                      onClick={() => {
                        setShowOptionsMenu(false);
                        setShowSpecificPAI(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                    >
                      Go to specific PAI...
                    </button>
                    <div className="border-t border-gray-400 my-1"></div>
                    <button 
                      onClick={() => {
                        setShowOptionsMenu(false);
                        window.location.href = '/';
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                    >
                      About DISPATCHUMS
                    </button>
                  </div>
                )}
              </div>

              {/* Go to language Menu */}
              <div className="relative">
                <button 
                  className="py-1 hover:underline"
                  onClick={() => {
                    setShowLanguageMenu(!showLanguageMenu);
                    setShowFileMenu(false);
                    setShowViewMenu(false);
                    setShowSpecLogMenu(false);
                    setShowOptionsMenu(false);
                    setShowTabsMenu(false);
                  }}
                >
                  Go to language
                </button>
                
                {showLanguageMenu && (
                  <div className="absolute top-full left-0 mt-0 bg-[#D3D3D3] border border-gray-400 shadow-lg z-50 min-w-[300px]">
                    <div className="p-4">
                      <div className="mb-4">
                        <label className="block text-black text-sm mb-2">Operator text:</label>
                        <select 
                          value={selectedOperatorLanguage}
                          onChange={(e) => setSelectedOperatorLanguage(e.target.value)}
                          className="w-full bg-white border border-gray-400 p-2 text-black"
                        >
                          <option value="ENGLISH">ENGLISH</option>
                          <option value="CHINESE">CHINESE</option>
                          <option value="MALAY">MALAY</option>
                          <option value="SPANISH">SPANISH</option>
                          <option value="FRENCH">FRENCH</option>
                          <option value="INDONESIAN">INDONESIAN</option>
                        </select>
                      </div>
                      <div className="mb-4">
                        <label className="block text-black text-sm mb-2">Caller text:</label>
                        <select 
                          value={selectedCallerLanguage}
                          onChange={(e) => setSelectedCallerLanguage(e.target.value)}
                          className="w-full bg-white border border-gray-400 p-2 text-black"
                        >
                          <option value="ENGLISH">ENGLISH</option>
                          <option value="CHINESE">CHINESE</option>
                          <option value="MALAY">MALAY</option>
                          <option value="SPANISH">SPANISH</option>
                          <option value="FRENCH">FRENCH</option>
                          <option value="INDONESIAN">INDONESIAN</option>
                        </select>
                      </div>
                      <div className="flex justify-center">
                        <button 
                          onClick={() => {
                            setShowLanguageMenu(false);
                            setShowLanguageApplyConfirm(true);
                          }}
                          className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tabs Menu */}
              <div className="relative">
                <button 
                  className="py-1 hover:underline"
                  onClick={() => {
                    setShowTabsMenu(!showTabsMenu);
                    setShowFileMenu(false);
                    setShowViewMenu(false);
                    setShowSpecLogMenu(false);
                    setShowOptionsMenu(false);
                    setShowLanguageMenu(false);
                  }}
                >
                  Tabs
                </button>
                
                {showTabsMenu && (
                  <div className="absolute top-full left-0 mt-0 bg-[#D3D3D3] border border-gray-400 shadow-lg z-50 min-w-[250px]">
                    <button className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black">
                      Case Entry
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black">
                      Key Questions
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black">
                      Post Dispatch Instructions
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black">
                      Dispatch Life Support
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black">
                      Case Summary
                    </button>
                    <div className="border-t border-gray-400 my-1"></div>
                    <button className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black">
                      <span>Next tab</span>
                      <span className="text-xs">F6</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black">
                      <span>Prior tab</span>
                      <span className="text-xs">Shift+F6</span>
                    </button>
                    <button className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black">
                      <span>Additional Information</span>
                      <span className="text-xs">Ctrl+I</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Version Menu */}
              <button 
                className="py-1 hover:underline"
                onClick={() => setShowVersionInfo(true)}
              >
                Version
              </button>

              <button className="py-1 hover:underline">Help</button>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-[#C0C0C0] border-b border-gray-500">
          <div className="max-w-7xl mx-auto">
            <div className="flex w-full">
              <button className="flex-1 py-2 bg-white text-black font-medium border-r border-gray-500">
                Entry
              </button>
              <button className="flex-1 py-2 text-black hover:bg-gray-300 transition border-r border-gray-500">
                KQ
              </button>
              <button className="flex-1 py-2 text-black hover:bg-gray-300 transition border-r border-gray-500">
                PDI/CEI
              </button>
              <button className="flex-1 py-2 text-black hover:bg-gray-300 transition border-r border-gray-500">
                DLS
              </button>
              <button className="flex-1 py-2 text-black hover:bg-gray-300 transition">
                Summary
              </button>
            </div>
          </div>
        </div>

        {/* Center Content Area */}
        <div className="flex-1 flex items-center justify-center bg-[#0A0A0A] relative overflow-hidden">
          {/* Animated Glowing Background */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1D9BF0] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#10B981] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-[#1D9BF0] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          
          <div className="text-center space-y-8 relative z-10">
            {/* Logo */}
            <div className="mb-8">
              <h2 className="text-6xl font-bold text-white mb-2" style={{ fontFamily: 'Arial, sans-serif' }}>
                Welcome
                <span className="text-2xl font-normal italic"> to save lives</span>
              </h2>
              <p className="text-white text-lg italic">
                Medical Priority Dispatch System
              </p>
            </div>

            {/* Case Number Input */}
            <div className="space-y-4">
              <label className="block text-white text-xl">
                Case number (8 digits):
              </label>
              <input
                type="text"
                value={caseNumber}
                onChange={(e) => setCaseNumber(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleConfirm()}
                maxLength={8}
                className="w-64 px-4 py-2 bg-white text-black border-2 border-gray-400 focus:outline-none focus:border-[#1D9BF0]"
                placeholder="Enter case number"
              />
              <div>
                <button
                  onClick={handleConfirm}
                  disabled={!caseNumber.trim()}
                  className="mt-4 px-8 py-3 bg-[#1D9BF0] text-white font-medium rounded hover:bg-[#1a8cd8] transition disabled:bg-gray-500 disabled:cursor-not-allowed"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Status Bar */}
        <div className="bg-[#27272A] border-t border-[#27272A]">
          <div className="max-w-7xl mx-auto px-6 py-2">
            <div className="flex items-center justify-between">
              <div className="text-white text-sm">
                <div>SUPERVISOR</div>
                <div className="mt-1">CASE NUMBER (8 digits)</div>
                <div className="mt-1">O: ENGLISH</div>
                <div className="mt-1">C: ENGLISH</div>
              </div>
              <div className="text-[#1D9BF0] text-sm animate-pulse">
                Waiting for next incident...
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* All existing dialogs... */}
      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-lg p-8 shadow-2xl border-2 border-[#1D9BF0] pointer-events-auto">
            <h3 className="text-xl font-semibold text-black mb-4">Confirm Case Number</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to proceed with case number: <strong>{caseNumber}</strong>?
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={handleNo}
                className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
              >
                No
              </button>
              <button
                onClick={handleYes}
                className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Specific PAI Target Tool Dialog */}
      {showSpecificPAI && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[700px] max-h-[600px] overflow-y-auto">
            <div className="bg-[#0066CC] text-white px-3 py-1 font-semibold flex justify-between items-center">
              <span>Specific PAI Target Tool</span>
              <button onClick={() => setShowSpecificPAI(false)} className="text-white">✕</button>
            </div>
            <div className="p-4">
              {/* Top buttons */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <button className="px-4 py-1 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 text-black text-sm">
                  Case Exit X-1
                </button>
                <button className="px-4 py-1 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 text-black text-sm">
                  Urgent Disconnect
                </button>
                <button className="px-4 py-1 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 text-black text-sm">
                  Control Bleeding
                </button>
                <button className="px-4 py-1 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 text-black text-sm">
                  Arrival Interface
                </button>
              </div>

              {/* Category tabs and lists */}
              <div className="grid grid-cols-3 gap-2 mb-4">
                {/* Adult */}
                <div>
                  <div className="bg-[#C0C0C0] text-black px-2 py-1 text-center font-semibold border border-gray-400">
                    Adult
                  </div>
                  <div className="bg-white border border-gray-400 h-64 overflow-y-auto p-2">
                    <div className="space-y-1 text-xs text-black">
                      {[
                        { id: 'adult-a', text: 'A: Arrest / Choking (Unconscious)', hasOptions: true, options: ['1 - Check responsiveness', '2 - Position for CPR', '3 - Check pulse/breathing', '4 - Begin CPR cycles', '5 - Apply AED if available'] },
                        { id: 'adult-d', text: 'D: Choking (Conscious)', hasOptions: true, options: ['1 - Encourage coughing', '2 - Back blows (5 times)', '3 - Abdominal thrusts', '4 - Alternate back blows/thrusts', '5 - Check mouth for object'] },
                        { id: 'adult-h', text: 'H: Childbirth - Delivery', hasOptions: true, options: ['1 - Delivery preparation', '2 - Support baby\'s head', '3 - Check for cord around neck', '4 - Deliver shoulders', '5 - Postpartum care'] },
                        { id: 'adult-k', text: 'K: Stoma support - Adult', hasOptions: true, options: ['1 - Assess stoma opening', '2 - Remove secretions', '3 - Provide oxygen to stoma', '4 - Suction if needed', '5 - Position for breathing'] },
                        { id: 'adult-x', text: 'X: Exit', hasOptions: true, options: ['1 - Normal completion', '2 - Emergency exit', '3 - Transfer to ALS'] },
                        { id: 'adult-z', text: 'Z: AED support', hasOptions: true, options: ['1 - Attach AED pads', '2 - Analyze rhythm', '3 - Deliver shock if advised', '4 - Resume CPR', '5 - Reanalyze every 2 minutes'] }
                      ].map((item) => (
                        <div key={item.id}>
                          <div className="flex items-center gap-1">
                            {item.hasOptions && (
                              <button 
                                onClick={() => setExpandedPAI(prev => ({...prev, [item.id]: !prev[item.id]}))}
                                className="text-black hover:bg-gray-200 px-1"
                              >
                                {expandedPAI[item.id] ? '−' : '+'}
                              </button>
                            )}
                            <div 
                              className={`cursor-pointer hover:bg-blue-100 p-1 flex-1 ${selectedPAI.includes(item.id) ? 'bg-blue-500 text-white' : ''}`}
                              onClick={() => {
                                setSelectedPAI(prev => 
                                  prev.includes(item.id) 
                                    ? prev.filter(id => id !== item.id)
                                    : [...prev, item.id]
                                )
                              }}
                            >
                              {item.text}
                            </div>
                          </div>
                          {item.hasOptions && expandedPAI[item.id] && (
                            <div className="ml-4 space-y-0.5 text-xs">
                              {item.options.map((option, idx) => (
                                <div key={idx} className="text-black">{option}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Child */}
                <div>
                  <div className="bg-[#C0C0C0] text-black px-2 py-1 text-center font-semibold border border-gray-400">
                    Child
                  </div>
                  <div className="bg-white border border-gray-400 h-64 overflow-y-auto p-2">
                    <div className="space-y-1 text-xs text-black">
                      {[
                        { id: 'child-b', text: 'B: Arrest / Choking (Unconscious)', hasOptions: true, options: ['1 - Check child responsiveness', '2 - Position for pediatric CPR', '3 - Check pulse/breathing (10 sec)', '4 - Begin child CPR (15:2 ratio)', '5 - Consider AED if >1 year'] },
                        { id: 'child-d', text: 'D: Choking (Conscious)', hasOptions: true, options: ['1 - Encourage coughing', '2 - Back blows (child position)', '3 - Abdominal thrusts (modified)', '4 - Check mouth carefully', '5 - Call for advanced help'] },
                        { id: 'child-j', text: 'J: Stoma support - Child', hasOptions: true, options: ['1 - Assess pediatric stoma', '2 - Gentle suction', '3 - Humidified oxygen', '4 - Position for comfort', '5 - Monitor breathing'] },
                        { id: 'child-x', text: 'X: Exit', hasOptions: true, options: [
                          '1 - First Party Caller',
                          '2 - Routine Disconnect (Stable)', 
                          '3 - Stay on Line (unstable)',
                          '4 - Urgent Disconnect (1st Party)',
                          '5 - Control Bleeding',
                          '6 - Bleeding now Controlled',
                          '7 - Danger Present (Scene/HAZMAT)',
                          '8 - Amputation'
                        ]}
                      ].map((item) => (
                        <div key={item.id}>
                          <div className="flex items-center gap-1">
                            {item.hasOptions && (
                              <button 
                                onClick={() => setExpandedPAI(prev => ({...prev, [item.id]: !prev[item.id]}))}
                                className="text-black hover:bg-gray-200 px-1"
                              >
                                {expandedPAI[item.id] ? '−' : '+'}
                              </button>
                            )}
                            <div 
                              className={`cursor-pointer hover:bg-blue-100 p-1 flex-1 ${selectedPAI.includes(item.id) ? 'bg-blue-500 text-white' : ''}`}
                              onClick={() => {
                                setSelectedPAI(prev => 
                                  prev.includes(item.id) 
                                    ? prev.filter(id => id !== item.id)
                                    : [...prev, item.id]
                                )
                              }}
                            >
                              {item.text}
                            </div>
                          </div>
                          {item.hasOptions && expandedPAI[item.id] && (
                            <div className="ml-4 space-y-0.5 text-xs">
                              {item.options.map((option, idx) => (
                                <div key={idx} className="text-black">{option}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Infant */}
                <div>
                  <div className="bg-[#C0C0C0] text-black px-2 py-1 text-center font-semibold border border-gray-400">
                    Infant
                  </div>
                  <div className="bg-white border border-gray-400 h-64 overflow-y-auto p-2">
                    <div className="space-y-1 text-xs text-black">
                      {[
                        { id: 'infant-a', text: 'A: Arrest / Choking (Unconscious)', hasOptions: false },
                        { id: 'infant-d', text: 'D: Choking (Conscious)', hasOptions: false },
                        { id: 'infant-f', text: 'F: Childbirth - Delivery', hasOptions: false },
                        { id: 'infant-i', text: 'I: Stoma support - Infant', hasOptions: false },
                        { id: 'infant-n', text: 'N: Arrest / Choking (Unconscious - Neonate)', hasOptions: false },
                        { id: 'infant-x', text: 'X: Exit', hasOptions: true, options: ['1 - Normal Exit', '2 - Emergency Exit', '3 - Quick Exit'] }
                      ].map((item) => (
                        <div key={item.id}>
                          <div className="flex items-center gap-1">
                            {item.hasOptions && (
                              <button 
                                onClick={() => setExpandedPAI(prev => ({...prev, [item.id]: !prev[item.id]}))}
                                className="text-black hover:bg-gray-200 px-1"
                              >
                                {expandedPAI[item.id] ? '−' : '+'}
                              </button>
                            )}
                            <div 
                              className={`cursor-pointer hover:bg-blue-100 p-1 flex-1 ${selectedPAI.includes(item.id) ? 'bg-blue-500 text-white' : ''}`}
                              onClick={() => {
                                setSelectedPAI(prev => 
                                  prev.includes(item.id) 
                                    ? prev.filter(id => id !== item.id)
                                    : [...prev, item.id]
                                )
                              }}
                            >
                              {item.text}
                            </div>
                          </div>
                          {item.hasOptions && expandedPAI[item.id] && (
                            <div className="ml-4 space-y-0.5 text-xs">
                              {item.options.map((option, idx) => (
                                <div key={idx} className="text-black">{option}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom buttons */}
              <div className="flex gap-2 justify-center">
                <button className="px-6 py-1 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2">
                  <span className="text-green-600 text-xl">✓</span> OK
                </button>
                <button 
                  onClick={() => setShowSpecificPAI(false)}
                  className="px-6 py-1 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-red-600 text-xl">✗</span> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Version Information Dialog */}
      {showVersionInfo && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[600px]">
            <div className="bg-[#0066CC] text-white px-3 py-1 font-semibold flex justify-between items-center">
              <span>DISPATCHUMS Version Information</span>
              <button onClick={() => setShowVersionInfo(false)} className="text-white">✕</button>
            </div>
            <div className="p-4">
              {/* DISPATCHUMS Logo */}
              <div className="text-center mb-6">
                <h2 className="text-4xl font-serif text-black tracking-wide">
                  DISPATCHUMS
                </h2>
                <p className="text-black text-sm">Medical Priority Dispatch System</p>
              </div>

              <table className="w-full text-sm mb-4">
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 px-2 bg-[#C0C0C0] text-black font-semibold">DISPATCHUMS Program:</td>
                    <td className="py-2 px-2 text-black">Version 0.0.1</td>
                    <td className="py-2 px-2 text-black">Date: 05/15/2025</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-2 bg-[#C0C0C0] text-black font-semibold">DLL engine:</td>
                    <td className="py-2 px-2 text-black">0.0.1</td>
                    <td className="py-2 px-2 text-black">4/14/2025</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 px-2 bg-[#C0C0C0] text-black font-semibold">Screen Resolution:</td>
                    <td className="py-2 px-2 text-black" colSpan={2}>Default</td>
                  </tr>
                </tbody>
              </table>

              <div className="mb-4">
                <div className="bg-[#C0C0C0] text-black px-2 py-1 font-semibold mb-2">Logic Info:</div>
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#C0C0C0] text-black">
                      <th className="border border-gray-400 px-2 py-1">Version</th>
                      <th className="border border-gray-400 px-2 py-1">Language</th>
                      <th className="border border-gray-400 px-2 py-1">Type</th>
                      <th className="border border-gray-400 px-2 py-1">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-gray-400 px-2 py-1 text-black">0.0.1</td>
                      <td className="border border-gray-400 px-2 py-1 text-black">ENGLISH</td>
                      <td className="border border-gray-400 px-2 py-1 text-black">American</td>
                      <td className="border border-gray-400 px-2 py-1 text-black">4/22/2025</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 px-2 py-1 text-black">0.0.1</td>
                      <td className="border border-gray-400 px-2 py-1 text-black">CHINESE</td>
                      <td className="border border-gray-400 px-2 py-1 text-black">Standard Mainland China</td>
                      <td className="border border-gray-400 px-2 py-1 text-black">4/22/2025</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 px-2 py-1 text-black">0.0.1</td>
                      <td className="border border-gray-400 px-2 py-1 text-black">MALAY</td>
                      <td className="border border-gray-400 px-2 py-1 text-black">STANDARD</td>
                      <td className="border border-gray-400 px-2 py-1 text-black">4/22/2025</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mb-4">
                <div className="bg-[#C0C0C0] text-black px-2 py-1 font-semibold mb-2">Program text:</div>
                <div className="bg-white border border-gray-400 p-2 text-xs text-black space-y-1">
                  <div>Version: 0.0.1</div>
                  <div>North American English - 4/20/2025</div>
                  <div>Australian English - 4/20/2025</div>
                </div>
              </div>

              <div className="flex gap-2 justify-between items-center">
                <div className="text-xs text-black">
                  <div className="font-semibold">DISPATCHUMS Corporation</div>
                  <div>Sabah, Malaysia</div>
                  <div>www.dispatchums.com</div>
                  <div>Copyright (c) 2025</div>
                  <div>All rights reserved.</div>
                </div>
                <button 
                  onClick={() => setShowVersionInfo(false)}
                  className="px-6 py-1 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-green-600 text-xl">✓</span> OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Continue with rest of existing dialogs - I'll add them in parts due to length */}

      {/* Language Apply Confirmation Dialog */}
      {showLanguageApplyConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-lg p-8 shadow-2xl border-2 border-[#1D9BF0] pointer-events-auto">
            <h3 className="text-xl font-semibold text-black mb-4">Apply Language Settings</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to apply these language settings?<br/>
              <strong>Operator text:</strong> {selectedOperatorLanguage}<br/>
              <strong>Caller text:</strong> {selectedCallerLanguage}
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowLanguageApplyConfirm(false)}
                className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLanguageApplyConfirm(false);
                  // Apply language changes here
                }}
                className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

