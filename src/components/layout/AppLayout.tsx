import React from 'react';
import { AppHeader } from './AppHeader';
import { ModeSelector } from './ModeSelector';

interface AppLayoutProps {
  children: React.ReactNode;
  sidebar: React.ReactNode;
}

export const AppLayout: React.FC<AppLayoutProps> = ({ children, sidebar }) => {
  return (
    <div className="h-screen flex flex-col bg-surface-900 text-gray-200">
      {/* Top Navigation */}
      <AppHeader />
      
      {/* Mode Selection */}
      <ModeSelector />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col lg:flex-row min-h-0">
        {/* Left Column - Main Content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <div className="max-w-4xl mx-auto w-full space-y-4 pb-6">
            {children}
          </div>
        </main>

        {/* Right Column - Sticky Price Summary */}
        <aside className="w-full lg:w-[400px] lg:min-w-[400px] lg:border-l border-surface-700 bg-surface-900 overflow-y-auto shrink-0">
          <div className="sticky top-0 p-4 lg:p-5 space-y-4">
            {sidebar}
          </div>
        </aside>
      </div>
    </div>
  );
};
