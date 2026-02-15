'use client';

import React, { Fragment, useState, useEffect } from 'react';
import { useNavigation } from './NavigationContext';

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

interface ProfileData {
  firstName: string;
  lastName: string;
  username: string;
  email: string;
  password: string;
  role: string;
  accountCreated: string;
}

interface EntryNavigationProps {
  username?: string;
  fullName?: string;
  caseNumber?: string;
  caseId?: number;
  timer?: string;
  progress?: number;
  formData?: any;
  onLogout?: () => void;
  onCloseCase?: () => void;
  onChangeCaseNumber?: () => void;
  onPrintCase?: () => void;
  onAbout?: () => void;
  onHoldCase?: () => Promise<number | null>;
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
}

interface DialogState {
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
  showInvalidCaseNumber: boolean;
  showExitConfirm: boolean;
  showLogoutConfirm: boolean;
  showHoldCaseDialog: boolean;
}

const EntryNavigation: React.FC<EntryNavigationProps> = ({
  username = 'SUPERVISOR',
  fullName = 'John Supervisor',
  caseNumber = '',
  caseId,
  timer = '00:00',
  progress = 0,
  formData,
  onLogout = () => {},
  onCloseCase = () => {},
  onChangeCaseNumber = () => {},
  onPrintCase = () => {},
  onAbout,
  onHoldCase,
  children
}) => {
  // Timer states
  const [elapsed, setElapsed] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerProgress, setTimerProgress] = useState(0);

  // Profile data states
  const [profileName, setProfileName] = useState('');
  const [profileId, setProfileId] = useState('');
  const [profileUnit, setProfileUnit] = useState('');

  // Start timer and load profile on mount
  useEffect(() => {
    setIsTimerRunning(true);
    
    // Load profile data from localStorage
    try {
      const profileData = localStorage.getItem('user_data');
      if (profileData) {
        const data = JSON.parse(profileData);
        setProfileName(data.dispatcher_name || username);
        setProfileId(data.dispatcher_id || '');
        setProfileUnit(data.dispatcher_unit || '');
      } else {
        setProfileName(username);
      }
    } catch (e) {
      console.error('Error loading profile data:', e);
      setProfileName(username);
    }
  }, []);

  // Timer effect
  useEffect(() => {
    if (!isTimerRunning) return;

    const timer = setInterval(() => {
      setElapsed(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimerRunning]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Use shared navigation state
  const { 
    settings, 
    updateLanguages, 
    updateHints, 
    updateSortComplaints, 
    updateActiveTab, 
    updateActiveSubTab 
  } = useNavigation();

  // Menu states
  const [menus, setMenus] = useState<MenuState>({
    showFileMenu: false,
    showViewMenu: false,
    showSpecLogMenu: false,
    showOptionsMenu: false,
    showLanguageMenu: false,
    showTabsMenu: false,
    showHelpMenu: false
  });

  // Additional states for dialogs
  const [selectedPickupCase, setSelectedPickupCase] = useState<number | null>(null);
  const [expandedPAI, setExpandedPAI] = useState<Record<string, boolean>>({});
  const [selectedPAI, setSelectedPAI] = useState<string[]>([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const generateCaseNumber = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    // In real app, this should be fetched from database
    const currentCaseCount = 1; // This would be fetched from database
    const caseCount = String(currentCaseCount).padStart(3, '0');
    return `${year}${month}${caseCount}`;
  };

  // Dialog states
  const [dialogs, setDialogs] = useState<DialogState>({
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
    showLearnMoreConfirm: false,
    showInvalidCaseNumber: false,
    showExitConfirm: false,
    showLogoutConfirm: false,
    showHoldCaseDialog: false
  });

  // Language States (using shared state)
  const [tempOperatorLanguage, setTempOperatorLanguage] = useState(settings.selectedOperatorLanguage);
  const [tempCallerLanguage, setTempCallerLanguage] = useState(settings.selectedCallerLanguage);
  
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
      {/* Menu Bar - Positioned at top */}
      <div className="bg-[#C0C0C0]">
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
                  <button 
                    onClick={() => {
                      toggleMenu('showFileMenu');
                      // Clear case number logic would go here
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black"
                  >
                    <span>New case</span>
                    <span className="text-xs">Ctrl+N</span>
                  </button>
                  <button 
                    onClick={() => {
                      toggleMenu('showFileMenu');
                      toggleDialog('showSearchIncident', true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black"
                  >
                    <span>Open case...</span>
                    <span className="text-xs">Ctrl+O</span>
                  </button>
                  <button 
                    onClick={onCloseCase} 
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
                      toggleMenu('showFileMenu');
                      toggleDialog('showPickupCase', true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black"
                  >
                    <span>Pick-up case...</span>
                    <span className="text-xs">Ctrl+P</span>
                  </button>
                  <div className="border-t border-gray-400 my-1"></div>
                  <button 
                    onClick={() => {
                      toggleMenu('showFileMenu');
                      toggleDialog('showChangeCaseNumber', true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                  >
                    Change case number...
                  </button>
                  <div className="border-t border-gray-400 my-1"></div>
                  <button 
                    onClick={() => {
                      toggleMenu('showFileMenu');
                      toggleDialog('showPrintCase', true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                  >
                    Print case...
                  </button>
                  <div className="border-t border-gray-400 my-1"></div>
                  <button 
                    onClick={() => {
                      toggleMenu('showFileMenu');
                      toggleDialog('showLogoffConfirmation', true);
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
                onClick={() => toggleMenu('showViewMenu')}
              >
                View
              </button>
              
              {menus.showViewMenu && (
                <div className="absolute top-full left-0 mt-0 bg-[#D3D3D3] border border-gray-400 shadow-lg z-50 min-w-[200px]">
                  <button 
                    onClick={() => updateHints(!settings.hintsEnabled)}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex items-center gap-2 text-black"
                  >
                    <span className="w-4">{settings.hintsEnabled ? 'X' : ''}</span>
                    <span>Hints</span>
                  </button>
                  <button 
                    onClick={() => updateSortComplaints(!settings.sortChiefComplaints)}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex items-center gap-2 text-black"
                  >
                    <span className="w-4">{settings.sortChiefComplaints ? 'X' : ''}</span>
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
                    onClick={() => {
                      toggleMenu('showSpecLogMenu');
                      toggleDialog('showLogComments', true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black"
                  >
                    <span>Log comments</span>
                    <span className="text-xs">Ctrl+L</span>
                  </button>
                  <button 
                    onClick={() => {
                      toggleMenu('showSpecLogMenu');
                      toggleDialog('showHazmatInfo', true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black"
                  >
                    <span>HAZMAT Info</span>
                    <span className="text-xs">Shift+Ctrl+H</span>
                  </button>
                  <button 
                    onClick={() => {
                      toggleMenu('showSpecLogMenu');
                      toggleDialog('showUrgentMessage', true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                  >
                    Urgent Message
                  </button>
                  <div className="border-t border-gray-400 my-1"></div>
                  <button 
                    onClick={() => {
                      toggleMenu('showSpecLogMenu');
                      toggleDialog('showCBRN', true);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                  >
                    CBRN
                  </button>
                  <button 
                    onClick={() => {
                      toggleMenu('showSpecLogMenu');
                      toggleDialog('showSARS', true);
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
                onClick={() => toggleMenu('showOptionsMenu')}
              >
                Options
              </button>
              
              {menus.showOptionsMenu && (
                <div className="absolute top-full left-0 mt-0 bg-[#D3D3D3] border border-gray-400 shadow-lg z-50 min-w-[200px]">
                  <button 
                    onClick={() => {
                      toggleMenu('showOptionsMenu');
                      toggleDialog('showLogoffConfirmation', true);
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
                      toggleMenu('showOptionsMenu');
                      toggleDialog('showSpecificPAI', true);
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
      <div className="min-h-screen flex flex-col">
        {/* Timer and Loading Bar */}
        <div className="bg-[#1a1a1a] h-10">
          <div className="flex items-center justify-between h-full px-2">
            <div className="text-white font-mono text-lg">{formatTime(elapsed)}</div>
            <div className="flex-1 flex justify-center px-4">
              <div className="w-1/2 max-w-lg h-3 bg-gray-700 rounded-full overflow-hidden shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-green-500 to-green-600 transition-all duration-500 ease-out shadow-lg"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-gradient-to-b from-gray-100 to-gray-200 group/nav flex shadow-sm">
          {/* Navigation Tabs - Stretch to fill */}
          <div className="flex-1">
            <div className="max-w-full">
              {/* First Line - Main Navigation */}
              <div className="flex w-full gap-1 p-1">
                {['Entry', 'KQ', 'PDI/CEI', 'DLS', 'Summary'].map((tab) => (
                  <button
                    key={tab}
                    onClick={() => updateActiveTab(tab)}
                    className={`relative flex-1 py-2.5 rounded-md transition-all duration-200 group ${
                      tab === settings.activeTab 
                        ? 'bg-blue-300 text-gray-900 font-semibold shadow-md' 
                        : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600 shadow-sm'
                    }`}
                  >
                    {tab}
                    {/* Hover tooltip for abbreviations */}
                    {(tab === 'KQ' || tab === 'PDI/CEI' || tab === 'DLS') && (
                      <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                        <div className="bg-gray-900 text-white text-xs px-3 py-1.5 rounded-lg shadow-lg whitespace-nowrap">
                          {tab === 'KQ' && 'Key Questions'}
                          {tab === 'PDI/CEI' && 'Post-Dispatch Instructions / Caller Entered Instructions'}
                          {tab === 'DLS' && 'Dispatch Life Support'}
                          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
                            <div className="border-4 border-transparent border-t-gray-900"></div>
                          </div>
                        </div>
                      </div>
                    )}
                  </button>
                ))}
              </div>
              
              {/* Second Line - Sub Navigation (hidden by default, shows on hover) */}
              <div className="hidden group-hover/nav:block border-t border-gray-300 px-1 pb-1">
                <div className="flex w-full text-sm gap-1 mt-1">
                  {settings.activeTab === 'Entry' && (
                    <>
                      <button 
                        onClick={() => updateActiveSubTab('Case Entry')}
                        className={`flex-1 py-1.5 rounded transition-all ${
                          settings.activeSubTab === 'Case Entry'
                            ? 'bg-blue-200 text-gray-900 font-medium'
                            : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                      >
                        Case Entry
                      </button>
                      <button 
                        onClick={() => updateActiveSubTab('Additional Info')}
                        className={`flex-1 py-1.5 rounded transition-all ${
                          settings.activeSubTab === 'Additional Info'
                            ? 'bg-blue-200 text-gray-900 font-medium'
                            : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                      >
                        Additional Info
                      </button>
                    </>
                  )}
                  {settings.activeTab === 'KQ' && (
                    <>
                      {[1, 2, 3, 4, 5, 6].map(num => (
                        <button 
                          key={num}
                          onClick={() => updateActiveSubTab(`Q${num}`)}
                          className={`flex-1 py-1.5 rounded transition-all ${
                            settings.activeSubTab === `Q${num}`
                              ? 'bg-blue-200 text-gray-900 font-medium'
                              : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                          }`}
                        >
                          Q{num}
                        </button>
                      ))}
                    </>
                  )}
                  {settings.activeTab === 'PDI/CEI' && (
                    <>
                      <button 
                        onClick={() => updateActiveSubTab('Instructions')}
                        className={`flex-1 py-1.5 rounded transition-all ${
                          settings.activeSubTab === 'Instructions'
                            ? 'bg-blue-200 text-gray-900 font-medium'
                            : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                      >
                        Instructions
                      </button>
                      <button 
                        onClick={() => updateActiveSubTab('Follow-up')}
                        className={`flex-1 py-1.5 rounded transition-all ${
                          settings.activeSubTab === 'Follow-up'
                            ? 'bg-blue-200 text-gray-900 font-medium'
                            : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                      >
                        Follow-up
                      </button>
                    </>
                  )}
                  {settings.activeTab === 'DLS' && (
                    <>
                      <button 
                        onClick={() => updateActiveSubTab('1st Party')}
                        className={`flex-1 py-1.5 rounded transition-all ${
                          settings.activeSubTab === '1st Party'
                            ? 'bg-blue-200 text-gray-900 font-medium'
                            : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                      >
                        1st Party
                      </button>
                      <button 
                        onClick={() => updateActiveSubTab('2nd Party')}
                        className={`flex-1 py-1.5 rounded transition-all ${
                          settings.activeSubTab === '2nd Party'
                            ? 'bg-blue-200 text-gray-900 font-medium'
                            : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                        }`}
                      >
                        2nd Party
                      </button>
                    </>
                  )}
                  {settings.activeTab === 'Summary' && (
                    <button 
                      onClick={() => updateActiveSubTab('Timeline')}
                      className={`flex-1 py-1.5 rounded transition-all ${
                        settings.activeSubTab === 'Timeline'
                          ? 'bg-blue-200 text-gray-900 font-medium'
                          : 'bg-white text-gray-700 hover:bg-blue-50 hover:text-blue-600'
                      }`}
                    >
                      Timeline
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
          
          {/* Hold Case Bell Button - Separate Box */}
          <div className="bg-[#2A2A2A] border-l border-gray-500">
            <button
              onClick={() => toggleDialog('showHoldCaseDialog', true)}
              className="h-full px-4 hover:bg-[#3A3A3A] transition flex items-center justify-center"
              title="Hold Case"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 relative bg-[#D3D3D3]">
          {children}
        </div>

        {/* Bottom Status Bar - Three Column Layout */}
        <div className="bg-[#27272A] border-t border-[#27272A] flex mt-auto">
          {/* Left Column - User Info from Profile */}
          <div className="border-r border-gray-600 p-3">
            <div className="space-y-1">
              <div className="text-white flex items-center gap-3">
                <div className="text-base font-semibold">
                  {profileName || username}
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-base text-gray-400">ID:</span>
                  <div className="border border-gray-600 px-2 py-1 bg-[#1a1a1a]">
                    <div className="text-base text-white">
                      {profileId || 'N/A'}
                    </div>
                  </div>
                  <span className="text-base text-gray-400 ml-2">Unit:</span>
                  <div className="border border-gray-600 px-2 py-1 bg-[#1a1a1a]">
                    <div className="text-base text-white">
                      {profileUnit || 'N/A'}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Middle Column - Case Number */}
          <div className="border-r border-gray-600 p-3">
            <div className="flex items-center h-full">
              <div className="text-white">
                {caseNumber ? (
                  <div className="text-base">Case #{caseNumber}</div>
                ) : (
                  <div className="text-base text-gray-500">No active case</div>
                )}
              </div>
            </div>
          </div>

          {/* Right Column - Case Details Box */}
          <div className="p-3 flex-1">
            <div className="border border-gray-600 px-3 py-2 bg-[#1a1a1a] h-full">
              <div className="text-sm text-white">
                {caseNumber && formData ? (
                  <span className="leading-relaxed">
                    {formData.location && `Location: ${formData.location}`}
                    {formData.phoneNumber && `, Phone: ${formData.phoneNumber}`}
                    {formData.numHurt && `, Patients: ${formData.numHurt}`}
                    {formData.age && `, Age: ${formData.age}`}
                    {formData.conscious && `, Conscious: ${formData.conscious}`}
                    {formData.breathing && `, Breathing: ${formData.breathing}`}
                    {formData.chiefComplaint && `, CC: ${formData.chiefComplaint}`}
                    {formData.gender && `, Gender: ${formData.gender}`}
                  </span>
                ) : (
                  <span className="text-gray-500">No case details</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Search Incident Dialog */}
      {dialogs.showSearchIncident && (
        <Dialog
          title="Search for Incident Number"
          isOpen={dialogs.showSearchIncident}
          onClose={() => toggleDialog('showSearchIncident', false)}
          width="700px"
        >
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
            <DialogButton onClick={() => toggleDialog('showSearchIncident', false)}>
              <span className="text-green-600 text-xl mr-2">✓</span> OK
            </DialogButton>
            <DialogButton onClick={() => toggleDialog('showSearchIncident', false)}>
              <span className="text-red-600 text-xl mr-2">✗</span> Cancel
            </DialogButton>
          </div>
        </Dialog>
      )}

      {/* Invalid Case Number Dialog */}
      {dialogs.showInvalidCaseNumber && (
        <Dialog
          title="Case Number Invalid"
          isOpen={dialogs.showInvalidCaseNumber}
          onClose={() => toggleDialog('showInvalidCaseNumber', false)}
        >
          <p className="text-gray-700 mb-6">
            It must be 9 digits, confirm and continue to create new case with auto assign case number?
          </p>
          <div className="flex gap-4 justify-end">
            <DialogButton 
              onClick={() => toggleDialog('showInvalidCaseNumber', false)}
            >
              Cancel
            </DialogButton>
            <DialogButton
              variant="primary"
              onClick={() => {
                const generatedNumber = generateCaseNumber();
                window.location.href = `/entry?case=${encodeURIComponent(generatedNumber)}`;
              }}
            >
              Confirm & Continue
            </DialogButton>
          </div>
        </Dialog>
      )}

      {/* Close Case Dialog - Abort Reason */}
      {dialogs.showAbortReason && (
        <Dialog
          title="Abort reason..."
          isOpen={dialogs.showAbortReason}
          onClose={() => toggleDialog('showAbortReason', false)}
        >
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
            <DialogButton 
              onClick={() => toggleDialog('showAbortConfirm', true)}
            >
              <span className="text-green-600 text-xl mr-2">✓</span> OK
            </DialogButton>
            <DialogButton 
              onClick={() => toggleDialog('showAbortReason', false)}
            >
              <span className="text-red-600 text-xl mr-2">✗</span> Cancel
            </DialogButton>
          </div>
        </Dialog>
      )}

      {/* Abort Confirmation Dialog */}
      {dialogs.showAbortConfirm && (
        <Dialog
          title="Confirm Abort Case"
          isOpen={dialogs.showAbortConfirm}
          onClose={() => toggleDialog('showAbortConfirm', false)}
        >
          <p className="text-gray-700 mb-6">
            Are you sure you want to abort this case?
          </p>
          <div className="flex gap-4 justify-end">
            <DialogButton 
              onClick={() => toggleDialog('showAbortConfirm', false)}
            >
              Cancel
            </DialogButton>
            <DialogButton
              variant="primary"
              onClick={() => {
                toggleDialog('showAbortConfirm', false);
                toggleDialog('showAbortReason', false);
              }}
            >
              Yes, Abort
            </DialogButton>
          </div>
        </Dialog>
      )}

      {/* Pick-up Case Dialog */}
      {dialogs.showPickupCase && (
        <Dialog
          title="Pick-up case..."
          isOpen={dialogs.showPickupCase}
          onClose={() => {
            toggleDialog('showPickupCase', false);
            setSelectedPickupCase(null);
          }}
          width="700px"
        >
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
            <DialogButton 
              onClick={() => {
                if (selectedPickupCase) {
                  toggleDialog('showPickupConfirm', true);
                }
              }}
              disabled={!selectedPickupCase}
              className={!selectedPickupCase ? 'opacity-50 cursor-not-allowed' : ''}
            >
              <span className="text-green-600 text-xl mr-2">✓</span> OK
            </DialogButton>
            <DialogButton 
              onClick={() => {
                toggleDialog('showPickupCase', false);
                setSelectedPickupCase(null);
              }}
            >
              <span className="text-red-600 text-xl mr-2">✗</span> Cancel
            </DialogButton>
          </div>
        </Dialog>
      )}

      {/* Pick-up Confirmation Dialog */}
      {dialogs.showPickupConfirm && (
        <Dialog
          title="Confirm Pick-up Case"
          isOpen={dialogs.showPickupConfirm}
          onClose={() => toggleDialog('showPickupConfirm', false)}
        >
          <p className="text-gray-700 mb-6">
            Are you sure you want to pick up this case?
          </p>
          <div className="flex gap-4 justify-end">
            <DialogButton 
              onClick={() => toggleDialog('showPickupConfirm', false)}
            >
              Cancel
            </DialogButton>
            <DialogButton
              variant="primary"
              onClick={() => {
                toggleDialog('showPickupConfirm', false);
                toggleDialog('showPickupCase', false);
                setSelectedPickupCase(null);
              }}
            >
              Yes, Pick Up
            </DialogButton>
          </div>
        </Dialog>
      )}

      {/* HAZMAT Info Dialog */}
      {dialogs.showHazmatInfo && (
        <Dialog
          title="Essential HAZMAT Information"
          isOpen={dialogs.showHazmatInfo}
          onClose={() => toggleDialog('showHazmatInfo', false)}
          width="550px"
        >
          <div className="max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between mb-3">
              <DialogButton onClick={() => toggleDialog('showHazmatInfo', false)}>
                <span className="text-red-600 text-xl mr-2">✗</span> Cancel
              </DialogButton>
              <DialogButton>
                <span className="text-green-600">Info Completed ✓</span>
              </DialogButton>
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
        </Dialog>
      )}

      {/* CBRN Dialog */}
      {dialogs.showCBRN && (
        <Dialog
          title="CBRN Surveillance"
          isOpen={dialogs.showCBRN}
          onClose={() => toggleDialog('showCBRN', false)}
        >
          <div className="bg-[#C0C0C0] p-4">
            <div className="flex justify-between mb-4">
              <DialogButton onClick={() => toggleDialog('showCBRN', false)}>
                <span className="text-red-600 text-xl mr-2">✗</span> Cancel
              </DialogButton>
              <DialogButton>
                <span className="text-green-600">Info Completed ✓</span>
              </DialogButton>
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
        </Dialog>
      )}

      {/* SARS Dialog */}
      {dialogs.showSARS && (
        <Dialog
          title="SARS Symptoms"
          isOpen={dialogs.showSARS}
          onClose={() => toggleDialog('showSARS', false)}
        >
          <div className="bg-[#C0C0C0] p-4">
            <div className="flex justify-between mb-4">
              <DialogButton onClick={() => toggleDialog('showSARS', false)}>
                <span className="text-red-600 text-xl mr-2">✗</span> Cancel
              </DialogButton>
              <DialogButton>
                <span className="text-green-600">Info Completed ✓</span>
              </DialogButton>
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
        </Dialog>
      )}

      {/* Log Comments Dialog */}
      {dialogs.showLogComments && (
        <Dialog
          title="Comment"
          isOpen={dialogs.showLogComments}
          onClose={() => toggleDialog('showLogComments', false)}
        >
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
            <DialogButton onClick={() => toggleDialog('showLogComments', false)}>
              <span className="text-red-600 text-xl mr-2">✗</span> Cancel
            </DialogButton>
            <DialogButton onClick={() => toggleDialog('showLogComments', false)}>
              <span className="text-green-600 text-xl mr-2">✓</span> OK
            </DialogButton>
          </div>
        </Dialog>
      )}

      {/* Urgent Message Dialog */}
      {dialogs.showUrgentMessage && (
        <Dialog
          title="Urgent Message"
          isOpen={dialogs.showUrgentMessage}
          onClose={() => toggleDialog('showUrgentMessage', false)}
        >
          <label className="block text-black text-sm mb-2">Message:</label>
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
            <DialogButton onClick={() => toggleDialog('showUrgentMessage', false)}>
              Cancel
            </DialogButton>
            <DialogButton variant="primary" onClick={() => toggleDialog('showUrgentMessage', false)}>
              OK
            </DialogButton>
          </div>
        </Dialog>
      )}

      {/* Version Info Dialog */}
      {dialogs.showVersionInfo && (
        <Dialog
          title="DISPATCHUMS Version Information"
          isOpen={dialogs.showVersionInfo}
          onClose={() => toggleDialog('showVersionInfo', false)}
          width="600px"
        >
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
            <DialogButton onClick={() => toggleDialog('showVersionInfo', false)}>
              <span className="text-green-600 text-xl mr-2">✓</span> OK
            </DialogButton>
          </div>
        </Dialog>
      )}

      {/* About DISPATCHUMS Dialog */}
      {dialogs.showAboutDialog && (
        <Dialog
          title="About DISPATCHUMS"
          isOpen={dialogs.showAboutDialog}
          onClose={() => toggleDialog('showAboutDialog', false)}
          width="550px"
        >
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
            <DialogButton 
              variant="primary"
              onClick={() => toggleDialog('showLearnMoreConfirm', true)}
            >
              Learn More
            </DialogButton>
            <DialogButton onClick={() => toggleDialog('showAboutDialog', false)}>
              <span className="text-green-600 text-xl mr-2">✓</span> OK
            </DialogButton>
          </div>
        </Dialog>
      )}

      {/* Change Case Number Dialog */}
      {dialogs.showChangeCaseNumber && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[450px]">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              <span>Change case number...</span>
              <button onClick={() => toggleDialog('showChangeCaseNumber', false)} className="text-white hover:bg-red-600 px-2">✕</button>
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
                  onClick={() => {
                    toggleDialog('showChangeCaseNumber', false);
                    onChangeCaseNumber();
                  }}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  <span className="text-green-600 text-xl">✓</span> OK
                </button>
                <button 
                  onClick={() => toggleDialog('showChangeCaseNumber', false)}
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
      {dialogs.showPrintCase && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-[#D3D3D3] shadow-2xl border border-gray-500 pointer-events-auto w-[400px]">
            <div className="bg-[#0066CC] text-white px-3 py-2 font-semibold flex justify-between items-center">
              <span>Print Case Summary</span>
              <button onClick={() => toggleDialog('showPrintCase', false)} className="text-white hover:bg-red-600 px-2">✕</button>
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
                  onClick={() => {
                    toggleDialog('showPrintCase', false);
                    onPrintCase();
                  }}
                  className="px-6 py-2 bg-[#C0C0C0] border border-gray-600 hover:bg-gray-300 flex items-center gap-2"
                >
                  Print
                </button>
                <button 
                  onClick={() => toggleDialog('showPrintCase', false)}
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
      {dialogs.showLogoffConfirmation && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
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
                onClick={() => window.location.href = '/'}
                className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
              >
                Yes, Exit
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Specific PAI Target Tool Dialog */}
      {dialogs.showSpecificPAI && (
        <Dialog
          title="Specific PAI Target Tool"
          isOpen={dialogs.showSpecificPAI}
          onClose={() => toggleDialog('showSpecificPAI', false)}
          width="700px"
        >
          <div className="max-h-[600px] overflow-y-auto">
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
                      { id: 'child-j', text: 'J: Stoma support - Child', hasOptions: true, options: ['1 - Assess pediatric stoma', '2 - Gentle suction', '3 - Humidified oxygen', '4 - Position for comfort', '5 - Monitor breathing'] }
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
              <DialogButton>
                <span className="text-green-600 text-xl mr-2">✓</span> OK
              </DialogButton>
              <DialogButton onClick={() => toggleDialog('showSpecificPAI', false)}>
                <span className="text-red-600 text-xl mr-2">✗</span> Cancel
              </DialogButton>
            </div>
          </div>
        </Dialog>
      )}

      {/* Exit Dialog */}
      {dialogs.showExitConfirm && (
        <Dialog
          title="Exit DISPATCHUMS"
          isOpen={dialogs.showExitConfirm}
          onClose={() => toggleDialog('showExitConfirm', false)}
        >
          <p className="text-gray-700 mb-6">
            Are you sure you want to exit DISPATCHUMS?<br/>
            All unsaved changes will be lost.
          </p>
          <div className="flex gap-4 justify-end">
            <DialogButton onClick={() => toggleDialog('showExitConfirm', false)}>
              Cancel
            </DialogButton>
            <DialogButton
              variant="primary"
              onClick={() => window.location.href = '/'}
            >
              Yes, Exit
            </DialogButton>
          </div>
        </Dialog>
      )}

      {/* Logout Dialog */}
      {dialogs.showLogoutConfirm && (
        <Dialog
          title="Logout Confirmation"
          isOpen={dialogs.showLogoutConfirm}
          onClose={() => toggleDialog('showLogoutConfirm', false)}
        >
          <p className="text-gray-700 mb-6">
            Are you sure you want to logout?<br/>
            All unsaved changes will be lost.
          </p>
          <div className="flex gap-4 justify-end">
            <DialogButton onClick={() => toggleDialog('showLogoutConfirm', false)}>
              Cancel
            </DialogButton>
            <DialogButton
              variant="primary"
              onClick={onLogout}
            >
              Yes, Logout
            </DialogButton>
          </div>
        </Dialog>
      )}

      {/* Learn More Confirmation Dialog */}
      {dialogs.showLearnMoreConfirm && (
        <Dialog
          title="Exit to Landing Page"
          isOpen={dialogs.showLearnMoreConfirm}
          onClose={() => toggleDialog('showLearnMoreConfirm', false)}
        >
          <p className="text-gray-700 mb-6">
            You are about to exit the operator interface and go to the landing page.<br/>
            Are you sure you want to continue?
          </p>
          <div className="flex gap-4 justify-end">
            <DialogButton onClick={() => toggleDialog('showLearnMoreConfirm', false)}>
              Cancel
            </DialogButton>
            <DialogButton
              variant="primary"
              onClick={() => window.location.href = '/'}
            >
              Yes, Exit
            </DialogButton>
          </div>
        </Dialog>
      )}

      {/* Language Confirmation Dialog */}
      {dialogs.showLanguageApplyConfirm && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-white rounded-lg p-8 shadow-2xl border-2 border-[#1D9BF0] pointer-events-auto">
            <h3 className="text-xl font-semibold text-black mb-4">Change Language</h3>
            <p className="text-gray-700 mb-6">
              Are you sure you want to change the language settings? This will sync across all navigation components.
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
                  updateLanguages(tempOperatorLanguage, tempCallerLanguage);
                  toggleDialog('showLanguageApplyConfirm', false);
                }}
                className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
              >
                Yes, Change
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hold Case Dialog - Modern Style */}
      {dialogs.showHoldCaseDialog && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-2xl w-[500px] overflow-hidden">
            <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-6 py-4">
              <h3 className="text-xl font-semibold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                  <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                </svg>
                Hold Case
              </h3>
            </div>
            <div className="p-6">
              <p className="text-gray-700 text-base mb-6">
                Are you sure you want to hold this case? The timer will stop and the case will be saved as incomplete. You can resume it later from the dashboard.
              </p>
              <div className="flex gap-3 justify-end">
                <button
                  onClick={() => toggleDialog('showHoldCaseDialog', false)}
                  className="px-6 py-2.5 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={async () => {
                    try {
                      // First save the case (if onHoldCase callback provided)
                      let savedCaseId = caseId;
                      if (onHoldCase) {
                        const newCaseId = await onHoldCase();
                        if (newCaseId) savedCaseId = newCaseId;
                      }
                      
                      // Then mark it as held
                      if (savedCaseId) {
                        const response = await fetch(`http://127.0.0.1:8001/api/v1/cases/${savedCaseId}/hold`, {
                          method: 'POST',
                        });
                        if (response.ok) {
                          console.log('Case held successfully');
                        }
                      }
                    } catch (error) {
                      console.error('Error holding case:', error);
                    }
                    toggleDialog('showHoldCaseDialog', false);
                    window.location.href = '/dashboard';
                  }}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-orange-600 text-white rounded-lg hover:from-orange-600 hover:to-orange-700 transition font-medium shadow-lg"
                >
                  Hold Case
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EntryNavigation;