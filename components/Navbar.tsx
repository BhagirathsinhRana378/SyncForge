import React from 'react';
import { User } from '../types';
import { Avatar } from './Avatar';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/router';

interface NavbarProps {
  currentUser: User | null;
}

// Navbar Component
// Sits at the top of the chat interface. 
// Displays the app title and the currently logged in user's profile with a logout utility.
export const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  const router = useRouter();

  const handleLogout = () => {
    // Phase 1: Sign out is just removing the simulated session and reloading/routing
    localStorage.removeItem('syncforge_user');
    router.push('/');
  };

  return (
    <nav className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6 shadow-sm z-10">
      <div className="flex items-center space-x-2">
        {/* App Logo / Title */}
        <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center shadow-sm">
          <span className="text-white font-bold text-lg leading-none">S</span>
        </div>
        <h1 className="text-xl font-bold text-gray-800 tracking-tight">SyncForge<span className="text-green-500">.</span></h1>
      </div>

      {currentUser && (
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-3 bg-gray-50 py-1.5 px-3 rounded-full border border-gray-100">
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {currentUser.name}
            </span>
            <Avatar src={currentUser.avatar} alt={currentUser.name} size="sm" isActive={true} />
          </div>
          
          <button 
            onClick={handleLogout}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
            title="Sign Out"
          >
            <LogOut size={20} />
          </button>
        </div>
      )}
    </nav>
  );
};
