'use client';

import React, { Fragment, useState } from 'react';
import Link from 'next/link';
import { useNavigation } from './NavigationContext';

interface ProfileData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: string;
  accountCreated: string;
}

interface SharedNavigationProps {
  showHeading?: boolean;
  showProfile?: boolean;
  username?: string;
  fullName?: string;
  caseNumber?: string;
  selectedOperatorLanguage?: string;
  selectedCallerLanguage?: string;
  hintsEnabled?: boolean;
  setHintsEnabled?: (value: boolean) => void;
  sortChiefComplaints?: boolean;
  setSortChiefComplaints?: (value: boolean) => void;
  onLogout?: () => void;
  onLanguageChange?: (operator: string, caller: string) => void;
  onCloseCase?: () => void;
  onChangeCaseNumber?: () => void;
  onPrintCase?: () => void;
  onAbout?: () => void;
  onPAISelect?: (selectedPAI: string[]) => void;
  onProfileUpdate?: (data: ProfileData) => void;
  onDeleteAccount?: () => void;
  profileData?: ProfileData;
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  activeSubTab?: string;
  setActiveSubTab?: (tab: string) => void;
  children?: React.ReactNode;
}

interface MenuState {
  showFileMenu: boolean;
  showViewMenu: boolean;
  showSpecLogMenu: boolean;
  showOptionsMenu: boolean;
  showLanguageMenu: boolean;
  showTabsMenu: boolean;
  showHelpMenu: boolean;
  showProfileMenu: boolean;
}

interface DialogState {
  showProfileDialog: boolean;
  showDeleteAccountConfirm: boolean;
  showSearchIncident: boolean;
  showAbortReason: boolean;
  showAbortConfirm: boolean;
  showPickupCase: boolean;
  showPickupConfirm: boolean;
  showChangeCaseNumber: boolean;
  showPrintCase: boolean;
  showLogoffConfirmation: boolean;
  showLogComments: boolean;
  showUrgentMessage: boolean;
  showHazmatInfo: boolean;
  showCBRN: boolean;
  showSARS: boolean;
  showVersionInfo: boolean;
  showSpecificPAI: boolean;
  showLanguageApplyConfirm: boolean;
  showAboutDialog: boolean;
  showLearnMoreConfirm: boolean;
}

