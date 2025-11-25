'use client';

import Link from 'next/link';

interface DialogProps {
  title: string;
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  width?: string;
  className?: string;
}

// Common dialog component
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

// Dialog buttons container
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

// Reusable button component
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
import { useState, useEffect } from 'react';
import SharedNavigation from '@/components/shared/SharedNavigation';
import { FaPencilAlt } from 'react-icons/fa';

export default function DashboardPage() {
  const [caseNumber, setCaseNumber] = useState('');
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  const generateCaseNumber = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    // In real app, this should be fetched from database
    const currentCaseCount = 1; // This would be fetched from database
    const caseCount = String(currentCaseCount).padStart(3, '0');
    return `${year}${month}${caseCount}`;
  };
  
  // Menu states
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
  const [showInvalidCaseNumber, setShowInvalidCaseNumber] = useState(false);
  const [showVersionInfo, setShowVersionInfo] = useState(false);
  const [showSpecificPAI, setShowSpecificPAI] = useState(false);
  const [showLanguageApplyConfirm, setShowLanguageApplyConfirm] = useState(false);
  const [showAboutDialog, setShowAboutDialog] = useState(false);
  const [showLearnMoreConfirm, setShowLearnMoreConfirm] = useState(false);
  const [selectedOperatorLanguage, setSelectedOperatorLanguage] = useState('ENGLISH');
  const [selectedCallerLanguage, setSelectedCallerLanguage] = useState('ENGLISH');
  const [tempOperatorLanguage, setTempOperatorLanguage] = useState('ENGLISH');
  const [tempCallerLanguage, setTempCallerLanguage] = useState('ENGLISH');
  const [expandedPAI, setExpandedPAI] = useState<Record<string, boolean>>({});
  const [selectedPAI, setSelectedPAI] = useState<string[]>([]);
  const [hintsEnabled, setHintsEnabled] = useState(true);
  const [sortChiefComplaints, setSortChiefComplaints] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showChangeUsername, setShowChangeUsername] = useState(false);
  const [showChangeConfirm, setShowChangeConfirm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showUploadConfirm, setShowUploadConfirm] = useState(false);
  const [changeType, setChangeType] = useState('');
  // Controlled profile fields so updates reflect immediately in the UI
  const [fullName, setFullName] = useState('John Supervisor');
  const [tempFullName, setTempFullName] = useState('John Supervisor');
  const [username, setUsername] = useState('SUPERVISOR');
  const [tempUsername, setTempUsername] = useState('SUPERVISOR');
  const [email, setEmail] = useState('supervisor@dispatchums.com');
  const [tempEmail, setTempEmail] = useState('supervisor@dispatchums.com');
  const [gender, setGender] = useState('Male');
  const [tempGender, setTempGender] = useState('Male');
  const [dob, setDob] = useState('');
  const [tempDob, setTempDob] = useState('');
  const [unit, setUnit] = useState('MECC HUMS');
  const [tempUnit, setTempUnit] = useState('MECC HUMS');
  const [isWaiting, setIsWaiting] = useState(false);
  const [nextIncident, setNextIncident] = useState<number | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [editableField, setEditableField] = useState<string | null>(null);
  
  useEffect(() => {
    // Check for next incident every 30 seconds
    const interval = setInterval(() => {
      // Simulated check for next incident
      const hasNewIncident = Math.random() > 0.7; // 30% chance of new incident
      if (hasNewIncident) {
        setNextIncident(Math.floor(Math.random() * 1000000));
        setIsWaiting(true);
      }
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const handleConfirm = () => {
    const trimmedNumber = caseNumber.trim();
    if (trimmedNumber) {
      if (trimmedNumber.length !== 9 || !/^\d+$/.test(trimmedNumber)) {
        setShowInvalidCaseNumber(true);
      } else {
        setShowConfirmation(true);
      }
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
            
            {/* Profile Icon */}
            <div className="relative">
              <button 
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="p-2 text-white hover:text-[#1D9BF0] transition"
              >
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </button>
              
              {showProfileMenu && (
                <div className="absolute top-full right-0 mt-2 bg-[#D3D3D3] border border-gray-400 shadow-lg z-50 min-w-[200px]">
                  <button 
                    onClick={() => {
                      // Initialize temporary values with current values when opening settings
                      setTempFullName(fullName);
                      setTempUsername(username);
                      setTempEmail(email);
                      setTempGender(gender);
                      setTempDob(dob);
                      setShowProfileMenu(false);
                      setShowProfileSettings(true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                  >
                    Profile Settings
                  </button>
                  <button className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black">
                    Logout
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
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black"
                    >
                      <span>Change case number...</span>
                      <span className="text-xs">Ctrl+G</span>
                    </button>
                    <div className="border-t border-gray-400 my-1"></div>
                    <button 
                      onClick={() => {
                        setShowFileMenu(false);
                        setShowPrintCase(true);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black"
                    >
                      <span>Print case...</span>
                      <span className="text-xs">Ctrl+P</span>
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
                    if (!showLanguageMenu) {
                      // When opening the menu, set temporary values to current values
                      setTempOperatorLanguage(selectedOperatorLanguage);
                      setTempCallerLanguage(selectedCallerLanguage);
                    }
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
          {/* Animated Glowing Background */}
          <div className="absolute inset-0">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#1D9BF0] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse"></div>
            <div className="absolute top-1/3 right-1/4 w-80 h-80 bg-[#10B981] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '1s' }}></div>
            <div className="absolute bottom-1/4 left-1/3 w-72 h-72 bg-[#1D9BF0] rounded-full mix-blend-screen filter blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '2s' }}></div>
          </div>
          
          <div className="text-center space-y-8 relative z-10">
            {/* Waiting Indicator */}
            <div className="fixed top-45 right-5 z-20">
              <div className="flex items-center gap-2 transition-opacity duration-1000 ease-in-out animate-fadeInOut">
                <span className="inline-block w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
                <span className="text-yellow-500">Waiting for next incident</span>
              </div>
            </div>

            {/* Logo */}
              <div className="mb-8">
                <div className="flex items-center justify-between w-full">
                  <div className="flex-1"></div>
                  <div className="text-center flex-1">
                    <h2 className="text-6xl font-bold text-white mb-2 whitespace-nowrap" style={{ fontFamily: 'Arial, sans-serif' }}>
  Welcome <span className="text-2xl font-normal italic">to save lives together.</span>
</h2>
                    <p className="text-white text-lg italic">
                      Medical Priority Dispatch System
                    </p>
                  </div>
                  {/* Right-hand duplicate welcome removed per request */}
                </div>
              </div>

            {/* Case Number Input */}
            <div className="space-y-4">
              <label className="block text-white text-xl">
                Case number:
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

        {/* Three Column Layout - Bottom Section */}
        <div className="bg-[#27272A] border-t border-[#27272A] flex mt-auto">
          {/* Left Column - User Info & Case Number */}
          <div className="w-1/4 border-r border-gray-600 p-3">
            <div className="space-y-2">
              {/* User Name */}
              <div className="text-white">
                <div className="text-base font-semibold">{username}</div>
                <div className="text-base text-gray-400">{fullName}</div>
              </div>
              
              {/* Case Number */}
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

      {/* ALL DIALOGS BELOW */}

      {/* Invalid Case Number Modal */}
{showInvalidCaseNumber && (
  <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
    <div className="bg-white rounded-lg p-8 shadow-2xl border-2 border-[#1D9BF0] pointer-events-auto">
      <h3 className="text-xl font-semibold text-black mb-4">Case Number Invalid</h3>
      
      {/* Note with blinking icon and red text */}
            <div className="flex items-center mb-4">
              <span className="animate-pulse text-red-500 mr-2 text-lg">⚠️</span>
              <p className="text-red-500 font-medium">
                Note: 9 digits case number format (year-month-case number)
              </p>
            </div>
            
            {/* Confirmation question */}
            <p className="text-gray-700 mb-6">
              Confirm & continue to create new case with auto assign case number?
            </p>
            
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowInvalidCaseNumber(false)}
                className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  const generatedNumber = generateCaseNumber();
                  setCaseNumber(generatedNumber);
                  window.location.href = `/entry?case=${encodeURIComponent(generatedNumber)}`;
                }}
                className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
              >
                Confirm & Continue
              </button>
            </div>
          </div>
        </div>
      )}

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
                <DialogButton onClick={() => setShowUrgentMessage(false)}>
                  Cancel
                </DialogButton>
                <DialogButton onClick={() => setShowUrgentMessage(false)} variant="primary">
                  OK
                </DialogButton>
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

      {/* CBRN Dialog */}
      {showCBRN && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[500px]">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              <span>CBRN Surveillance</span>
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
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>a rash</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>diarrhea</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>low back pain</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>has or had a fever (clearly hot to touch)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>weakness</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>double vision</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>difficulty swallowing</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>drooling</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>pinpoint pupils</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>excessive nasal discharge</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>a bloody discharge</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>pox or pustules</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>blistered skin</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>peeling skin</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>vomiting</span>
                </label>
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
              <span>SARS Symptoms</span>
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
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>difficulty breathing or shortness of breath</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>a persistent cough</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>diarrhea</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>a rash</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>contact with a known or suspected SARS-infected patient</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>has or had a fever (clearly hot to touch)</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>travel to or from China</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>travel to or from Hong Kong</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>travel to or from Vietnam</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>travel to or from Toronto</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>travel to or from Singapore</span>
                </label>
                <label className="flex items-center gap-2">
                  <input type="checkbox" className="w-4 h-4" />
                  <span>travel to anywhere else in Asia</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Open Case Dialog - Search for Incident Number */}
      {showSearchIncident && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[700px]">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              <span>Search for Incident Number</span>
              <button onClick={() => setShowSearchIncident(false)} className="text-white hover:bg-red-600 px-2">✕</button>
            </div>
            <div className="p-4 bg-white">
              <div className="bg-[#D3D3D3] border border-gray-400 mb-3">
                <div className="flex">
                  <button className="px-4 py-2 bg-white border-b-2 border-white text-black font-semibold">
                    Incidents
                  </button>
                  <button className="px-4 py-2 bg-[#C0C0C0] text-black">
                    Display criteria
                  </button>
                </div>
              </div>
              
              <div className="border-2 border-gray-400 bg-white">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#C0C0C0]">
                      <th className="border border-gray-400 px-2 py-1 text-black font-semibold">Incident #</th>
                      <th className="border border-gray-400 px-2 py-1 text-black font-semibold">Operator ID</th>
                      <th className="border border-gray-400 px-2 py-1 text-black font-semibold">Date/Time</th>
                      <th className="border border-gray-400 px-2 py-1 text-black font-semibold">Address</th>
                      <th className="border border-gray-400 px-2 py-1 text-black font-semibold">CC#</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { incident: '0002000002', operator: '5555', datetime: '7/11/2002 14:15:20', address: '12 Willard', cc: '10' },
                      { incident: '0002000003', operator: '5555', datetime: '7/11/2002 14:17:50', address: '15 Conco', cc: '28' },
                      { incident: '0002000004', operator: '5555', datetime: '7/11/2002 14:18:53', address: '13 Marion', cc: '13' },
                      { incident: '0002000005', operator: '2222', datetime: '7/12/2002 07:37:53', address: '12 Freddc', cc: '9' },
                      { incident: '0002000014', operator: '7777', datetime: '7/12/2002 08:42:06', address: 'intersectic', cc: '29' }
                    ].map((row, idx) => (
                      <tr key={idx} className="hover:bg-blue-500 hover:text-white cursor-pointer">
                        <td className="border border-gray-400 px-2 py-1 text-black hover:text-white">{row.incident}</td>
                        <td className="border border-gray-400 px-2 py-1 text-black hover:text-white">{row.operator}</td>
                        <td className="border border-gray-400 px-2 py-1 text-black hover:text-white">{row.datetime}</td>
                        <td className="border border-gray-400 px-2 py-1 text-black hover:text-white">{row.address}</td>
                        <td className="border border-gray-400 px-2 py-1 text-black hover:text-white">{row.cc}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="flex gap-3 justify-center mt-4">
                <button 
                  onClick={() => setShowSearchIncident(false)}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-green-600 text-xl">✓</span> OK
                </button>
                <button 
                  onClick={() => setShowSearchIncident(false)}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-red-600 text-xl">✗</span> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Close Case Dialog - Abort reason */}
      {showAbortReason && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[500px]">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              <span>Abort reason...</span>
              <button onClick={() => setShowAbortReason(false)} className="text-white hover:bg-red-600 px-2">✕</button>
            </div>
            <div className="p-6 bg-white">
              <input
                type="text"
                className="w-full px-3 py-2 bg-white text-black border-2 border-gray-400 focus:outline-none focus:border-[#0066CC] mb-3"
                placeholder="Enter description..."
              />
              
              <select className="w-full bg-white border-2 border-gray-400 p-2 text-black mb-3 focus:outline-none focus:border-[#0066CC]" size={6}>
                <option>1. Test call</option>
                <option>2. Bug report</option>
                <option>3. Duplicate Incident</option>
                <option>4. Caller Refused Service</option>
                <option>5. Entered in Error</option>
              </select>
              
              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setShowAbortConfirm(true)}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-green-600 text-xl">✓</span> OK
                </button>
                <button 
                  onClick={() => setShowAbortReason(false)}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-red-600 text-xl">✗</span> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Abort Confirmation Dialog */}
      {showAbortConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] pointer-events-none">
          <div className="bg-white rounded-lg p-8 shadow-2xl border-2 border-[#1D9BF0] pointer-events-auto">
            <h3 className="text-xl font-semibold text-black mb-4">Confirm Abort Case</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to abort this case?
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowAbortConfirm(false)}
                className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowAbortConfirm(false);
                  setShowAbortReason(false);
                }}
                className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
              >
                Yes, Abort
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Pick-up Case Dialog */}
      {showPickupCase && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[700px]">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              <span>Pick-up case...</span>
              <button onClick={() => {
                setShowPickupCase(false);
                setSelectedPickupCase(null);
              }} className="text-white hover:bg-red-600 px-2">✕</button>
            </div>
            <div className="p-4 bg-white">
              <div className="border-2 border-gray-400 bg-white mb-3">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-[#C0C0C0]">
                      <th className="border border-gray-400 px-2 py-1 text-black font-semibold w-8"></th>
                      <th className="border border-gray-400 px-2 py-1 text-black font-semibold">Operator ID</th>
                      <th className="border border-gray-400 px-2 py-1 text-black font-semibold">Code</th>
                      <th className="border border-gray-400 px-2 py-1 text-black font-semibold">Address</th>
                      <th className="border border-gray-400 px-2 py-1 text-black font-semibold">Start Time</th>
                      <th className="border border-gray-400 px-2 py-1 text-black font-semibold">Incident #</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { id: 1, operator: 'SUPERVISOR', code: '68-D-2', address: '163 E. South Temple', time: '14:26', incident: '0004000002' },
                      { id: 2, operator: 'SUPERVISOR', code: '52-C-3P', address: '15 Concord Blvd.', time: '14:27', incident: '0004000003' }
                    ].map((row) => (
                      <tr 
                        key={row.id}
                        onClick={() => setSelectedPickupCase(row.id)}
                        className={`cursor-pointer ${selectedPickupCase === row.id ? 'bg-blue-600 text-white' : 'hover:bg-blue-100'}`}
                      >
                        <td className="border border-gray-400 px-2 py-1 text-center">
                          <input 
                            type="radio" 
                            checked={selectedPickupCase === row.id}
                            onChange={() => setSelectedPickupCase(row.id)}
                            className="w-3 h-3"
                          />
                        </td>
                        <td className={`border border-gray-400 px-2 py-1 ${selectedPickupCase === row.id ? 'text-white' : 'text-black'}`}>{row.operator}</td>
                        <td className={`border border-gray-400 px-2 py-1 ${selectedPickupCase === row.id ? 'text-white' : 'text-black'}`}>{row.code}</td>
                        <td className={`border border-gray-400 px-2 py-1 ${selectedPickupCase === row.id ? 'text-white' : 'text-black'}`}>{row.address}</td>
                        <td className={`border border-gray-400 px-2 py-1 ${selectedPickupCase === row.id ? 'text-white' : 'text-black'}`}>{row.time}</td>
                        <td className={`border border-gray-400 px-2 py-1 ${selectedPickupCase === row.id ? 'text-white' : 'text-black'}`}>{row.incident}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <div className="text-center text-black text-sm mb-4">
                Pick-up case: 1 (of 2)
              </div>
              
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => {
                    if (selectedPickupCase) {
                      setShowPickupConfirm(true);
                    }
                  }}
                  disabled={!selectedPickupCase}
                  className={`px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2 ${!selectedPickupCase ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="text-green-600 text-xl">✓</span> OK
                </button>
                <button 
                  onClick={() => {
                    setShowPickupCase(false);
                    setSelectedPickupCase(null);
                  }}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-red-600 text-xl">✗</span> Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Pick-up Confirmation Dialog */}
      {showPickupConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-[60] pointer-events-none">
          <div className="bg-white rounded-lg p-8 shadow-2xl border-2 border-[#1D9BF0] pointer-events-auto">
            <h3 className="text-xl font-semibold text-black mb-4">Confirm Pick-up Case</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to pick up this case?
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => setShowPickupConfirm(false)}
                className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowPickupConfirm(false);
                  setShowPickupCase(false);
                  setSelectedPickupCase(null);
                }}
                className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
              >
                Yes, Pick Up
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Change Case Number Dialog */}
      {showChangeCaseNumber && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[450px]">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              <span>Change case number...</span>
              <button onClick={() => setShowChangeCaseNumber(false)} className="text-white hover:bg-red-600 px-2">✕</button>
            </div>
            <div className="p-6 bg-[#C0C0C0]">
              <div className="flex items-center gap-3 mb-4">
                <label className="text-black text-sm whitespace-nowrap">Case number:</label>
                <input
                  type="text"
                  defaultValue={caseNumber || ''}
                  className="flex-1 px-3 py-2 bg-white text-black border-2 border-gray-400 focus:outline-none focus:border-[#0066CC]"
                />
              </div>
              
              <div className="flex gap-3 justify-center">
                <button 
                  onClick={() => setShowChangeCaseNumber(false)}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-green-600 text-xl">✓</span> OK
                </button>
                <button 
                  onClick={() => setShowChangeCaseNumber(false)}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-red-600 text-xl">✗</span> Cancel
                </button>
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
                  Print
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

      {/* Specific PAI Target Tool Dialog */}
      {showSpecificPAI && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[700px] max-h-[600px] overflow-y-auto">
            <div className="bg-[#0066CC] text-white px-3 py-1 font-semibold flex justify-between items-center">
              <span>Specific PAI Target Tool</span>
              <button onClick={() => setShowSpecificPAI(false)} className="text-white">✕</button>
            </div>
            <div className="p-4">
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

              <div className="grid grid-cols-3 gap-2 mb-4">
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
                          {item.hasOptions && expandedPAI[item.id] && item.options && (
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
                          {item.hasOptions && expandedPAI[item.id] && item.options && (
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
                          {item.hasOptions && expandedPAI[item.id] && item.options && (
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

              <div className="mb-4">
                <div className="bg-[#C0C0C0] text-black px-2 py-1 font-semibold mb-2">Program text:</div>
                <div className="bg-white border border-gray-400 p-2 text-xs text-black space-y-1">
                  <div>Version: 0.0.1</div>
                  <div>English - 4/20/2025</div>
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

      {/* Language Apply Confirmation Dialog */}
      {showLanguageApplyConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-lg p-8 shadow-2xl border-2 border-[#1D9BF0] pointer-events-auto">
            <h3 className="text-xl font-semibold text-black mb-4">Apply Language Settings</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to apply these language settings?<br/>
              <strong>Operator text:</strong> {tempOperatorLanguage}<br/>
              <strong>Caller text:</strong> {tempCallerLanguage}
            </p>
            <div className="flex gap-4 justify-end">
              <button
                onClick={() => {
                  setShowLanguageApplyConfirm(false);
                  // Reset temp values to current values
                  setTempOperatorLanguage(selectedOperatorLanguage);
                  setTempCallerLanguage(selectedCallerLanguage);
                }}
                className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  // Apply temp values to actual state
                  setSelectedOperatorLanguage(tempOperatorLanguage);
                  setSelectedCallerLanguage(tempCallerLanguage);
                  setShowLanguageApplyConfirm(false);
                }}
                className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Profile Settings Dialog */}
      {showProfileSettings && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[700px] max-h-[90vh] overflow-y-auto">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              <span>Profile Settings</span>
              <button onClick={() => setShowProfileSettings(false)} className="text-white hover:bg-red-600 px-2">✕</button>
            </div>
            <div className="p-6 bg-white">
              {/* Profile Picture Upload */}
              <div className="mb-6">
                <label className="block text-black text-sm mb-2">Profile Picture</label>
                <div className="flex items-center gap-4">
                  <div className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center">
                    <svg className="w-8 h-8 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <input type="file" accept="image/*" className="hidden" id="profile-upload" onChange={() => setShowUploadConfirm(true)} />
                    <label htmlFor="profile-upload" className="px-4 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] cursor-pointer font-medium">
                      Upload Picture
                    </label>
                    <p className="text-xs text-gray-600 mt-1">Click to upload from device</p>
                  </div>
                </div>
                <div className="text-sm text-gray-600 mt-2">
                  Account created on: 2025.10.2
                </div>
              </div>

              {/* User Information Form */}
              <div className="space-y-4">
                  <div>
                    <label className="block text-black text-sm mb-1">Full Name</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={tempFullName}
                        onChange={(e) => setTempFullName(e.target.value)}
                        disabled={editableField !== 'fullName'}
                        className="w-full px-3 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-[#0066CC] disabled:bg-gray-100"
                      />
                      <button 
                        onClick={() => {
                          setChangeType('fullName');
                          setShowChangeConfirm(true);
                        }}
                        className="text-gray-500 hover:text-[#0066CC] transition"
                      >
                        <FaPencilAlt className="w-4 h-4" />
                      </button>
                    </div>
                  </div>                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-black text-sm mb-1">Email</label>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="email" 
                        value={tempEmail}
                        onChange={(e) => setTempEmail(e.target.value)}
                        className="w-full px-3 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-[#0066CC]" 
                      />
                      <button 
                        onClick={() => setShowChangeConfirm(true)}
                        className="text-gray-500 hover:text-[#0066CC] transition"
                      >
                        <FaPencilAlt className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-black text-sm mb-1">Username</label>
                    <div className="flex gap-2 items-center">
                      <input
                        type="text"
                        value={tempUsername}
                        onChange={(e) => setTempUsername(e.target.value)}
                        className="w-full px-3 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-[#0066CC]"
                      />
                      <button 
                        onClick={() => setShowChangeUsername(true)}
                        className="text-gray-500 hover:text-[#0066CC] transition"
                      >
                        <FaPencilAlt className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs text-yellow-600 mt-1 flex items-center gap-1">
                      <span>⚠️</span>
                      <span>Username can be reset only once a year</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-black text-sm mb-1">Password</label>
                    <div className="flex gap-2 items-center">
                      <input type="password" placeholder="••••••••" className="w-full px-3 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-[#0066CC]" />
                      <button 
                        onClick={() => setShowChangePassword(true)}
                        className="text-gray-500 hover:text-[#0066CC] transition"
                      >
                        <FaPencilAlt className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-black text-sm mb-1">ID</label>
                    <input type="text" defaultValue="PED001" className="w-full px-3 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-[#0066CC]" readOnly />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="block text-black text-sm mb-1">Gender</label>
                    <div className="flex gap-2 items-center">
                      <select 
                        value={tempGender}
                        onChange={(e) => setTempGender(e.target.value)}
                        className="w-full px-3 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-[#0066CC]"
                      >
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                      </select>
                      <button 
                        onClick={() => {
                          setChangeType('gender');
                          setShowChangeConfirm(true);
                        }}
                        className="text-gray-500 hover:text-[#0066CC] transition"
                      >
                        <FaPencilAlt className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="block text-black text-sm mb-1">Date of Birth</label>
                    <div className="flex gap-2 items-center">
                      <input 
                        type="date" 
                        value={tempDob}
                        onChange={(e) => setTempDob(e.target.value)}
                        className="w-full px-3 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-[#0066CC]" 
                      />
                      <button 
                        onClick={() => {
                          setChangeType('date of birth');
                          setShowChangeConfirm(true);
                        }}
                        className="text-gray-500 hover:text-[#0066CC] transition"
                      >
                        <FaPencilAlt className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-black text-sm mb-1">Unit</label>
                    <div className="flex gap-2 items-center">
                      <select 
                        value={tempUnit}
                        onChange={(e) => setTempUnit(e.target.value)}
                        className="w-full px-3 py-2 bg-white text-black border border-gray-400 focus:outline-none focus:border-[#0066CC]"
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
                      <button 
                        onClick={() => {
                          setChangeType('unit');
                          setShowChangeConfirm(true);
                        }}
                        className="text-gray-500 hover:text-[#0066CC] transition"
                      >
                        <FaPencilAlt className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-black text-sm mb-1">Role</label>
                  <div>
                    <select className="w-full px-3 py-2 bg-gray-100 text-black border border-gray-400 focus:outline-none" disabled>
                      <option value="dispatcher">Dispatcher</option>
                      <option value="medical_responder">Medical Responder</option>
                      <option value="administrator">Administrator</option>
                    </select>
                    <p className="text-xs text-gray-600 mt-1">Role cannot be changed</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 justify-between mt-8">
                <button 
                  onClick={() => setShowDeleteConfirm(true)}
                  className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 font-medium"
                >
                  Delete Account
                </button>
                <div className="flex gap-4">
                  <button 
                    onClick={() => {
                      // Reset temporary values to original values when canceling
                      setTempFullName(fullName);
                      setTempUsername(username);
                      setTempEmail(email);
                      setTempGender(gender);
                      setTempDob(dob);
                      setShowProfileSettings(false);
                    }}
                    className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 font-medium w-[120px] justify-center"
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={() => {
                      // Update all actual values from temporary values
                      setFullName(tempFullName);
                      setUsername(tempUsername);
                      setEmail(tempEmail);
                      setGender(tempGender);
                      setDob(tempDob);
                      setShowProfileSettings(false);
                    }}
                    className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 font-medium w-[120px] justify-center"
                  >
                    Save Changes
                  </button>
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
              <span>Change Password</span>
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
                    // Enable editing after confirmation
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
                  // Add actual delete logic here
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
}