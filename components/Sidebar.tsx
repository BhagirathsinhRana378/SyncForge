import React, { useState, useRef, useEffect } from 'react';
import { Room } from '../types';
import { Avatar } from './Avatar';
import { Hash, MessageSquare, Plus, Users } from 'lucide-react';
import { CreateGroupModal } from './CreateGroupModal';
import { CreatePrivateChatModal } from './CreatePrivateChatModal';

interface SidebarProps {
  rooms: Room[];
  currentRoomId: string | null;
  onSelectRoom: (roomId: string) => void;
  onCreateGroup: (name: string, members: string[]) => void;
  onCreatePrivate: (username: string) => void;
}

// Sidebar Component
// Displays a list of available chat rooms (both private and group chats).
// Also provides UI to create new group chats or start private 1v1 conversations.
export const Sidebar: React.FC<SidebarProps> = ({ 
  rooms, 
  currentRoomId, 
  onSelectRoom,
  onCreateGroup,
  onCreatePrivate
}) => {
  // UI State for dropdowns and modals
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isPrivateModalOpen, setIsPrivateModalOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown if user clicks outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <aside className="w-80 bg-white border-r border-gray-200 flex flex-col h-full flex-shrink-0">
        
        {/* Sidebar Header with Add Button */}
        <div className="p-4 border-b border-gray-100 flex items-center justify-between relative">
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-gray-800">Chats</h2>
            <div className="bg-gray-100 text-gray-500 text-xs py-1 px-2 rounded-md font-medium">
              {rooms.length} Active
            </div>
          </div>

          <div ref={dropdownRef} className="relative">
            {/* Minimal Plus Button with Green Accent */}
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-1.5 bg-green-50 text-green-600 hover:bg-green-100 rounded-full transition-colors"
              title="Create Chat"
            >
              <Plus size={20} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-xl shadow-lg py-2 z-20 animate-in fade-in zoom-in-95 duration-100">
                <button
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors"
                  onClick={() => {
                    setIsGroupModalOpen(true);
                    setIsDropdownOpen(false);
                  }}
                >
                  <Users size={16} className="text-gray-400" />
                  <span>Create Group</span>
                </button>
                <button
                  className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-3 transition-colors border-t border-gray-50"
                  onClick={() => {
                    setIsPrivateModalOpen(true);
                    setIsDropdownOpen(false);
                  }}
                >
                  <MessageSquare size={16} className="text-gray-400" />
                  <span>Start Private Chat</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Room List */}
        <div className="overflow-y-auto flex-1 p-3 space-y-1">
          {rooms.length === 0 ? (
            <div className="text-center py-10 text-gray-400 text-sm">
              <p>No chats available.</p>
              <button 
                onClick={() => setIsPrivateModalOpen(true)}
                className="text-green-500 font-medium hover:underline mt-2"
              >
                Start a conversation
              </button>
            </div>
          ) : (
            rooms.map((room) => {
              const isActive = room.id === currentRoomId;
              
              // If it's a private chat, we typically want to show the avatar of the *other* person.
              // Since we mock it and don't strictly have a "partner" extractor easily available without tracking current user ID here,
              // we will default to standard icons for group, and the room's second member avatar for private chats.
              const isGroup = room.type === 'group';
              const partner = !isGroup && room.members.length > 1 ? room.members[1] : null;

              return (
                <button
                  key={room.id}
                  onClick={() => onSelectRoom(room.id)}
                  className={`w-full text-left flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                    isActive 
                      ? 'bg-green-50 shadow-sm border border-green-100' 
                      : 'hover:bg-gray-50 border border-transparent'
                  }`}
                >
                  {isGroup || !partner ? (
                    <div className={`p-2 rounded-lg flex-shrink-0 ${
                      isActive ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-500'
                    }`}>
                      <Hash size={20} />
                    </div>
                  ) : (
                    <Avatar src={partner.avatar} alt={partner.name} size="sm" />
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline mb-0.5">
                      <h3 className={`text-sm font-semibold truncate ${
                        isActive ? 'text-green-800' : 'text-gray-800'
                      }`}>
                        {room.name}
                      </h3>
                    </div>
                    <p className={`text-xs truncate ${
                      isActive ? 'text-green-600' : 'text-gray-400'
                    }`}>
                      {isGroup ? `${room.members.length} members` : 'Direct message'}
                    </p>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

      {/* Render Modals */}
      <CreateGroupModal 
        isOpen={isGroupModalOpen} 
        onClose={() => setIsGroupModalOpen(false)} 
        onCreateGroup={onCreateGroup} 
      />
      
      <CreatePrivateChatModal 
        isOpen={isPrivateModalOpen} 
        onClose={() => setIsPrivateModalOpen(false)} 
        onCreatePrivate={onCreatePrivate} 
      />
    </>
  );
};