const SharedNavigation: React.FC<SharedNavigationProps> = ({
  showHeading = false,
  showProfile = true,
  username = 'SUPERVISOR',
  fullName = 'John Supervisor',
  caseNumber = '',
  selectedOperatorLanguage = 'ENGLISH',
  selectedCallerLanguage = 'ENGLISH',
  hintsEnabled = true,
  setHintsEnabled = () => {},
  sortChiefComplaints = false,
  setSortChiefComplaints = () => {},
  onLogout = () => {},
  onLanguageChange = () => {},
  onCloseCase = () => {},
  onChangeCaseNumber = () => {},
  onPrintCase = () => {},
  onAbout,
  onPAISelect,
  onProfileUpdate,
  onDeleteAccount,
  profileData,
  activeTab = 'Entry',
  setActiveTab = () => {},
  activeSubTab = 'Case Entry',
  setActiveSubTab = () => {},
  children
}) => {
  // Menu states
  const [menus, setMenus] = useState<MenuState>({
    showFileMenu: false,
    showViewMenu: false,
    showSpecLogMenu: false,
    showOptionsMenu: false,
    showLanguageMenu: false,
    showTabsMenu: false,
    showHelpMenu: false,
    showProfileMenu: false
  });

  // Dialog states
  const [dialogs, setDialogs] = useState<DialogState>({
    showProfileDialog: false,
    showDeleteAccountConfirm: false,
    showSearchIncident: false,
    showAbortReason: false,
    showAbortConfirm: false,
    showPickupCase: false,
    showPickupConfirm: false,
    showChangeCaseNumber: false,
    showPrintCase: false,
    showLogoffConfirmation: false,
    showLogComments: false,
    showUrgentMessage: false,
    showHazmatInfo: false,
    showCBRN: false,
    showSARS: false,
    showVersionInfo: false,
    showSpecificPAI: false,
    showLanguageApplyConfirm: false,
    showAboutDialog: false,
    showLearnMoreConfirm: false
  });

  // Other states
  const [expandedPAI, setExpandedPAI] = useState<Record<string, boolean>>({});
  const [selectedPAI, setSelectedPAI] = useState<string[]>([]);
  const [abortReason, setAbortReason] = useState('');
  const [selectedPickupCase, setSelectedPickupCase] = useState<number | null>(null);
  
  // Language States
  const [tempOperatorLanguage, setTempOperatorLanguage] = useState(selectedOperatorLanguage);
  const [tempCallerLanguage, setTempCallerLanguage] = useState(selectedCallerLanguage);
  
  // Profile State
  const [tempProfileData, setTempProfileData] = useState<ProfileData>(profileData || {
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    password: '',
    role: '',
    accountCreated: ''
  });
  
  // Menu handlers
  const toggleMenu = (menuName: keyof MenuState) => {
    setMenus(prev => {
      const newState = { ...prev };
      // Close all menus
      Object.keys(newState).forEach(key => {
        newState[key as keyof MenuState] = false;
      });
      // Toggle the clicked menu
      newState[menuName] = !prev[menuName];
      return newState;
    });
  };

  // Dialog handlers
  const toggleDialog = (dialogName: keyof DialogState, value: boolean) => {
    setDialogs(prev => ({
      ...prev,
      [dialogName]: value
    }));
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
      {/* Top Navigation Bar - REMOVED RED BORDERS */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {showHeading && (
              <Link href="/" className="group">
                <h1 className="text-3xl font-serif text-white tracking-wide hover:text-[#1D9BF0] transition">
                  DISPATCHUMS
                </h1>
              </Link>
            )}
            
            {/* Profile Menu */}
            {showProfile && (
              <div className="relative">
              <button 
                onClick={() => toggleMenu('showProfileMenu')}
                className="p-2 text-white hover:text-[#1D9BF0] transition"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </button>
              
              {menus.showProfileMenu && (
                <div className="absolute top-full right-0 mt-2 bg-[#D3D3D3] border border-gray-400 shadow-lg z-50 min-w-[200px]">
                  <button 
                    onClick={() => onProfileUpdate?.(tempProfileData)}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                  >
                    Profile Settings
                  </button>
                  <button 
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                  >
                    Logout
                  </button>
                </div>
             )}
            </div>
            )}
          </div>
        </div>
      </nav>

      {/* Menu Bar - REMOVED RED BORDERS */}
      <div className="fixed top-20 left-0 right-0 z-40 bg-[#C0C0C0]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-6 text-black text-sm font-medium">
            {/* File Menu */}
            <div className="relative">
              <button 
                className="py-1 hover:underline"
                onClick={() => toggleMenu('showFileMenu')}
              >
                File
              </button>
              
              {menus.showFileMenu && (
                <div className="absolute top-full left-0 mt-0 bg-[#D3D3D3] border border-gray-400 shadow-lg z-50 min-w-[200px]">
                  <button className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black">
                    <span>New case</span>
                    <span className="text-xs">Ctrl+N</span>
                  </button>
                  <button 
                    onClick={() => toggleDialog('showSearchIncident', true)}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black"
                  >
                    <span>Open case...</span>
                    <span className="text-xs">Ctrl+O</span>
                  </button>
                  <button onClick={onCloseCase} className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black">
                    <span>Close case</span>
                    <span className="text-xs">Ctrl+F4</span>
                  </button>
                  <div className="border-t border-gray-400 my-1"></div>
                  <button className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black">
                    Change case number...
                  </button>
                  <div className="border-t border-gray-400 my-1"></div>
                  <button onClick={onPrintCase} className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black">
                    Print case...
                  </button>
                  <div className="border-t border-gray-400 my-1"></div>
                  <button 
                    onClick={onLogout}
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
                onClick={() => toggleMenu('showViewMenu')}
              >
                View
              </button>
              
              {menus.showViewMenu && (
                <div className="absolute top-full left-0 mt-0 bg-[#D3D3D3] border border-gray-400 shadow-lg z-50 min-w-[200px]">
                  <button 
                    onClick={() => setHintsEnabled(!hintsEnabled)}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex items-center gap-2 text-black"
                  >
                    <span className="w-4">{hintsEnabled ? 'X' : ''}</span>
                    <span>Hints</span>
                  </button>
                  <button 
                    onClick={() => setSortChiefComplaints(!sortChiefComplaints)}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex items-center gap-2 text-black"
                  >
                    <span className="w-4">{sortChiefComplaints ? 'X' : ''}</span>
                    <span>Sort Chief Complaints</span>
                  </button>
                </div>
              )}
            </div>

            {/* Spec Log Menu */}
            <div className="relative">
              <button 
                className="py-1 hover:underline"
                onClick={() => toggleMenu('showSpecLogMenu')}
              >
                Spec Log
              </button>
              
              {menus.showSpecLogMenu && (
                <div className="absolute top-full left-0 mt-0 bg-[#D3D3D3] border border-gray-400 shadow-lg z-50 min-w-[200px]">
                  <button 
                    onClick={() => toggleDialog('showLogComments', true)}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black"
                  >
                    <span>Log comments</span>
                    <span className="text-xs">Ctrl+L</span>
                  </button>
                  <button 
                    onClick={() => toggleDialog('showHazmatInfo', true)}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                  >
                    HAZMAT Info
                  </button>
                  <button 
                    onClick={() => toggleDialog('showUrgentMessage', true)}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                  >
                    Urgent Message
                  </button>
                  <div className="border-t border-gray-400 my-1"></div>
                  <button 
                    onClick={() => toggleDialog('showCBRN', true)}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                  >
                    CBRN
                  </button>
                  <button 
                    onClick={() => toggleDialog('showSARS', true)}
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
                onClick={() => toggleMenu('showOptionsMenu')}
              >
                Options
              </button>
              
              {menus.showOptionsMenu && (
                <div className="absolute top-full left-0 mt-0 bg-[#D3D3D3] border border-gray-400 shadow-lg z-50 min-w-[200px]">
                  <button 
                    onClick={onLogout}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                  >
                    Logout operator
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black">
                    Go to protocol...
                  </button>
                  <button 
                    onClick={() => toggleDialog('showSpecificPAI', true)}
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
                onClick={() => toggleMenu('showLanguageMenu')}
              >
                Go to language
              </button>
              
              {menus.showLanguageMenu && (
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
                          toggleMenu('showLanguageMenu');
                          toggleDialog('showLanguageApplyConfirm', true);
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
                onClick={() => toggleMenu('showTabsMenu')}
              >
                Tabs
              </button>
              
              {menus.showTabsMenu && (
                <div className="absolute top-full left-0 mt-0 bg-[#D3D3D3] border border-gray-400 shadow-lg z-50 min-w-[250px]">
                  <button 
                    onClick={() => {
                      setActiveTab?.('Entry');
                      setActiveSubTab?.('Case Entry');
                      toggleMenu('showTabsMenu');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                  >
                    Case Entry
                  </button>
                  <button 
                    onClick={() => {
                      setActiveTab?.('KQ');
                      toggleMenu('showTabsMenu');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                  >
                    Key Questions
                  </button>
                  <button 
                    onClick={() => {
                      setActiveTab?.('PDI/CEI');
                      toggleMenu('showTabsMenu');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                  >
                    Post Dispatch Instructions
                  </button>
                  <button 
                    onClick={() => {
                      setActiveTab?.('DLS');
                      toggleMenu('showTabsMenu');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                  >
                    Dispatch Life Support
                  </button>
                  <button 
                    onClick={() => {
                      setActiveTab?.('Summary');
                      toggleMenu('showTabsMenu');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                  >
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
                onClick={() => toggleMenu('showHelpMenu')}
              >
                Help
              </button>
              
              {menus.showHelpMenu && (
                <div className="absolute top-full left-0 mt-0 bg-[#D3D3D3] border border-gray-400 shadow-lg z-50 min-w-[200px]">
                  <button 
                    onClick={() => {
                      toggleMenu('showHelpMenu');
                      toggleDialog('showVersionInfo', true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                  >
                    Version
                  </button>
                  <button 
                    onClick={() => {
                      toggleMenu('showHelpMenu');
                      toggleDialog('showAboutDialog', true);
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

      {/* Main Content */}
      <div className="pt-32 min-h-screen flex flex-col">
        {/* Tab Navigation - REMOVED RED BORDERS */}
        <div className="bg-[#C0C0C0]">
          <div className="max-w-7xl mx-auto">
            <div className="flex w-full">
              {['Entry', 'KQ', 'PDI/CEI', 'DLS', 'Summary'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab?.(tab)}
                  className={`flex-1 py-2 ${
                    tab === activeTab 
                      ? 'bg-white text-black font-medium' 
                      : 'text-black hover:bg-gray-300 transition'
                  } border-r border-gray-500`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative bg-[#D3D3D3]">
          {children}
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
                  <div className="text-lg">Case #{caseNumber}</div>
                </div>
              ) : (
                <div className="text-gray-500">No active case</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Dialogs */}
      {Object.entries(dialogs).map(([dialogName, isOpen]) => {
        if (!isOpen) return null;

        switch (dialogName) {
          case 'showLogoffConfirmation':
            return (
              <div key={dialogName} className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                <div className="bg-white rounded-lg p-8 shadow-2xl border-2 border-[#1D9BF0] pointer-events-auto">
                  <h3 className="text-xl font-semibold text-black mb-4">Exit Operator Interface</h3>
                  <p className="text-gray-700 mb-6">
                    Are you sure you want to exit the operator interface and return to the landing page?
                  </p>
                  <div className="flex gap-4 justify-end">
                    <button
                      onClick={() => toggleDialog('showLogoffConfirmation', false)}
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
            );

          case 'showLanguageApplyConfirm':
            return (
              <div key={dialogName} className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
                <div className="bg-white rounded-lg p-8 shadow-2xl border-2 border-[#1D9BF0] pointer-events-auto">
                  <h3 className="text-xl font-semibold text-black mb-4">Change Language</h3>
                  <p className="text-gray-700 mb-6">
                    Are you sure you want to change the language settings?
                  </p>
                  <div className="flex gap-4 justify-end">
                    <button
                      onClick={() => toggleDialog('showLanguageApplyConfirm', false)}
                      className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        onLanguageChange?.(tempOperatorLanguage, tempCallerLanguage);
                        toggleDialog('showLanguageApplyConfirm', false);
                      }}
                      className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
                    >
                      Yes, Change
                    </button>
                  </div>
                </div>
              </div>
            );

          // Add more dialog cases as needed...
          
          default:
            return null;
        }
      })}
    </div>
  );
};

export default SharedNavigation;