'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface NavigationSettings {
  selectedOperatorLanguage: string;
  selectedCallerLanguage: string;
  hintsEnabled: boolean;
  sortChiefComplaints: boolean;
  activeTab: string;
  activeSubTab: string;
}

interface NavigationContextType {
  settings: NavigationSettings;
  updateLanguages: (operator: string, caller: string) => void;
  updateHints: (enabled: boolean) => void;
  updateSortComplaints: (sort: boolean) => void;
  updateActiveTab: (tab: string) => void;
  updateActiveSubTab: (subTab: string) => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export function NavigationProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<NavigationSettings>({
    selectedOperatorLanguage: 'ENGLISH',
    selectedCallerLanguage: 'ENGLISH',
    hintsEnabled: true,
    sortChiefComplaints: false,
    activeTab: 'Entry',
    activeSubTab: 'Case Entry'
  });

  const updateLanguages = (operator: string, caller: string) => {
    setSettings(prev => ({
      ...prev,
      selectedOperatorLanguage: operator,
      selectedCallerLanguage: caller
    }));
    
    // Optional: Persist to localStorage or send to server
    localStorage.setItem('navigation-settings', JSON.stringify({
      ...settings,
      selectedOperatorLanguage: operator,
      selectedCallerLanguage: caller
    }));
  };

  const updateHints = (enabled: boolean) => {
    setSettings(prev => ({
      ...prev,
      hintsEnabled: enabled
    }));
  };

  const updateSortComplaints = (sort: boolean) => {
    setSettings(prev => ({
      ...prev,
      sortChiefComplaints: sort
    }));
  };

  const updateActiveTab = (tab: string) => {
    setSettings(prev => ({
      ...prev,
      activeTab: tab
    }));
  };

  const updateActiveSubTab = (subTab: string) => {
    setSettings(prev => ({
      ...prev,
      activeSubTab: subTab
    }));
  };

  return (
    <NavigationContext.Provider value={{
      settings,
      updateLanguages,
      updateHints,
      updateSortComplaints,
      updateActiveTab,
      updateActiveSubTab
    }}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigation() {
  const context = useContext(NavigationContext);
  if (context === undefined) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  return context;
}