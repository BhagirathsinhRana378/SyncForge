import React from 'react';
import { User } from '../types';
import { Avatar } from './Avatar';
import { LogOut } from 'lucide-react';
import { useRouter } from 'next/router';

interface NavbarProps {
  currentUser: User | null;
}

// Navbar Component
// Redesigned: Eliminated the bright green square logo. Uses bold typography.
// Background pure white with a thin gray bottom border.
export const Navbar: React.FC<NavbarProps> = ({ currentUser }) => {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('syncforge_user');
    router.push('/');
  };

  return (
    <nav className="h-14 bg-white border-b border-gray-200 flex items-center justify-between px-6 z-10 flex-shrink-0">
      <div className="flex items-center space-x-2">
        <h1 className="text-lg font-bold text-gray-900 tracking-tight">SyncForge</h1>
      </div>

      {currentUser && (
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 py-1 px-2">
            <span className="text-sm font-medium text-gray-700 hidden sm:block">
              {currentUser.name}
            </span>
            {/* We no longer pass isActive true generically to avoid green glows */}
            <Avatar src={currentUser.avatar} alt={currentUser.name} size="sm" />
          </div>
          
          <button 
            onClick={handleLogout}
            className="p-1.5 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
            title="Sign Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      )}
    </nav>
  );
};
