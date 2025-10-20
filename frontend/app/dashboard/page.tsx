'use client';

import Link from 'next/link';
import { useState } from 'react';

export default function DashboardPage() {
  // All state declarations
  const [caseNumber, setCaseNumber] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showSpecLogMenu, setShowSpecLogMenu] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showTabsMenu, setShowTabsMenu] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [showSearchIncident, setShowSearchIncident] = useState(false);
  const [showAbortReason, setShowAbortReason] = useState(false);
  const [showAbortConfirm, setShowAbortConfirm] = useState(false);
  const [showPickupCase, setShowPickupCase] = useState(false);
  const [showPickupConfirm, setShowPickupConfirm] = useState(false);
  const [selectedPickupCase, setSelectedPickupCase] = useState<number | null>(null);
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
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const [showLearnMoreConfirm, setShowLearnMoreConfirm] = useState(false);
  const [selectedOperatorLanguage, setSelectedOperatorLanguage] = useState('ENGLISH');
  const [selectedCallerLanguage, setSelectedCallerLanguage] = useState('ENGLISH');
  const [expandedPAI, setExpandedPAI] = useState<Record<string, boolean>>({});
  const [selectedPAI, setSelectedPAI] = useState<string[]>([]);
  const [hintsEnabled, setHintsEnabled] = useState(true);
  const [sortChiefComplaints, setSortChiefComplaints] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    username: 'supervisor',
    email: 'supervisor@dispatchums.com',
    password: '********',
    role: 'SUPERVISOR',
    accountCreated: '2024-01-15'
  });
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false);
  const [profileData, setProfileData] = useState({
    firstName: 'John',
    lastName: 'Doe',
    username: 'supervisor',
    email: 'supervisor@dispatchums.com',
    password: '********',
    role: 'SUPERVISOR',
    accountCreated: '2024-01-15'
  });

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
            
            {/* Profile Section */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-3 hover:opacity-80 transition"
              >
                <div className="text-right">
                  <div className="text-white text-sm font-medium">{profileData.firstName} {profileData.lastName}</div>
                  <div className="text-gray-400 text-xs">{profileData.role}</div>
                </div>
                <div className="w-10 h-10 rounded-full bg-[#1D9BF0] flex items-center justify-center text-white font-semibold">
                  {profileData.firstName[0]}{profileData.lastName[0]}
                </div>
              </button>
              
              {showProfileMenu && (
                <div className="absolute top-full right-0 mt-2 bg-white border border-gray-300 shadow-lg z-50 min-w-[200px] rounded">
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowProfileDialog(true);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 text-black flex items-center gap-2"
                  >
                    <span>👤</span> View Profile
                  </button>
                  <button
                    onClick={() => {
                      setShowProfileMenu(false);
                      setShowLogoffConfirmation(true);
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-100 text-black border-t border-gray-200 flex items-center gap-2"
                  >
                    <span>🚪</span> Logout
                  </button>
                </div>
              )}
            </div>
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
                    setShowHelpMenu(false);
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
                    setShowHelpMenu(false);
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
                    setShowHelpMenu(false);
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
                    setShowHelpMenu(false);
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
                    setShowHelpMenu(false);
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
                    setShowHelpMenu(false);
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

              {/* Help Menu */}
              <div className="relative">
                <button 
                  className="py-1 hover:underline"
                  onClick={() => {
                    setShowHelpMenu(!showHelpMenu);
                    setShowFileMenu(false);
                    setShowViewMenu(false);
                    setShowSpecLogMenu(false);
                    setShowOptionsMenu(false);
                    setShowLanguageMenu(false);
                    setShowTabsMenu(false);
                  }}
                >
                  Help
                </button>
                
                {showHelpMenu && (
                  <div className="absolute top-full left-0 mt-0 bg-[#D3D3D3] border border-gray-400 shadow-lg z-50 min-w-[200px]">
                    <button 
                      onClick={() => {
                        setShowHelpMenu(false);
                        setShowVersionInfo(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                    >
                      Version
                    </button>
                    <button 
                      onClick={() => {
                        setShowHelpMenu(false);
                        setShowAboutDialog(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                    >
                      About DISPATCHUMS
                    </button>
                  </div>
                )}
              </div>
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
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1D9BF0] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#10B981] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-[#1D9BF0] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          
          <div className="text-center space-y-8 relative z-10">
            <div className="mb-8">
              <h2 className="text-6xl font-bold text-white mb-2" style={{ fontFamily: 'Arial, sans-serif' }}>
                Welcome
                <span className="text-2xl font-normal italic"> to save lives</span>
              </h2>
              <p className="text-white text-lg italic">
                Medical Priority Dispatch System
              </p>
            </div>

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
                <div className="mt-1">O: {selectedOperatorLanguage}</div>
                <div className="mt-1">C: {selectedCallerLanguage}</div>
              </div>
              <div className="text-[#1D9BF0] text-sm animate-pulse">
                Waiting for next incident...
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Profile Dialog */}
      {showProfileDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 w-[500px]">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              <span>User Profile</span>
              <button onClick={() => setShowProfileDialog(false)} className="text-white hover:bg-red-600 px-2">✕</button>
            </div>
            <div className="p-6 bg-white">
              <div className="flex justify-center mb-6">
                <div className="w-20 h-20 rounded-full bg-[#1D9BF0] flex items-center justify-center text-white font-bold text-3xl">
                  {profileData.firstName[0]}{profileData.lastName[0]}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-black text-sm font-semibold mb-1">First Name</label>
                  <input
                    type="text"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                    className="w-full px-3 py-2 bg-white text-black border-2 border-gray-400 focus:outline-none focus:border-[#0066CC]"
                  />
                </div>

                <div>
                  <label className="block text-black text-sm font-semibold mb-1">Last Name</label>
                  <input
                    type="text"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                    className="w-full px-3 py-2 bg-white text-black border-2 border-gray-400 focus:outline-none focus:border-[#0066CC]"
                  />
                </div>

                <div>
                  <label className="block text-black text-sm font-semibold mb-1">Username <span className="text-xs text-gray-600">(can change once a year)</span></label>
                  <input
                    type="text"
                    value={profileData.username}
                    onChange={(e) => setProfileData({...profileData, username: e.target.value})}
                    className="w-full px-3 py-2 bg-white text-black border-2 border-gray-400 focus:outline-none focus:border-[#0066CC]"
                  />
                </div>

                <div>
                  <label className="block text-black text-sm font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    className="w-full px-3 py-2 bg-white text-black border-2 border-gray-400 focus:outline-none focus:border-[#0066CC]"
                  />
                </div>

                <div>
                  <label className="block text-black text-sm font-semibold mb-1">Password</label>
                  <input
                    type="password"
                    value={profileData.password}
                    onChange={(e) => setProfileData({...profileData, password: e.target.value})}
                    className="w-full px-3 py-2 bg-white text-black border-2 border-gray-400 focus:outline-none focus:border-[#0066CC]"
                  />
                </div>

                <div>
                  <label className="block text-black text-sm font-semibold mb-1">Role</label>
                  <input
                    type="text"
                    value={profileData.role}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 text-black border-2 border-gray-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-black text-sm font-semibold mb-1">Account Created</label>
                  <input
                    type="text"
                    value={profileData.accountCreated}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 text-black border-2 border-gray-400 cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-between mt-6 pt-4 border-t border-gray-300">
                <button
                  onClick={() => setShowDeleteAccountConfirm(true)}
                  className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                >
                  Delete Account
                </button>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowProfileDialog(false)}
                    className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button> 
                  <button
                    onClick={() => setShowProfileDialog(false)}
                    className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
                  >
                    Save Changes
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation */}
      {showDeleteAccountConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 shadow-2xl border-2 border-red-600">
            <h3 className="text-xl font-semibold text-black mb-4">⚠️ Delete Account</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to delete your account?<br/>
              <strong className="text-red-600">This action cannot be undone.</strong><br/>
              All your data will be permanently deleted.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowDeleteAccountConfirm(false)}
                className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteAccountConfirm(false);
                  setShowProfileDialog(false);
                  window.location.href = '/register';
                }}
                className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Yes, Delete Account
              </button>
            </div>
          </div>
        </div>
      )} 

      {/* Language Apply Confirmation */}
      {showLanguageApplyConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 shadow-2xl border-2 border-[#1D9BF0]">
            <h3 className="text-xl font-semibold text-black mb-4">Apply Language Settings</h3>
            <p className="text-gray-700 mb-6">
              Language settings have been applied successfully!<br/>
              <strong>Operator text:</strong> {selectedOperatorLanguage}<br/>
              <strong>Caller text:</strong> {selectedCallerLanguage}
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowLanguageApplyConfirm(false)}
                className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 shadow-2xl border-2 border-[#1D9BF0]">
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

      {/* Logoff Confirmation */}
      {showLogoffConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-8 shadow-2xl border-2 border-[#1D9BF0]">
            <h3 className="text-xl font-semibold text-black mb-4">Exit Operator Interface</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to exit the operator interface and return to the landing page?
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowLogoffConfirmation(false)}
                className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => window.location.href = '/'}
                className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
              >
                Yes, Exit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}