import React, { ReactNode } from 'react';
import { User } from '../types';
import { Navbar } from './Navbar';

interface ChatLayoutProps {
  children: ReactNode;
  currentUser: User | null;
}

// ChatLayout Component
// This is the fundamental wrapper for the application once logged in.
// It enforces our strict "no scrolling on the body" rule by making the main
// layout fill exactly 100vh.
export const ChatLayout: React.FC<ChatLayoutProps> = ({ children, currentUser }) => {
  return (
    <div className="flex flex-col h-screen w-full bg-gray-50 overflow-hidden font-sans">
      <Navbar currentUser={currentUser} />
      {/* The main area takes the rest of the height below the nav */}
      <main className="flex-1 flex overflow-hidden">
        {children}
      </main>
    </div>
  );
};
