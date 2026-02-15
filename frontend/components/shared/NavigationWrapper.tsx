'use client';

import { NavigationProvider } from './NavigationContext';

interface NavigationWrapperProps {
  children: React.ReactNode;
}

export function NavigationWrapper({ children }: NavigationWrapperProps) {
  return (
    <NavigationProvider>
      {children}
    </NavigationProvider>
  );
}