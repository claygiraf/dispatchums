'use client';

import { useState } from 'react';
import Link from 'next/link';

interface NavigationProps {
  username: string;
  fullName: string;
  caseNumber: string;
  selectedOperatorLanguage: string;
  selectedCallerLanguage: string;
  hintsEnabled: boolean;
  setHintsEnabled: (value: boolean) => void;
  sortChiefComplaints: boolean;
  setSortChiefComplaints: (value: boolean) => void;
  onLogout: () => void;
  onLanguageChange: (operator: string, caller: string) => void;
  onCloseCase: () => void;
  onChangeCaseNumber: () => void;
  onPrintCase: () => void;
  onSearch?: () => void;
  onPickupCase?: () => void;
  onAbort?: () => void;
  onPrint?: () => void;
  onChangeLanguage?: (operator: string, caller: string) => void;
  onPAISelect?: (selectedPAI: string[]) => void;
  onVersionInfo?: () => void;
  onAbout?: () => void;
  onLearnMore?: () => void;
  profileData?: {
    firstName: string;
    lastName: string;
    username: string;
    email: string;
    password: string;
    role: string;
    accountCreated: string;
  };
  onProfileUpdate?: (data: any) => void;
  onDeleteAccount?: () => void;
}

export default function Navigation({
  username,
  fullName,
  caseNumber,
  selectedOperatorLanguage,
  selectedCallerLanguage,
  hintsEnabled,
  setHintsEnabled,
  sortChiefComplaints,
  setSortChiefComplaints,
  onLogout,
  onLanguageChange,
  onCloseCase,
  onChangeCaseNumber,
  onPrintCase,
  onSearch,
  onPickupCase,
  onAbort,
  onPrint,
  onChangeLanguage,
  onPAISelect,
  onVersionInfo,
  onAbout,
  onLearnMore,
  profileData = {
    firstName: 'John',
    lastName: 'Doe',
    username: 'supervisor',
    email: 'supervisor@dispatchums.com',
    password: '********',
    role: 'SUPERVISOR',
    accountCreated: '2024-01-15'
  },
  onProfileUpdate,
  onDeleteAccount
}: NavigationProps) {
  
  // Navigation and Menu States
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showSpecLogMenu, setShowSpecLogMenu] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showTabsMenu, setShowTabsMenu] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [expandedPAI, setExpandedPAI] = useState<Record<string, boolean>>({});
  const [selectedPAI, setSelectedPAI] = useState<string[]>([]);
  const [abortReason, setAbortReason] = useState('');
  const [selectedPickupCase, setSelectedPickupCase] = useState<number | null>(null);
  
  // Language States
  const [tempOperatorLanguage, setTempOperatorLanguage] = useState(selectedOperatorLanguage);
  const [tempCallerLanguage, setTempCallerLanguage] = useState(selectedCallerLanguage);
  
  // Profile Menu States
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileDialog, setShowProfileDialog] = useState(false);
  const [showDeleteAccountConfirm, setShowDeleteAccountConfirm] = useState(false);
  const [tempProfileData, setTempProfileData] = useState(profileData);
  
  // Dialog States for Menu Items
  const [showSearchIncident, setShowSearchIncident] = useState(false);
  const [showAbortReason, setShowAbortReason] = useState(false);
  const [showAbortConfirm, setShowAbortConfirm] = useState(false);
  const [showPickupCase, setShowPickupCase] = useState(false);
  const [showPickupConfirm, setShowPickupConfirm] = useState(false);
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


  return (
    <>
      {/* Menu Bar */}
      <div className="fixed top-0 left-0 right-0 bg-[#C0C0C0] border-b border-gray-400 relative z-40">
        <div className="w-full px-6">
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
                      // Handle new case
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
                      onCloseCase();
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
                      onChangeCaseNumber();
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                  >
                    Change case number...
                  </button>
                  <div className="border-t border-gray-400 my-1"></div>
                  <button 
                    onClick={() => {
                      setShowFileMenu(false);
                      onPrintCase();
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
                        value={tempOperatorLanguage}
                        onChange={(e) => setTempOperatorLanguage(e.target.value)}
                        className="w-full bg-white border border-gray-400 p-2 text-black"
                      >
                        <option value="ENGLISH">ENGLISH</option>
                        <option value="CHINESE">CHINESE</option>
                        <option value="MALAY">MALAY</option>
                        <option value="SPANISH">SPANISH</option>
                        <option value="FRENCH">FRENCH</option>
                        <option value="INDONESIAN">INDONESIAN</option>
                      </select>
                      <p className="text-xs text-gray-600 mt-1">Current: {selectedOperatorLanguage}</p>
                    </div>
                    <div className="mb-4">
                      <label className="block text-black text-sm mb-2">Caller text:</label>
                      <select 
                        value={tempCallerLanguage}
                        onChange={(e) => setTempCallerLanguage(e.target.value)}
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
                          onLanguageChange(tempOperatorLanguage, tempCallerLanguage);
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
                  <button 
                    onClick={() => {
                      setShowHelpMenu(false);
                      setShowLearnMoreConfirm(true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                  >
                    Learn More
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* About DISPATCHUMS Dialog */}
      {showAboutDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-[100] pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[550px]">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              <span>About DISPATCHUMS</span>
              <button onClick={() => setShowAboutDialog(false)} className="text-white hover:bg-red-600 px-2">✕</button>
            </div>
            
            <div className="bg-white p-6">
              <div className="mb-4">
                <p className="text-black text-sm leading-relaxed mb-4">
                  Welcome to DISPATCHUMS, Advanced Medical Priority Dispatch System (MPDS) initially built for Hospital Universiti Malaysia Sabah, . It provides the user with simple, accurate, and safe access to all MPDS protocols, and allows rapid interaction between the System's Priority Dispatch and Dispatch Life Support (Post-Dispatch Instructions and Pre-Arrival Instructions). This is the standard approach in Emergency Medical Dispatching which is suitable for training demo, case study and professional dispatching. Save lives, save all.
                </p>
                
                <p className="text-black text-sm mb-2">
                  For more details may enter learn more as below.
                </p>
              </div>

              <div className="border-t border-gray-400 pt-4 mb-4">
                <div className="flex items-center justify-between">
                  <div className="text-xs text-black">
                    <div className="font-semibold">DISPATCHUMS Corporation</div>
                    <div>Sabah, Malaysia</div>
                    <div>www.dispatchums.com</div>
                    <div>Copyright (c) 2025</div>
                    <div>All rights reserved.</div>
                  </div>
                  
                  <div className="flex flex-col items-center">
                    <div className="text-center">
                      <h2 className="text-3xl font-serif text-black tracking-wide">
                        DISPATCHUMS
                      </h2>
                      <p className="text-black text-xs">Medical Priority Dispatch System</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setShowLearnMoreConfirm(true)}
                  className="px-6 py-2 bg-[#1D9BF0] text-white border border-gray-600 hover:bg-[#1a8cd8] transition"
                >
                  Learn More
                </button>
                <button 
                  onClick={() => setShowAboutDialog(false)}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-green-600 text-xl">✓</span> OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Learn More Confirmation Dialog */}
      {showLearnMoreConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-[110] pointer-events-none">
          <div className="bg-white rounded-lg p-8 shadow-2xl border-2 border-[#1D9BF0] pointer-events-auto">
            <h3 className="text-xl font-semibold text-black mb-4">Exit to Landing Page</h3>
            <p className="text-gray-700 mb-6">
              You are about to exit the operator interface and go to the landing page.<br/>
              Are you sure you want to continue?
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowLearnMoreConfirm(false)}
                className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  window.location.href = '/';
                }}
                className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
              >
                Yes, Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Section */}
      <div className="absolute top-0 right-6 mt-1">
        <button
          onClick={() => setShowProfileMenu(!showProfileMenu)}
          className="flex items-center gap-3 hover:opacity-80 transition"
        >
          <div className="text-right">
            <div className="text-white text-sm font-medium">{fullName}</div>
            <div className="text-gray-400 text-xs">{username}</div>
          </div>
          <div className="w-10 h-10 rounded-full bg-[#1D9BF0] flex items-center justify-center text-white font-semibold">
            {fullName.split(' ').map(n => n[0]).join('')}
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

      {/* Three Column Layout - Bottom Section */}
      <div className="bg-[#27272A] border-t border-[#27272A] flex mt-auto">
        {/* Left Column - User Info & Case Number */}
        <div className="w-1/4 border-r border-gray-600 p-3">
          <div className="space-y-2">
            <div className="text-white">
              <div className="text-base font-semibold">{username}</div>
              <div className="text-base text-gray-400">{fullName}</div>
            </div>
            
            <div className="text-white">
              <div className="text-base font-semibold text-gray-500">
                {caseNumber ? caseNumber : 'No case number'}
              </div>
            </div>
          </div>
        </div>

        {/* Middle Column - O & C Settings */}
        <div className="w-1/4 border-r border-gray-600 p-3">
          <div className="space-y-1 w-full">
            <div className="text-white">
              <div className="text-base text-gray-400">O: {selectedOperatorLanguage}</div>
              <div className="text-base text-gray-400">C: {selectedCallerLanguage}</div>
            </div>
          </div>
        </div>

        {/* Right Column - Case Information */}
        <div className="w-1/2 p-3">
          <div className="text-white">
            {caseNumber ? (
              <div className="space-y-1">
                <div className="text-base text-gray-400">Case Information</div>
                <div className="text-base font-semibold">Case #{caseNumber}</div>
              </div>
            ) : (
              <div className="text-base text-gray-500">No active case</div>
            )}
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
                  {fullName.split(' ').map(n => n[0]).join('')}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-black text-sm font-semibold mb-1">First Name</label>
                  <input
                    type="text"
                    value={tempProfileData.firstName}
                    onChange={(e) => setTempProfileData({...tempProfileData, firstName: e.target.value})}
                    className="w-full px-3 py-2 bg-white text-black border-2 border-gray-400 focus:outline-none focus:border-[#0066CC]"
                  />
                </div>

                <div>
                  <label className="block text-black text-sm font-semibold mb-1">Last Name</label>
                  <input
                    type="text"
                    value={tempProfileData.lastName}
                    onChange={(e) => setTempProfileData({...tempProfileData, lastName: e.target.value})}
                    className="w-full px-3 py-2 bg-white text-black border-2 border-gray-400 focus:outline-none focus:border-[#0066CC]"
                  />
                </div>

                <div>
                  <label className="block text-black text-sm font-semibold mb-1">Username <span className="text-xs text-gray-600">(can change once a year)</span></label>
                  <input
                    type="text"
                    value={tempProfileData.username}
                    onChange={(e) => setTempProfileData({...tempProfileData, username: e.target.value})}
                    className="w-full px-3 py-2 bg-white text-black border-2 border-gray-400 focus:outline-none focus:border-[#0066CC]"
                  />
                </div>

                <div>
                  <label className="block text-black text-sm font-semibold mb-1">Email Address</label>
                  <input
                    type="email"
                    value={tempProfileData.email}
                    onChange={(e) => setTempProfileData({...tempProfileData, email: e.target.value})}
                    className="w-full px-3 py-2 bg-white text-black border-2 border-gray-400 focus:outline-none focus:border-[#0066CC]"
                  />
                </div>

                <div>
                  <label className="block text-black text-sm font-semibold mb-1">Password</label>
                  <input
                    type="password"
                    value={tempProfileData.password}
                    onChange={(e) => setTempProfileData({...tempProfileData, password: e.target.value})}
                    className="w-full px-3 py-2 bg-white text-black border-2 border-gray-400 focus:outline-none focus:border-[#0066CC]"
                  />
                </div>

                <div>
                  <label className="block text-black text-sm font-semibold mb-1">Role</label>
                  <input
                    type="text"
                    value={tempProfileData.role}
                    readOnly
                    className="w-full px-3 py-2 bg-gray-100 text-black border-2 border-gray-400 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-black text-sm font-semibold mb-1">Account Created</label>
                  <input
                    type="text"
                    value={tempProfileData.accountCreated}
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
                    onClick={() => {
                      if (onProfileUpdate) {
                        onProfileUpdate(tempProfileData);
                      }
                      setShowProfileDialog(false);
                    }}
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
                  if (onDeleteAccount) {
                    onDeleteAccount();
                  }
                  setShowDeleteAccountConfirm(false);
                  setShowProfileDialog(false);
                }}
                className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Yes, Delete Account
              </button>
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
                      <td className="border border-gray-400 px-2 py-1 text-black">STANDARD AMERICAN</td>
                      <td className="border border-gray-400 px-2 py-1 text-black">4/22/2025</td>
                    </tr>
                    <tr>
                      <td className="border border-gray-400 px-2 py-1 text-black">0.0.1</td>
                      <td className="border border-gray-400 px-2 py-1 text-black">CHINESE</td>
                      <td className="border border-gray-400 px-2 py-1 text-black">STANDARD</td>
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

      {/* Logoff Confirmation Dialog */}
      {showLogoffConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-lg p-8 shadow-2xl border-2 border-[#1D9BF0] pointer-events-auto">
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
                onClick={onLogout}
                className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
              >
                Yes, Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CBRN Dialog */}
      {showCBRN && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[500px]">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              <span>⚕ CBRN Surveillance</span>
              <button onClick={() => setShowCBRN(false)} className="text-white hover:bg-red-600 px-2">✕</button>
            </div>
            <div className="p-4 bg-[#C0C0C0]">
              <div className="flex justify-between mb-4">
                <button 
                  onClick={() => setShowCBRN(false)}
                  className="px-4 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-red-600 text-xl">✗</span> Cancel
                </button>
                <button className="px-4 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2">
                  <span className="text-green-600">Info Completed ✓</span>
                </button>
              </div>
              
              <p className="text-blue-700 text-sm mb-3">
                Listen carefully and tell me if s/he has any of the following symptoms:
              </p>
              
              <div className="space-y-1 text-sm text-black">
                {[
                  'a rash',
                  'diarrhea',
                  'low back pain',
                  'has or had a fever (clearly hot to touch)',
                  'weakness',
                  'double vision',
                  'difficulty swallowing',
                  'drooling',
                  'pinpoint pupils',
                  'excessive nasal discharge',
                  'a bloody discharge',
                  'pox or pustules',
                  'blistered skin',
                  'peeling skin',
                  'vomiting'
                ].map((symptom, idx) => (
                  <label key={idx} className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>{symptom}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SARS Dialog */}
      {showSARS && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[500px]">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              <span>⚕ SARS Symptoms</span>
              <button onClick={() => setShowSARS(false)} className="text-white hover:bg-red-600 px-2">✕</button>
            </div>
            <div className="p-4 bg-[#C0C0C0]">
              <div className="flex justify-between mb-4">
                <button 
                  onClick={() => setShowSARS(false)}
                  className="px-4 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-red-600 text-xl">✗</span> Cancel
                </button>
                <button className="px-4 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2">
                  <span className="text-green-600">Info Completed ✓</span>
                </button>
              </div>
              
              <p className="text-blue-700 text-sm mb-3">
                Listen carefully and tell me if s/he has any of the following symptoms:
              </p>
              
              <div className="space-y-1 text-sm text-black">
                {[
                  'difficulty breathing or shortness of breath',
                  'a persistent cough',
                  'diarrhea',
                  'a rash',
                  'contact with a known or suspected SARS-infected patient',
                  'has or had a fever (clearly hot to touch)',
                  'travel to or from China',
                  'travel to or from Hong Kong',
                  'travel to or from Vietnam',
                  'travel to or from Toronto',
                  'travel to or from Singapore',
                  'travel to anywhere else in Asia'
                ].map((symptom, idx) => (
                  <label key={idx} className="flex items-center gap-2">
                    <input type="checkbox" className="w-4 h-4" />
                    <span>{symptom}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Specific PAI Dialog */}
      {/* Log Comments Dialog */}
      {showLogComments && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[500px]">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              <span>Comment</span>
              <button onClick={() => setShowLogComments(false)} className="text-white hover:bg-red-600 px-2">✕</button>
            </div>
            <div className="p-6 bg-white">
              <label className="block text-black text-sm mb-2">Reason:</label>
              <textarea
                className="w-full px-4 py-2 bg-white text-black border-2 border-gray-400 focus:outline-none focus:border-[#0066CC] mb-4"
                rows={6}
                maxLength={60}
                placeholder="Type your comment here (max 60 characters)..."
              />
              <p className="text-xs text-gray-600 mb-4">
                The text field will accept up to 60 alphanumeric characters.
              </p>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setShowLogComments(false)}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-red-600 text-xl">✗</span> Cancel
                </button>
                <button 
                  onClick={() => setShowLogComments(false)}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-green-600 text-xl">✓</span> OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Urgent Message Dialog */}
      {showUrgentMessage && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[500px]">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              <span>Urgent Message</span>
              <button onClick={() => setShowUrgentMessage(false)} className="text-white hover:bg-red-600 px-2">✕</button>
            </div>
            <div className="p-6 bg-white">
              <label className="block text-black text-sm mb-2">Reason:</label>
              <textarea
                className="w-full px-4 py-2 bg-white text-black border-2 border-gray-400 focus:outline-none focus:border-[#0066CC] mb-4"
                rows={6}
                maxLength={60}
                placeholder="Type your urgent message here (max 60 characters)..."
              />
              <p className="text-xs text-gray-600 mb-2">
                The text field will accept up to 60 alphanumeric characters.
              </p>
              <p className="text-xs text-red-600 mb-4">
                This feature may not be supported by all CAD systems. Check with your CAD vendor before using it.
              </p>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setShowUrgentMessage(false)}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-red-600 text-xl">✗</span> Cancel
                </button>
                <button 
                  onClick={() => setShowUrgentMessage(false)}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-green-600 text-xl">✓</span> OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* HAZMAT Info Dialog */}
      {showHazmatInfo && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[550px] max-h-[90vh] overflow-y-auto">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              <span>Essential HAZMAT Information</span>
              <button onClick={() => setShowHazmatInfo(false)} className="text-white hover:bg-red-600 px-2">✕</button>
            </div>
            <div className="p-4 bg-white">
              <div className="flex justify-between mb-3">
                <button 
                  onClick={() => setShowHazmatInfo(false)}
                  className="px-4 py-1 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2 text-sm"
                >
                  <span className="text-red-600 text-xl">✗</span> Cancel
                </button>
                <button className="px-4 py-1 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2 text-sm">
                  <span className="text-green-600">Info Completed ✓</span>
                </button>
              </div>
              <div className="space-y-2">
                {[
                  '1. Name/Phone:',
                  '2. Location/Source/Nature:',
                  '3. Dead/Injured:',
                  '4. Chemical name:',
                  '5. Container description:',
                  '6. Amount released:',
                  '7. Type of release:',
                  '8. Time of release:',
                  '9. Total amount:',
                  '10. Present state:',
                  '11. Significant amounts?:',
                  '12. Direction of vapors/fumes:',
                  '13. Weather conditions:',
                  '14. Local terrain:'
                ].map((label, idx) => (
                  <div key={idx}>
                    <label className="block text-black text-xs mb-0.5">{label}</label>
                    <input
                      type="text"
                      className="w-full px-2 py-1 bg-white text-black border border-gray-400 focus:outline-none focus:border-[#0066CC] text-xs"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Print Case Dialog */}
      {showPrintCase && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[400px]">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              <span>Print Case Summary</span>
              <button onClick={() => setShowPrintCase(false)} className="text-white hover:bg-red-600 px-2">✕</button>
            </div>
            <div className="p-6 bg-[#C0C0C0]">
              <div className="space-y-2 mb-4">
                <label className="flex items-center gap-2 text-black">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span>Case information</span>
                </label>
                <label className="flex items-center gap-2 text-black">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span>Four commandments</span>
                </label>
                <label className="flex items-center gap-2 text-black">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span>Dispatch information</span>
                </label>
                <label className="flex items-center gap-2 text-black">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span>Responder script</span>
                </label>
                <label className="flex items-center gap-2 text-black">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span>Time stamps</span>
                </label>
                <label className="flex items-center gap-2 text-black">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span>Running times</span>
                </label>
                <label className="flex items-center gap-2 text-black">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span>Key Question Answers</span>
                </label>
                <label className="flex items-center gap-2 text-black">
                  <input type="checkbox" defaultChecked className="w-4 h-4" />
                  <span>Case sequences</span>
                </label>
              </div>
              
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => setShowPrintCase(false)}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-green-600 text-xl">🖨</span> Print
                </button>
                <button 
                  onClick={() => setShowPrintCase(false)}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-red-600 text-xl">✗</span> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showSpecificPAI && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[700px] max-h-[600px] overflow-y-auto">
            <div className="bg-[#0066CC] text-white px-3 py-1 font-semibold flex justify-between items-center">
              <span>Specific PAI Target Tool</span>
              <button onClick={() => setShowSpecificPAI(false)} className="text-white">✕</button>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-3 gap-2 mb-4">
                {/* Adult Column */}
                <div>
                  <div className="bg-[#C0C0C0] text-black px-2 py-1 text-center font-semibold border border-gray-400">
                    Adult
                  </div>
                  <div className="bg-white border border-gray-400 h-64 overflow-y-auto p-2">
                    <div className="space-y-1 text-xs text-black">
                      {[
                        { id: 'adult-a', text: 'A: Arrest / Choking (Unconscious)', hasOptions: true, options: ['1 - Check responsiveness', '2 - Position for CPR', '3 - Check pulse/breathing', '4 - Begin CPR cycles', '5 - Apply AED if available'] },
                        { id: 'adult-d', text: 'D: Choking (Conscious)', hasOptions: true, options: ['1 - Encourage coughing', '2 - Back blows (5 times)', '3 - Abdominal thrusts', '4 - Alternate back blows/thrusts', '5 - Check mouth for object'] },
                        { id: 'adult-h', text: 'H: Childbirth - Delivery', hasOptions: true, options: ['1 - Delivery preparation', '2 - Support baby\'s head', '3 - Check for cord around neck', '4 - Deliver shoulders', '5 - Postpartum care'] }
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
                            <div className="ml-4 space-y-0.5">
                              {item.options.map((option, idx) => (
                                <div key={idx} className="text-black text-xs">{option}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Child Column */}
                <div>
                  <div className="bg-[#C0C0C0] text-black px-2 py-1 text-center font-semibold border border-gray-400">
                    Child
                  </div>
                  <div className="bg-white border border-gray-400 h-64 overflow-y-auto p-2">
                    <div className="space-y-1 text-xs text-black">
                      {[
                        { id: 'child-b', text: 'B: Arrest / Choking (Unconscious)', hasOptions: true, options: ['1 - Check child responsiveness', '2 - Position for pediatric CPR', '3 - Check pulse/breathing (10 sec)', '4 - Begin child CPR (15:2 ratio)', '5 - Consider AED if >1 year'] },
                        { id: 'child-d', text: 'D: Choking (Conscious)', hasOptions: true, options: ['1 - Encourage coughing', '2 - Back blows (child position)', '3 - Abdominal thrusts (modified)', '4 - Check mouth carefully', '5 - Call for advanced help'] }
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
                            <div className="ml-4 space-y-0.5">
                              {item.options.map((option, idx) => (
                                <div key={idx} className="text-black text-xs">{option}</div>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Infant Column */}
                <div>
                  <div className="bg-[#C0C0C0] text-black px-2 py-1 text-center font-semibold border border-gray-400">
                    Infant
                  </div>
                  <div className="bg-white border border-gray-400 h-64 overflow-y-auto p-2">
                    <div className="space-y-1 text-xs text-black">
                      {[
                        { id: 'infant-a', text: 'A: Arrest / Choking (Unconscious)', hasOptions: false },
                        { id: 'infant-d', text: 'D: Choking (Conscious)', hasOptions: false },
                        { id: 'infant-f', text: 'F: Childbirth - Delivery', hasOptions: false }
                      ].map((item) => (
                        <div key={item.id}>
                          <div 
                            className={`cursor-pointer hover:bg-blue-100 p-1 ${selectedPAI.includes(item.id) ? 'bg-blue-500 text-white' : ''}`}
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
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 justify-center">
                <button 
                  onClick={() => {
                    if (onPAISelect) {
                      onPAISelect(selectedPAI);
                    }
                    setShowSpecificPAI(false);
                  }}
                  className="px-6 py-1 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
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
    </>
  );
}