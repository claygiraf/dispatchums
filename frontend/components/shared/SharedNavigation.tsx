'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

// Dialog Components
interface DialogProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  width?: string;
  className?: string;
}

const Dialog: React.FC<DialogProps> = ({ 
  title, 
  children, 
  isOpen, 
  onClose, 
  width = '500px',
  className = ''
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div className={`bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto ${width ? `w-[${width}]` : ''} ${className}`}>
        <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
          <span>{title}</span>
          <button onClick={onClose} className="text-white hover:bg-red-600 px-2">✕</button>
        </div>
        <div className="p-6 bg-white">
          {children}
        </div>
      </div>
    </div>
  );
};

interface DialogButtonsProps {
  children: React.ReactNode;
  align?: 'start' | 'center' | 'end';
}

const DialogButtons: React.FC<DialogButtonsProps> = ({ children, align = 'end' }) => (
  <div className={`flex gap-3 justify-${align} mt-6`}>
    {children}
  </div>
);

interface DialogButtonProps {
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  children: React.ReactNode;
  className?: string;
  width?: string;
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  fullWidth?: boolean;
}

const DialogButton: React.FC<DialogButtonProps> = ({
  onClick,
  variant = 'secondary',
  children,
  className = '',
  width,
  type = 'button',
  disabled = false,
  fullWidth = false,
  ...props
}) => {
  const baseClasses = 'px-6 py-2 border border-gray-600 transition-colors duration-200';
  const variantClasses = {
    primary: 'bg-[#1D9BF0] text-white enabled:hover:bg-[#1a8cd8]',
    secondary: 'bg-[#C0C0C0] text-black enabled:hover:bg-gray-300',
    danger: 'bg-red-600 text-white enabled:hover:bg-red-700',
    ghost: 'bg-transparent text-black hover:bg-gray-100 border-transparent',
  } as const;

  const sizeClasses = width ? `w-[${width}]` : fullWidth ? 'w-full' : '';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses} ${disabledClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Interfaces
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
  const [showFileMenu, setShowFileMenu] = useState(false);
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showSpecLogMenu, setShowSpecLogMenu] = useState(false);
  const [showOptionsMenu, setShowOptionsMenu] = useState(false);
  const [showLanguageMenu, setShowLanguageMenu] = useState(false);
  const [showTabsMenu, setShowTabsMenu] = useState(false);
  const [showHelpMenu, setShowHelpMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Dialog states
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
  const [showInvalidCaseNumber, setShowInvalidCaseNumber] = useState(false);
  const [showVersionInfo, setShowVersionInfo] = useState(false);
  const [showSpecificPAI, setShowSpecificPAI] = useState(false);
  const [showLanguageApplyConfirm, setShowLanguageApplyConfirm] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const [showLearnMoreConfirm, setShowLearnMoreConfirm] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeUsername, setShowChangeUsername] = useState(false);
  const [showChangeConfirm, setShowChangeConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUploadConfirm, setShowUploadConfirm] = useState(false);

  // State variables
  const [selectedPickupCase, setSelectedPickupCase] = useState<number | null>(null);
  const [tempOperatorLanguage, setTempOperatorLanguage] = useState(selectedOperatorLanguage);
  const [tempCallerLanguage, setTempCallerLanguage] = useState(selectedCallerLanguage);
  const [expandedPAI, setExpandedPAI] = useState<Record<string, boolean>>({});
  const [selectedPAI, setSelectedPAI] = useState<string[]>([]);
  const [changeType, setChangeType] = useState('');
  const [tempFullName, setTempFullName] = useState(fullName);
  const [tempUsername, setTempUsername] = useState(username);
  const [tempEmail, setTempEmail] = useState('supervisor@dispatchums.com');
  const [tempGender, setTempGender] = useState('Male');
  const [tempDob, setTempDob] = useState('');
  const [editableField, setEditableField] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  // Close all menus when clicking outside
  useEffect(() => {
    const handleClickOutside = () => {
      setShowFileMenu(false);
      setShowViewMenu(false);
      setShowSpecLogMenu(false);
      setShowOptionsMenu(false);
      setShowLanguageMenu(false);
      setShowTabsMenu(false);
      setShowHelpMenu(false);
      setShowProfileMenu(false);
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const togglePAI = (pai: string) => {
    setExpandedPAI(prev => ({
      ...prev,
      [pai]: !prev[pai]
    }));
  };

  const handlePAISelect = (pai: string) => {
    setSelectedPAI(prev => {
      const newSelected = prev.includes(pai) 
        ? prev.filter(p => p !== pai)
        : [...prev, pai];
      
      onPAISelect?.(newSelected);
      return newSelected;
    });
  };

  const handleLanguageApply = () => {
    onLanguageChange?.(tempOperatorLanguage, tempCallerLanguage);
    setShowLanguageMenu(false);
    setShowLanguageApplyConfirm(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#0A0A0A]">
      {/* Navigation Bar */}
      <nav className="bg-[#C0C0C0] border-b border-gray-400 relative z-40">
        <div className="px-4 py-1">
          <div className="flex items-center">
            {showHeading && (
              <div className="mr-8">
                <Link href="/" className="group">
                  <h1 className="text-2xl font-serif text-black tracking-wide hover:text-[#1D9BF0] transition">
                    DISPATCHUMS
                  </h1>
                </Link>
              </div>
            )}
            
            {/* Menu Bar */}
            <div className="flex space-x-1 relative">
              {/* File Menu */}
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowFileMenu(!showFileMenu);
                    setShowViewMenu(false);
                    setShowSpecLogMenu(false);
                    setShowOptionsMenu(false);
                    setShowLanguageMenu(false);
                    setShowTabsMenu(false);
                    setShowHelpMenu(false);
                  }}
                  className="px-3 py-1 text-black hover:bg-gray-300 rounded transition-colors"
                >
                  File
                </button>
                
                {showFileMenu && (
                  <div className="absolute top-full left-0 bg-white border border-gray-400 shadow-lg min-w-48 z-50">
                    <button 
                      onClick={() => {
                        setShowSearchIncident(true);
                        setShowFileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-100 border-b border-gray-200"
                    >
                      Search for Incident...
                    </button>
                    <button 
                      onClick={() => {
                        setShowAbortReason(true);
                        setShowFileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-100 border-b border-gray-200"
                    >
                      Abort Case...
                    </button>
                    <button 
                      onClick={() => {
                        setShowPickupCase(true);
                        setShowFileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-100 border-b border-gray-200"
                    >
                      Pick Up Case...
                    </button>
                    <button 
                      onClick={() => {
                        setShowChangeCaseNumber(true);
                        setShowFileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-100 border-b border-gray-200"
                    >
                      Change Case Number...
                    </button>
                    <button 
                      onClick={() => {
                        setShowPrintCase(true);
                        setShowFileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-100 border-b border-gray-200"
                    >
                      Print Case...
                    </button>
                    <div className="border-t border-gray-300">
                      <button 
                        onClick={() => {
                          setShowLogoffConfirmation(true);
                          setShowFileMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-blue-100"
                      >
                        Log Off...
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* View Menu */}
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowViewMenu(!showViewMenu);
                    setShowFileMenu(false);
                    setShowSpecLogMenu(false);
                    setShowOptionsMenu(false);
                    setShowLanguageMenu(false);
                    setShowTabsMenu(false);
                    setShowHelpMenu(false);
                  }}
                  className="px-3 py-1 text-black hover:bg-gray-300 rounded transition-colors"
                >
                  View
                </button>
                
                {showViewMenu && (
                  <div className="absolute top-full left-0 bg-white border border-gray-400 shadow-lg min-w-48 z-50">
                    <button 
                      onClick={() => {
                        setShowLogComments(true);
                        setShowViewMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-100 border-b border-gray-200"
                    >
                      Log Comments...
                    </button>
                    <button 
                      onClick={() => {
                        setShowUrgentMessage(true);
                        setShowViewMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-100 border-b border-gray-200"
                    >
                      Urgent Message...
                    </button>
                    <div className="border-t border-gray-300">
                      <button 
                        onClick={() => {
                          setShowSpecificPAI(true);
                          setShowViewMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-blue-100"
                      >
                        Go to Specific PAI...
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* SpecLog Menu */}
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowSpecLogMenu(!showSpecLogMenu);
                    setShowFileMenu(false);
                    setShowViewMenu(false);
                    setShowOptionsMenu(false);
                    setShowLanguageMenu(false);
                    setShowTabsMenu(false);
                    setShowHelpMenu(false);
                  }}
                  className="px-3 py-1 text-black hover:bg-gray-300 rounded transition-colors"
                >
                  SpecLog
                </button>
                
                {showSpecLogMenu && (
                  <div className="absolute top-full left-0 bg-white border border-gray-400 shadow-lg min-w-48 z-50">
                    <button 
                      onClick={() => {
                        setShowHazmatInfo(true);
                        setShowSpecLogMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-100 border-b border-gray-200"
                    >
                      HAZMAT
                    </button>
                    <button 
                      onClick={() => {
                        setShowCBRN(true);
                        setShowSpecLogMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-100 border-b border-gray-200"
                    >
                      CBRN
                    </button>
                    <button 
                      onClick={() => {
                        setShowSARS(true);
                        setShowSpecLogMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-100"
                    >
                      SARS
                    </button>
                  </div>
                )}
              </div>

              {/* Options Menu */}
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowOptionsMenu(!showOptionsMenu);
                    setShowFileMenu(false);
                    setShowViewMenu(false);
                    setShowSpecLogMenu(false);
                    setShowLanguageMenu(false);
                    setShowTabsMenu(false);
                    setShowHelpMenu(false);
                  }}
                  className="px-3 py-1 text-black hover:bg-gray-300 rounded transition-colors"
                >
                  Options
                </button>
                
                {showOptionsMenu && (
                  <div className="absolute top-full left-0 bg-white border border-gray-400 shadow-lg min-w-60 z-50">
                    <div className="px-3 py-2 hover:bg-blue-100 border-b border-gray-200 flex justify-between items-center">
                      <span>Hints</span>
                      <input 
                        type="checkbox" 
                        checked={hintsEnabled}
                        onChange={(e) => setHintsEnabled?.(e.target.checked)}
                        className="ml-2"
                      />
                    </div>
                    <div className="px-3 py-2 hover:bg-blue-100 flex justify-between items-center">
                      <span>Sort Chief Complaints</span>
                      <input 
                        type="checkbox" 
                        checked={sortChiefComplaints}
                        onChange={(e) => setSortChiefComplaints?.(e.target.checked)}
                        className="ml-2"
                      />
                    </div>
                  </div>
                )}
              </div>

              {/* Language Menu */}
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowLanguageMenu(!showLanguageMenu);
                    setShowFileMenu(false);
                    setShowViewMenu(false);
                    setShowSpecLogMenu(false);
                    setShowOptionsMenu(false);
                    setShowTabsMenu(false);
                    setShowHelpMenu(false);
                  }}
                  className="px-3 py-1 text-black hover:bg-gray-300 rounded transition-colors"
                >
                  Language
                </button>
                
                {showLanguageMenu && (
                  <div className="absolute top-full left-0 bg-white border border-gray-400 shadow-lg min-w-64 z-50">
                    <div className="p-3">
                      <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Operator Language:</label>
                        <select 
                          value={tempOperatorLanguage}
                          onChange={(e) => setTempOperatorLanguage(e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="ENGLISH">English</option>
                          <option value="SPANISH">Spanish</option>
                          <option value="FRENCH">French</option>
                        </select>
                      </div>
                      <div className="mb-3">
                        <label className="block text-sm font-medium mb-1">Caller Language:</label>
                        <select 
                          value={tempCallerLanguage}
                          onChange={(e) => setTempCallerLanguage(e.target.value)}
                          className="w-full border border-gray-300 rounded px-2 py-1"
                        >
                          <option value="ENGLISH">English</option>
                          <option value="SPANISH">Spanish</option>
                          <option value="FRENCH">French</option>
                        </select>
                      </div>
                      <div className="flex gap-2">
                        <button 
                          onClick={() => {
                            setShowLanguageApplyConfirm(true);
                            setShowLanguageMenu(false);
                          }}
                          className="px-3 py-1 bg-[#1D9BF0] text-white rounded text-sm hover:bg-[#1a8cd8]"
                        >
                          Apply
                        </button>
                        <button 
                          onClick={() => setShowLanguageMenu(false)}
                          className="px-3 py-1 bg-gray-300 text-black rounded text-sm hover:bg-gray-400"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Tabs Menu */}
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowTabsMenu(!showTabsMenu);
                    setShowFileMenu(false);
                    setShowViewMenu(false);
                    setShowSpecLogMenu(false);
                    setShowOptionsMenu(false);
                    setShowLanguageMenu(false);
                    setShowHelpMenu(false);
                  }}
                  className="px-3 py-1 text-black hover:bg-gray-300 rounded transition-colors"
                >
                  Tabs
                </button>
                
                {showTabsMenu && (
                  <div className="absolute top-full left-0 bg-white border border-gray-400 shadow-lg min-w-48 z-50">
                    <button 
                      onClick={() => {
                        setActiveTab?.('Entry');
                        setActiveSubTab?.('Case Entry');
                        setShowTabsMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-blue-100 border-b border-gray-200 ${activeTab === 'Entry' ? 'bg-blue-50 font-medium' : ''}`}
                    >
                      Case Entry
                    </button>
                    <button 
                      onClick={() => {
                        setActiveTab?.('Protocol');
                        setActiveSubTab?.('Protocol');
                        setShowTabsMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-blue-100 border-b border-gray-200 ${activeTab === 'Protocol' ? 'bg-blue-50 font-medium' : ''}`}
                    >
                      Protocol
                    </button>
                    <button 
                      onClick={() => {
                        setActiveTab?.('Dispatch');
                        setActiveSubTab?.('Dispatch');
                        setShowTabsMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 hover:bg-blue-100 ${activeTab === 'Dispatch' ? 'bg-blue-50 font-medium' : ''}`}
                    >
                      Dispatch
                    </button>
                  </div>
                )}
              </div>

              {/* Help Menu */}
              <div className="relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowHelpMenu(!showHelpMenu);
                    setShowFileMenu(false);
                    setShowViewMenu(false);
                    setShowSpecLogMenu(false);
                    setShowOptionsMenu(false);
                    setShowLanguageMenu(false);
                    setShowTabsMenu(false);
                  }}
                  className="px-3 py-1 text-black hover:bg-gray-300 rounded transition-colors"
                >
                  Help
                </button>
                
                {showHelpMenu && (
                  <div className="absolute top-full left-0 bg-white border border-gray-400 shadow-lg min-w-48 z-50">
                    <button 
                      onClick={() => {
                        setShowVersionInfo(true);
                        setShowHelpMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-100 border-b border-gray-200"
                    >
                      Version Information
                    </button>
                    <button 
                      onClick={() => {
                        setShowLearnMoreConfirm(true);
                        setShowHelpMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-100 border-b border-gray-200"
                    >
                      Learn More...
                    </button>
                    <button 
                      onClick={() => {
                        setShowAboutDialog(true);
                        setShowHelpMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-100"
                    >
                      About DISPATCHUMS
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Profile Menu (Right side) */}
            {showProfile && (
              <div className="ml-auto relative">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowProfileMenu(!showProfileMenu);
                  }}
                  className="flex items-center space-x-2 px-3 py-1 text-black hover:bg-gray-300 rounded transition-colors"
                >
                  <span>{fullName}</span>
                  <span className="text-xs">▼</span>
                </button>
                
                {showProfileMenu && (
                  <div className="absolute top-full right-0 bg-white border border-gray-400 shadow-lg min-w-48 z-50">
                    <button 
                      onClick={() => {
                        setShowProfileSettings(true);
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-100 border-b border-gray-200"
                    >
                      Profile Settings
                    </button>
                    <button 
                      onClick={() => {
                        setShowChangePassword(true);
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-100 border-b border-gray-200"
                    >
                      Change Password
                    </button>
                    <button 
                      onClick={() => {
                        setShowChangeUsername(true);
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-3 py-2 hover:bg-blue-100 border-b border-gray-200"
                    >
                      Change Username
                    </button>
                    <div className="border-t border-gray-300">
                      <button 
                        onClick={() => {
                          onLogout?.();
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-3 py-2 hover:bg-blue-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 pt-12">
        {children}
      </div>

      {/* All Dialogs */}
      
      {/* Search Incident Dialog */}
      <Dialog
        title="Search for Incident"
        isOpen={showSearchIncident}
        onClose={() => setShowSearchIncident(false)}
        width="600px"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-black text-sm mb-1">Search Criteria:</label>
            <input 
              type="text" 
              placeholder="Enter case number, phone number, or address..."
              className="w-full px-3 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-[#0066CC]"
            />
          </div>
          <div className="max-h-64 overflow-y-auto border border-gray-300 rounded">
            <table className="w-full">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Case #</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Date</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Address</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b hover:bg-blue-50 cursor-pointer">
                  <td className="px-3 py-2 text-sm">20241001</td>
                  <td className="px-3 py-2 text-sm">10/01/2024</td>
                  <td className="px-3 py-2 text-sm">123 Main St</td>
                  <td className="px-3 py-2 text-sm">Completed</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <DialogButtons>
          <DialogButton onClick={() => setShowSearchIncident(false)}>Cancel</DialogButton>
          <DialogButton variant="primary">Select</DialogButton>
        </DialogButtons>
      </Dialog>

      {/* Abort Case Dialog */}
      <Dialog
        title="Abort Case"
        isOpen={showAbortReason}
        onClose={() => setShowAbortReason(false)}
        width="500px"
      >
        <div className="space-y-4">
          <p className="text-gray-700">Please select a reason for aborting this case:</p>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="radio" name="abortReason" value="duplicate" className="mr-2" />
              <span>Duplicate call</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="abortReason" value="false_alarm" className="mr-2" />
              <span>False alarm</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="abortReason" value="test_call" className="mr-2" />
              <span>Test call</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="abortReason" value="other" className="mr-2" />
              <span>Other</span>
            </label>
          </div>
          <div>
            <label className="block text-black text-sm mb-1">Additional Comments:</label>
            <textarea 
              className="w-full px-3 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-[#0066CC] h-20"
              placeholder="Enter additional details..."
            />
          </div>
        </div>
        <DialogButtons>
          <DialogButton onClick={() => setShowAbortReason(false)}>Cancel</DialogButton>
          <DialogButton 
            variant="primary"
            onClick={() => {
              setShowAbortReason(false);
              setShowAbortConfirm(true);
            }}
          >
            Abort Case
          </DialogButton>
        </DialogButtons>
      </Dialog>

      {/* Abort Confirmation Dialog */}
      <Dialog
        title="Confirm Abort"
        isOpen={showAbortConfirm}
        onClose={() => setShowAbortConfirm(false)}
        width="400px"
      >
        <p className="text-gray-700 mb-4">
          Are you sure you want to abort this case? This action cannot be undone.
        </p>
        <DialogButtons>
          <DialogButton onClick={() => setShowAbortConfirm(false)}>Cancel</DialogButton>
          <DialogButton 
            variant="danger"
            onClick={() => {
              setShowAbortConfirm(false);
              // Handle abort logic
            }}
          >
            Abort Case
          </DialogButton>
        </DialogButtons>
      </Dialog>

      {/* Pick Up Case Dialog */}
      <Dialog
        title="Pick Up Case"
        isOpen={showPickupCase}
        onClose={() => setShowPickupCase(false)}
        width="600px"
      >
        <div className="space-y-4">
          <p className="text-gray-700">Select a case to pick up:</p>
          <div className="max-h-64 overflow-y-auto border border-gray-300 rounded">
            <table className="w-full">
              <thead className="bg-gray-100 sticky top-0">
                <tr>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Case #</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Operator</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Status</th>
                  <th className="px-3 py-2 text-left text-xs font-medium text-gray-700">Time</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((caseNum) => (
                  <tr 
                    key={caseNum}
                    className={`border-b hover:bg-blue-50 cursor-pointer ${selectedPickupCase === caseNum ? 'bg-blue-100' : ''}`}
                    onClick={() => setSelectedPickupCase(caseNum)}
                  >
                    <td className="px-3 py-2 text-sm">2024100{caseNum}</td>
                    <td className="px-3 py-2 text-sm">Operator {caseNum}</td>
                    <td className="px-3 py-2 text-sm">In Progress</td>
                    <td className="px-3 py-2 text-sm">10:3{caseNum} AM</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <DialogButtons>
          <DialogButton onClick={() => setShowPickupCase(false)}>Cancel</DialogButton>
          <DialogButton 
            variant="primary"
            disabled={!selectedPickupCase}
            onClick={() => {
              setShowPickupCase(false);
              setShowPickupConfirm(true);
            }}
          >
            Pick Up Case
          </DialogButton>
        </DialogButtons>
      </Dialog>

      {/* Pick Up Confirmation Dialog */}
      <Dialog
        title="Confirm Pick Up"
        isOpen={showPickupConfirm}
        onClose={() => setShowPickupConfirm(false)}
        width="400px"
      >
        <p className="text-gray-700 mb-4">
          Are you sure you want to pick up case #{selectedPickupCase}? This will transfer the case to you.
        </p>
        <DialogButtons>
          <DialogButton onClick={() => setShowPickupConfirm(false)}>Cancel</DialogButton>
          <DialogButton 
            variant="primary"
            onClick={() => {
              setShowPickupConfirm(false);
              setSelectedPickupCase(null);
              // Handle pickup logic
            }}
          >
            Pick Up Case
          </DialogButton>
        </DialogButtons>
      </Dialog>

      {/* Change Case Number Dialog */}
      <Dialog
        title="Change Case Number"
        isOpen={showChangeCaseNumber}
        onClose={() => setShowChangeCaseNumber(false)}
        width="400px"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-black text-sm mb-1">Current Case Number:</label>
            <input 
              type="text" 
              value={caseNumber} 
              readOnly 
              className="w-full px-3 py-2 bg-gray-100 text-black border border-gray-400"
            />
          </div>
          <div>
            <label className="block text-black text-sm mb-1">New Case Number:</label>
            <input 
              type="text" 
              className="w-full px-3 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-[#0066CC]"
            />
          </div>
        </div>
        <DialogButtons>
          <DialogButton onClick={() => setShowChangeCaseNumber(false)}>Cancel</DialogButton>
          <DialogButton 
            variant="primary"
            onClick={() => {
              onChangeCaseNumber?.();
              setShowChangeCaseNumber(false);
            }}
          >
            Update Case Number
          </DialogButton>
        </DialogButtons>
      </Dialog>

      {/* Print Case Dialog */}
      <Dialog
        title="Print Case"
        isOpen={showPrintCase}
        onClose={() => setShowPrintCase(false)}
        width="500px"
      >
        <div className="space-y-4">
          <p className="text-gray-700">Select print options:</p>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-2" />
              <span>Case Information</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" defaultChecked className="mr-2" />
              <span>Protocol Details</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Comments</span>
            </label>
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span>Unit Information</span>
            </label>
          </div>
        </div>
        <DialogButtons>
          <DialogButton onClick={() => setShowPrintCase(false)}>Cancel</DialogButton>
          <DialogButton 
            variant="primary"
            onClick={() => {
              onPrintCase?.();
              setShowPrintCase(false);
            }}
          >
            Print
          </DialogButton>
        </DialogButtons>
      </Dialog>

      {/* Log Off Confirmation Dialog */}
      <Dialog
        title="Confirm Log Off"
        isOpen={showLogoffConfirmation}
        onClose={() => setShowLogoffConfirmation(false)}
        width="400px"
      >
        <p className="text-gray-700 mb-4">
          Are you sure you want to log off? Any unsaved changes will be lost.
        </p>
        <DialogButtons>
          <DialogButton onClick={() => setShowLogoffConfirmation(false)}>Cancel</DialogButton>
          <DialogButton 
            variant="primary"
            onClick={() => {
              onLogout?.();
              setShowLogoffConfirmation(false);
            }}
          >
            Log Off
          </DialogButton>
        </DialogButtons>
      </Dialog>

      {/* Log Comments Dialog */}
      <Dialog
        title="Log Comments"
        isOpen={showLogComments}
        onClose={() => setShowLogComments(false)}
        width="600px"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-black text-sm mb-1">Comments:</label>
            <textarea 
              className="w-full px-3 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-[#0066CC] h-32"
              placeholder="Enter your comments here..."
            />
          </div>
        </div>
        <DialogButtons>
          <DialogButton onClick={() => setShowLogComments(false)}>Cancel</DialogButton>
          <DialogButton variant="primary">Save Comments</DialogButton>
        </DialogButtons>
      </Dialog>

      {/* Urgent Message Dialog */}
      <Dialog
        title="Send Urgent Message"
        isOpen={showUrgentMessage}
        onClose={() => setShowUrgentMessage(false)}
        width="500px"
      >
        <div className="space-y-4">
          <div>
            <label className="block text-black text-sm mb-1">Recipient:</label>
            <select className="w-full px-3 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-[#0066CC]">
              <option>All Operators</option>
              <option>Supervisors Only</option>
              <option>Dispatch Units</option>
            </select>
          </div>
          <div>
            <label className="block text-black text-sm mb-1">Message:</label>
            <textarea 
              className="w-full px-3 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-[#0066CC] h-24"
              placeholder="Enter urgent message..."
            />
          </div>
        </div>
        <DialogButtons>
          <DialogButton onClick={() => setShowUrgentMessage(false)}>Cancel</DialogButton>
          <DialogButton variant="danger">Send Urgent</DialogButton>
        </DialogButtons>
      </Dialog>

      {/* HAZMAT Info Dialog */}
      <Dialog
        title="HAZMAT Information"
        isOpen={showHazmatInfo}
        onClose={() => setShowHazmatInfo(false)}
        width="800px"
      >
        <div className="space-y-4">
          <div className="h-96 overflow-y-auto border border-gray-300 p-4 bg-gray-50">
            <h3 className="font-semibold mb-2">Hazardous Materials Protocol</h3>
            <p className="mb-4">This section contains information about handling hazardous materials incidents...</p>
            <div className="space-y-2">
              <div><strong>Class 1:</strong> Explosives</div>
              <div><strong>Class 2:</strong> Gases</div>
              <div><strong>Class 3:</strong> Flammable liquids</div>
              <div><strong>Class 4:</strong> Flammable solids</div>
              <div><strong>Class 5:</strong> Oxidizing substances</div>
              <div><strong>Class 6:</strong> Toxic and infectious substances</div>
              <div><strong>Class 7:</strong> Radioactive materials</div>
              <div><strong>Class 8:</strong> Corrosive substances</div>
              <div><strong>Class 9:</strong> Miscellaneous dangerous substances</div>
            </div>
          </div>
        </div>
        <DialogButtons>
          <DialogButton onClick={() => setShowHazmatInfo(false)}>Close</DialogButton>
        </DialogButtons>
      </Dialog>

      {/* CBRN Dialog */}
      <Dialog
        title="CBRN Protocol"
        isOpen={showCBRN}
        onClose={() => setShowCBRN(false)}
        width="800px"
      >
        <div className="space-y-4">
          <div className="h-96 overflow-y-auto border border-gray-300 p-4 bg-gray-50">
            <h3 className="font-semibold mb-2">Chemical, Biological, Radiological, and Nuclear Protocol</h3>
            <p className="mb-4">This section contains CBRN response procedures...</p>
            <div className="space-y-4">
              <div>
                <strong>Chemical:</strong> Procedures for chemical agent incidents
              </div>
              <div>
                <strong>Biological:</strong> Biological agent response protocols
              </div>
              <div>
                <strong>Radiological:</strong> Radiological incident procedures
              </div>
              <div>
                <strong>Nuclear:</strong> Nuclear incident response
              </div>
            </div>
          </div>
        </div>
        <DialogButtons>
          <DialogButton onClick={() => setShowCBRN(false)}>Close</DialogButton>
        </DialogButtons>
      </Dialog>

      {/* SARS Dialog */}
      <Dialog
        title="SARS Protocol"
        isOpen={showSARS}
        onClose={() => setShowSARS(false)}
        width="800px"
      >
        <div className="space-y-4">
          <div className="h-96 overflow-y-auto border border-gray-300 p-4 bg-gray-50">
            <h3 className="font-semibold mb-2">Search and Rescue Protocol</h3>
            <p className="mb-4">This section contains search and rescue procedures...</p>
            <div className="space-y-4">
              <div>
                <strong>Land Search:</strong> Ground search procedures
              </div>
              <div>
                <strong>Water Rescue:</strong> Water-based rescue operations
              </div>
              <div>
                <strong>Urban Search:</strong> Urban search and rescue
              </div>
              <div>
                <strong>Wilderness:</strong> Wilderness rescue operations
              </div>
            </div>
          </div>
        </div>
        <DialogButtons>
          <DialogButton onClick={() => setShowSARS(false)}>Close</DialogButton>
        </DialogButtons>
      </Dialog>

      {/* Specific PAI Dialog */}
      <Dialog
        title="Go to Specific PAI"
        isOpen={showSpecificPAI}
        onClose={() => setShowSpecificPAI(false)}
        width="600px"
      >
        <div className="space-y-4">
          <div>
            <input 
              type="text" 
              placeholder="Search for PAI..."
              className="w-full px-3 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-[#0066CC]"
            />
          </div>
          <div className="h-64 overflow-y-auto border border-gray-300">
            {['Chest Pain', 'Difficulty Breathing', 'Unconscious', 'Trauma', 'Seizures'].map((pai) => (
              <div 
                key={pai}
                className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-200"
                onClick={() => handlePAISelect(pai)}
              >
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    checked={selectedPAI.includes(pai)}
                    onChange={() => handlePAISelect(pai)}
                    className="mr-2"
                  />
                  <span>{pai}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <DialogButtons>
          <DialogButton onClick={() => setShowSpecificPAI(false)}>Cancel</DialogButton>
          <DialogButton 
            variant="primary"
            onClick={() => {
              onPAISelect?.(selectedPAI);
              setShowSpecificPAI(false);
            }}
          >
            Go to PAI
          </DialogButton>
        </DialogButtons>
      </Dialog>

      {/* Language Apply Confirmation */}
      <Dialog
        title="Apply Language Changes"
        isOpen={showLanguageApplyConfirm}
        onClose={() => setShowLanguageApplyConfirm(false)}
        width="400px"
      >
        <p className="text-gray-700 mb-4">
          Apply the following language changes?<br/>
          Operator: {tempOperatorLanguage}<br/>
          Caller: {tempCallerLanguage}
        </p>
        <DialogButtons>
          <DialogButton onClick={() => setShowLanguageApplyConfirm(false)}>Cancel</DialogButton>
          <DialogButton variant="primary" onClick={handleLanguageApply}>Apply</DialogButton>
        </DialogButtons>
      </Dialog>

      {/* Version Information Dialog */}
      <Dialog
        title="Version Information"
        isOpen={showVersionInfo}
        onClose={() => setShowVersionInfo(false)}
        width="400px"
      >
        <div className="space-y-2 text-gray-700">
          <p><strong>DISPATCHUMS</strong> v1.0.0</p>
          <p>Build: 20241101</p>
          <p>© 2025 DISPATCHUMS. All rights reserved.</p>
        </div>
        <DialogButtons>
          <DialogButton onClick={() => setShowVersionInfo(false)}>Close</DialogButton>
        </DialogButtons>
      </Dialog>

      {/* About Dialog */}
      <Dialog
        title="About DISPATCHUMS"
        isOpen={showAboutDialog}
        onClose={() => setShowAboutDialog(false)}
        width="500px"
      >
        <div className="space-y-4 text-gray-700">
          <p>
            <strong>DISPATCHUMS</strong> is a comprehensive emergency medical dispatch system 
            designed to provide efficient and accurate emergency response coordination.
          </p>
          <p>
            The system includes protocol management, case tracking, and comprehensive 
            reporting capabilities to ensure optimal emergency response.
          </p>
          <p>Version 1.0.0 - 2025</p>
        </div>
        <DialogButtons>
          <DialogButton onClick={() => setShowAboutDialog(false)}>Close</DialogButton>
        </DialogButtons>
      </Dialog>

      {/* Learn More Confirmation */}
      <Dialog
        title="Learn More"
        isOpen={showLearnMoreConfirm}
        onClose={() => setShowLearnMoreConfirm(false)}
        width="400px"
      >
        <p className="text-gray-700 mb-4">
          This will open the help documentation in a new window. Continue?
        </p>
        <DialogButtons>
          <DialogButton onClick={() => setShowLearnMoreConfirm(false)}>Cancel</DialogButton>
          <DialogButton 
            variant="primary"
            onClick={() => {
              // Open help documentation
              setShowLearnMoreConfirm(false);
            }}
          >
            Open Documentation
          </DialogButton>
        </DialogButtons>
      </Dialog>

      {/* Profile Settings Dialog */}
      {showProfileSettings && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[600px]">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              Profile Settings
              <button onClick={() => setShowProfileSettings(false)} className="text-white hover:bg-red-600 px-2">✕</button>
            </div>
            <div className="p-6 bg-white">
              <div className="flex gap-6">
                <div className="flex-shrink-0">
                  <div className="w-32 h-32 bg-gray-300 rounded-lg flex items-center justify-center">
                    <span className="text-gray-500 text-4xl">👤</span>
                  </div>
                  <button 
                    onClick={() => setShowUploadConfirm(true)}
                    className="mt-2 w-full px-3 py-1 bg-[#1D9BF0] text-white text-sm rounded hover:bg-[#1a8cd8]"
                  >
                    Upload Picture
                  </button>
                </div>
                
                <div className="flex-1 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-black text-sm mb-1">Full Name</label>
                      {editableField === 'fullName' ? (
                        <input 
                          type="text" 
                          value={tempFullName}
                          onChange={(e) => setTempFullName(e.target.value)}
                          className="w-full px-3 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-[#0066CC]" 
                        />
                      ) : (
                        <div className="flex items-center">
                          <span className="flex-1 px-3 py-2 bg-gray-100 border border-gray-400">{tempFullName}</span>
                          <button 
                            onClick={() => {
                              setChangeType('fullName');
                              setShowChangeConfirm(true);
                            }}
                            className="ml-2 p-2 text-[#1D9BF0] hover:bg-gray-100 rounded"
                          >
                            ✏️
                          </button>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-black text-sm mb-1">Username</label>
                      <div className="flex items-center">
                        <span className="flex-1 px-3 py-2 bg-gray-100 border border-gray-400">{tempUsername}</span>
                        <button 
                          onClick={() => {
                            setChangeType('username');
                            setShowChangeConfirm(true);
                          }}
                          className="ml-2 p-2 text-[#1D9BF0] hover:bg-gray-100 rounded"
                        >
                          ✏️
                        </button>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-black text-sm mb-1">Email</label>
                    {editableField === 'email' ? (
                      <input 
                        type="email" 
                        value={tempEmail}
                        onChange={(e) => setTempEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-[#0066CC]" 
                      />
                    ) : (
                      <div className="flex items-center">
                        <span className="flex-1 px-3 py-2 bg-gray-100 border border-gray-400">{tempEmail}</span>
                        <button 
                          onClick={() => {
                            setChangeType('email');
                            setShowChangeConfirm(true);
                          }}
                          className="ml-2 p-2 text-[#1D9BF0] hover:bg-gray-100 rounded"
                        >
                          ✏️
                        </button>
                      </div>
                    )}
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-black text-sm mb-1">Gender</label>
                      {editableField === 'gender' ? (
                        <select 
                          value={tempGender}
                          onChange={(e) => setTempGender(e.target.value)}
                          className="w-full px-3 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-[#0066CC]"
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                          <option value="Prefer not to say">Prefer not to say</option>
                        </select>
                      ) : (
                        <div className="flex items-center">
                          <span className="flex-1 px-3 py-2 bg-gray-100 border border-gray-400">{tempGender}</span>
                          <button 
                            onClick={() => {
                              setChangeType('gender');
                              setShowChangeConfirm(true);
                            }}
                            className="ml-2 p-2 text-[#1D9BF0] hover:bg-gray-100 rounded"
                          >
                            ✏️
                          </button>
                        </div>
                      )}
                    </div>
                    <div>
                      <label className="block text-black text-sm mb-1">Date of Birth</label>
                      {editableField === 'dob' ? (
                        <input 
                          type="date" 
                          value={tempDob}
                          onChange={(e) => setTempDob(e.target.value)}
                          className="w-full px-3 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-[#0066CC]" 
                        />
                      ) : (
                        <div className="flex items-center">
                          <span className="flex-1 px-3 py-2 bg-gray-100 border border-gray-400">{tempDob || 'Not set'}</span>
                          <button 
                            onClick={() => {
                              setChangeType('dob');
                              setShowChangeConfirm(true);
                            }}
                            className="ml-2 p-2 text-[#1D9BF0] hover:bg-gray-100 rounded"
                          >
                            ✏️
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex gap-3 justify-between mt-8">
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-6 py-2 bg-red-600 text-white border border-gray-600 hover:bg-red-700"
                >
                  Delete Account
                </button>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowProfileSettings(false)}
                    className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300"
                  >
                    Close
                  </button>
                  {hasUnsavedChanges && (
                    <button 
                      onClick={() => {
                        setHasUnsavedChanges(false);
                        setEditableField(null);
                      }}
                      className="px-6 py-2 bg-[#1D9BF0] text-white border border-gray-600 hover:bg-[#1a8cd8]"
                    >
                      Save Changes
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Password Dialog */}
      {showChangePassword && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[450px]">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              Change Password
              <button onClick={() => setShowChangePassword(false)} className="text-white hover:bg-red-600 px-2">✕</button>
            </div>
            <div className="p-6 bg-white">
              <div className="space-y-4">
                <div>
                  <label className="block text-black text-sm mb-1">Current Password</label>
                  <input type="password" className="w-full px-3 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-[#0066CC]" />
                </div>
                <div>
                  <label className="block text-black text-sm mb-1">New Password</label>
                  <input type="password" className="w-full px-3 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-[#0066CC]" />
                </div>
                <div>
                  <label className="block text-black text-sm mb-1">Confirm New Password</label>
                  <input type="password" className="w-full px-3 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-[#0066CC]" />
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button 
                  onClick={() => setShowChangePassword(false)}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowChangePassword(false);
                    setShowChangeConfirm(true);
                  }}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300"
                >
                  Change Password
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Username Dialog */}
      {showChangeUsername && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[450px]">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              Change Username
              <button onClick={() => setShowChangeUsername(false)} className="text-white hover:bg-red-600 px-2">✕</button>
            </div>
            <div className="p-6 bg-white">
              <div className="space-y-4">
                <div>
                  <label className="block text-black text-sm mb-1">Current Username</label>
                  <input type="text" defaultValue="SUPERVISOR" className="w-full px-3 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-[#0066CC]" readOnly />
                </div>
                <div>
                  <label className="block text-black text-sm mb-1">New Username</label>
                  <input type="text" className="w-full px-3 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-[#0066CC]" />
                </div>
                <div className="bg-yellow-100 border border-yellow-400 p-3 rounded">
                  <p className="text-yellow-800 text-sm">
                    <strong>Warning:</strong> Username can only be changed once a year. This change is irreversible.
                  </p>
                </div>
              </div>
              <div className="flex gap-3 justify-end mt-6">
                <button 
                  onClick={() => setShowChangeUsername(false)}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    setShowChangeUsername(false);
                    setShowChangeConfirm(true);
                  }}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300"
                >
                  Change Username
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Change Confirmation Dialog */}
      {showChangeConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[500px]">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              <span>Confirm Changes</span>
              <button onClick={() => setShowChangeConfirm(false)} className="text-white hover:bg-red-600 px-2">✕</button>
            </div>
            <div className="p-6 bg-white">
              <p className="text-gray-700 mb-6">
                Are you sure you want to update the following information?<br/><br/>
                {changeType === 'fullName' && <><strong>Full Name:</strong> {tempFullName}<br/></>}
                {changeType === 'username' && <><strong>Username:</strong> {tempUsername}<br/></>}
                {changeType === 'email' && <><strong>Email:</strong> {tempEmail}<br/></>}
                {changeType === 'gender' && <><strong>Gender:</strong> {tempGender}<br/></>}
                {changeType === 'dob' && <><strong>Date of Birth:</strong> {tempDob}<br/></>}
              </p>
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setShowChangeConfirm(false)}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-red-600 text-xl">✗</span> Cancel
                </button>
                <button 
                  onClick={() => {
                    setEditableField(changeType);
                    setHasUnsavedChanges(true);
                    setShowChangeConfirm(false);
                  }}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-green-600 text-xl">✓</span> OK
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-lg p-8 shadow-2xl border-2 border-red-500 pointer-events-auto">
            <h3 className="text-xl font-semibold text-black mb-4">Delete Account</h3>
            <p className="text-gray-700 mb-4">
              Are you sure you want to delete your account? This action is <strong>irreversible</strong> and will permanently remove all your data.
            </p>
            <div className="bg-red-100 border border-red-400 p-3 rounded mb-6">
              <p className="text-red-800 text-sm">
                <strong>Warning:</strong> This action cannot be undone. All your profile information, case history, and account data will be permanently deleted.
              </p>
            </div>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setShowProfileSettings(false);
                  onDeleteAccount?.();
                }}
                className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upload Picture Confirmation Dialog */}
      {showUploadConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-lg p-8 shadow-2xl border-2 border-[#1D9BF0] pointer-events-auto">
            <h3 className="text-xl font-semibold text-black mb-4">Upload Profile Picture</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to upload this picture as your profile picture? This will replace your current profile picture.
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowUploadConfirm(false)}
                className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowUploadConfirm(false);
                  // Add actual upload logic here
                }}
                className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
              >
                Upload Picture
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default SharedNavigation;