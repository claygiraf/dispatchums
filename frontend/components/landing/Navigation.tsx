'use client';

import { useState } from 'react';

interface NavigationProps {
  // Profile settings
  username?: string;
  fullName?: string;
  caseNumber?: string;
  selectedOperatorLanguage?: string;
  selectedCallerLanguage?: string;
  tempOperatorLanguage?: string;
  tempCallerLanguage?: string;
  setTempOperatorLanguage?: (lang: string) => void;
  setTempCallerLanguage?: (lang: string) => void;
  setSelectedOperatorLanguage?: (lang: string) => void;
  setSelectedCallerLanguage?: (lang: string) => void;
  setCaseNumber?: (num: string) => void;
  
  // View settings
  hintsEnabled?: boolean;
  sortChiefComplaints?: boolean;
  setHintsEnabled?: (enabled: boolean) => void;
  setSortChiefComplaints?: (sort: boolean) => void;
  
  // Tab navigation
  activeTab?: string;
  setActiveTab?: (tab: string) => void;
  setActiveSubTab?: (tab: string) => void;
  
  // Optional custom handlers
  onNewCase?: () => void;
  onCallerHangup?: () => void;
  onHoldCase?: () => void;
  onLogComments?: () => void;
}

export default function Navigation({
  username = 'SUPERVISOR',
  fullName = 'John Supervisor',
  caseNumber = '',
  selectedOperatorLanguage = 'ENGLISH',
  selectedCallerLanguage = 'ENGLISH',
  tempOperatorLanguage = 'ENGLISH',
  tempCallerLanguage = 'ENGLISH',
  setTempOperatorLanguage,
  setTempCallerLanguage,
  setSelectedOperatorLanguage,
  setSelectedCallerLanguage,
  setCaseNumber,
  hintsEnabled = true,
  sortChiefComplaints = false,
  setHintsEnabled,
  setSortChiefComplaints,
  activeTab = 'Entry',
  setActiveTab,
  setActiveSubTab,
  onNewCase,
  onCallerHangup,
  onHoldCase,
  onLogComments
}: NavigationProps) {
  // Menu state
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
  const [showProfileSettings, setShowProfileSettings] = useState(false);
  const [expandedPAI, setExpandedPAI] = useState<Record<string, boolean>>({});
  const [selectedPAI, setSelectedPAI] = useState<string[]>([]);

  // Hold case state
  const [isOnHold, setIsOnHold] = useState(false);
  const [holdStartTime, setHoldStartTime] = useState<string | null>(null);
  const [callerHangupTime, setCallerHangupTime] = useState<string | null>(null);
  const [comments, setComments] = useState("");

  // Handlers
  const handleNewCase = () => {
    setShowFileMenu(false);
    if (setCaseNumber) setCaseNumber('');
    if (onNewCase) onNewCase();
  };

  const handleCallerHangup = () => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString();
    setCallerHangupTime(timeStr);
    setShowFileMenu(false);
    if (onCallerHangup) onCallerHangup();
  };

  const handleHoldCase = () => {
    if (isOnHold) {
      setIsOnHold(false);
      setHoldStartTime(null);
    } else {
      setIsOnHold(true);
      const now = new Date();
      setHoldStartTime(now.toLocaleTimeString());
    }
    setShowFileMenu(false);
    if (onHoldCase) onHoldCase();
  };

  const handleLogComments = () => {
    setShowSpecLogMenu(false);
    setShowLogComments(true);
    if (onLogComments) onLogComments();
  };

  const handleTabNavigation = (tab: string) => {
    if (setActiveTab) setActiveTab(tab);
    setShowTabsMenu(false);
  };

  return (
    <>
      {/* Menu Bar */}
      <div className="fixed top-0 left-0 right-0 bg-[#C0C0C0] border-b border-gray-400 relative z-40">
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
                    onClick={handleNewCase}
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
                      if (caseNumber) {
                        setShowFileMenu(false);
                        setShowAbortReason(true);
                      }
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black ${!caseNumber ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <span>Close case</span>
                    <span className="text-xs">Ctrl+F4</span>
                  </button>
                  <button 
                    onClick={handleCallerHangup}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                  >
                    Caller hangup{callerHangupTime && ` (${callerHangupTime})`}
                  </button>
                  <div className="border-t border-gray-400 my-1"></div>
                  <button 
                    onClick={handleHoldCase}
                    className={`w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black ${isOnHold ? 'bg-yellow-200' : ''}`}
                  >
                    <span>Hold case {isOnHold ? `(Started ${holdStartTime})` : ''}</span>
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
                    onClick={() => {
                      if (setHintsEnabled) setHintsEnabled(!hintsEnabled);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex items-center gap-2 text-black"
                  >
                    <span className="w-4">{hintsEnabled ? '✓' : ''}</span>
                    <span>Hints</span>
                  </button>
                  <button 
                    onClick={() => {
                      if (setSortChiefComplaints) setSortChiefComplaints(!sortChiefComplaints);
                    }}
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
                      if (caseNumber) {
                        handleLogComments();
                      }
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black ${!caseNumber ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                        onChange={(e) => {
                          if (setTempOperatorLanguage) setTempOperatorLanguage(e.target.value);
                        }}
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
                        onChange={(e) => {
                          if (setTempCallerLanguage) setTempCallerLanguage(e.target.value);
                        }}
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
                  <button 
                    onClick={() => {
                      handleTabNavigation('Entry');
                      if (setActiveSubTab) setActiveSubTab('Case Entry');
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                  >
                    Case Entry
                  </button>
                  <button 
                    onClick={() => handleTabNavigation('KQ')}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                  >
                    Key Questions
                  </button>
                  <button 
                    onClick={() => handleTabNavigation('PDI/CEI')}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                  >
                    Post Dispatch Instructions
                  </button>
                  <button 
                    onClick={() => handleTabNavigation('DLS')}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                  >
                    Dispatch Life Support
                  </button>
                  <button 
                    onClick={() => handleTabNavigation('Summary')}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black"
                  >
                    Case Summary
                  </button>
                  <div className="border-t border-gray-400 my-1"></div>
                  <button 
                    onClick={() => {
                      const tabs = ['Entry', 'KQ', 'PDI/CEI', 'DLS', 'Summary'];
                      const currentIndex = tabs.indexOf(activeTab);
                      const nextIndex = (currentIndex + 1) % tabs.length;
                      handleTabNavigation(tabs[nextIndex]);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black"
                  >
                    <span>Next tab</span>
                    <span className="text-xs">F6</span>
                  </button>
                  <button 
                    onClick={() => {
                      const tabs = ['Entry', 'KQ', 'PDI/CEI', 'DLS', 'Summary'];
                      const currentIndex = tabs.indexOf(activeTab);
                      const prevIndex = (currentIndex - 1 + tabs.length) % tabs.length;
                      handleTabNavigation(tabs[prevIndex]);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black"
                  >
                    <span>Prior tab</span>
                    <span className="text-xs">Shift+F6</span>
                  </button>
                  <button 
                    onClick={() => {
                      if (setActiveSubTab) setActiveSubTab('Additional Information');
                      setShowTabsMenu(false);
                    }}
                    className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white flex justify-between text-black"
                  >
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

      {/* ALL DIALOGS - Copy all dialog components from dashboard here */}
      {/* I'll include the key dialogs but you should copy all from the dashboard */}
      
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
                onClick={() => setShowLanguageApplyConfirm(false)}
                className="px-6 py-2 bg-gray-300 text-black rounded hover:bg-gray-400 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setShowLanguageApplyConfirm(false);
                  if (setSelectedOperatorLanguage) setSelectedOperatorLanguage(tempOperatorLanguage);
                  if (setSelectedCallerLanguage) setSelectedCallerLanguage(tempCallerLanguage);
                }}
                className="px-6 py-2 bg-[#1D9BF0] text-white rounded hover:bg-[#1a8cd8] transition"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add more dialogs from dashboard as needed */}
      {/* Copy all the remaining dialog components from your dashboard file */}
    </>
  );
}