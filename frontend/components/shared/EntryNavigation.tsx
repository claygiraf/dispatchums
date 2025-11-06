'use client';

import React, { Fragment, useState } from 'react';
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

interface EntryNavigationProps {
  username?: string;
  fullName?: string;
  caseNumber?: string;
  onLogout?: () => void;
  onCloseCase?: () => void;
  onChangeCaseNumber?: () => void;
  onPrintCase?: () => void;
  onAbout?: () => void;
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
}

const EntryNavigation: React.FC<EntryNavigationProps> = ({
  username = 'SUPERVISOR',
  fullName = 'John Supervisor',
  caseNumber = '',
  onLogout = () => {},
  onCloseCase = () => {},
  onChangeCaseNumber = () => {},
  onPrintCase = () => {},
  onAbout,
  children
}) => {
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

  // Dialog states
  const [dialogs, setDialogs] = useState<DialogState>({
    showSearchIncident: false,
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
    showAboutDialog: false
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
      {/* NO TOP NAVIGATION BAR - ENTRY VERSION */}
      
      {/* Menu Bar - Positioned at top */}
      <div className="fixed top-0 left-0 right-0 z-40 bg-[#C0C0C0]">
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
                  <button onClick={onChangeCaseNumber} className="w-full text-left px-4 py-2 hover:bg-[#0066CC] hover:text-white text-black">
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

            {/* Other menu items... (Spec Log, Options, Tabs, Help) */}
            <div className="relative">
              <button 
                className="py-1 hover:underline"
                onClick={() => toggleMenu('showSpecLogMenu')}
              >
                Spec Log
              </button>
            </div>
            <div className="relative">
              <button 
                className="py-1 hover:underline"
                onClick={() => toggleMenu('showOptionsMenu')}
              >
                Options
              </button>
            </div>
            <div className="relative">
              <button 
                className="py-1 hover:underline"
                onClick={() => toggleMenu('showTabsMenu')}
              >
                Tabs
              </button>
            </div>
            <div className="relative">
              <button 
                className="py-1 hover:underline"
                onClick={() => toggleMenu('showHelpMenu')}
              >
                Help
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="pt-8 min-h-screen flex flex-col">
        {/* Tab Navigation */}
        <div className="bg-[#C0C0C0]">
          <div className="max-w-7xl mx-auto">
            <div className="flex w-full">
              {['Entry', 'KQ', 'PDI/CEI', 'DLS', 'Summary'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => updateActiveTab(tab)}
                  className={`flex-1 py-2 ${
                    tab === settings.activeTab 
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

        {/* Bottom Status Bar */}
        <div className="bg-[#27272A] border-t border-[#27272A] flex mt-auto">
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
          <div className="w-1/4 border-r border-gray-600 p-3">
            <div className="space-y-1 w-full">
              <div className="text-white">
                <div className="text-base text-gray-400">O: {settings.selectedOperatorLanguage}</div>
                <div className="text-base text-gray-400">C: {settings.selectedCallerLanguage}</div>
              </div>
            </div>
          </div>
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
    </div>
  );
};

export default EntryNavigation;