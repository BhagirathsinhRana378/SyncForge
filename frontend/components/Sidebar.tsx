import React, { useState, useRef, useEffect } from 'react';
import { Room } from '../types';
import { Avatar } from './Avatar';
import { Hash, Plus, MessageSquare } from 'lucide-react';
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
// Redesigned: Eliminated the heavy "card" look of the sidebar items. 
// Uses a more Slack/Linear approach. Items are mostly transparent, hover creates a soft gray,
// active turns the background slightly darker gray (#e5e7eb) with no green highlights.
export const Sidebar: React.FC<SidebarProps> = ({ 
  rooms, 
  currentRoomId, 
  onSelectRoom,
  onCreateGroup,
  onCreatePrivate
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  const [isPrivateModalOpen, setIsPrivateModalOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

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
      <aside className="w-64 bg-gray-50/30 border-r border-gray-200 flex flex-col h-full flex-shrink-0">
        
        {/* Header */}
        <div className="px-4 py-3 flex items-center justify-between relative mt-2">
          <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Chats</h2>

          <div ref={dropdownRef} className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="p-1 text-gray-400 hover:text-gray-700 hover:bg-gray-200 rounded-md transition-colors"
              title="Create Chat"
            >
              <Plus size={16} />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-20 animate-in fade-in zoom-in-95 duration-100">
                <button
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  onClick={() => {
                    setIsGroupModalOpen(true);
                    setIsDropdownOpen(false);
                  }}
                >
                  <Hash size={14} className="text-gray-400" />
                  <span>Create Group</span>
                </button>
                <button
                  className="w-full text-left px-3 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center space-x-2"
                  onClick={() => {
                    setIsPrivateModalOpen(true);
                    setIsDropdownOpen(false);
                  }}
                >
                  <MessageSquare size={14} className="text-gray-400" />
                  <span>Start Private Chat</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Room List */}
        <div className="overflow-y-auto flex-1 px-2 pb-4 space-y-0.5">
          {rooms.length === 0 ? (
            <div className="text-center py-6 text-gray-400 text-xs">
              <p>No chats available.</p>
            </div>
          ) : (
            rooms.map((room) => {
              const isActive = room.id === currentRoomId;
              const isGroup = room.type === 'group';
              const partner = !isGroup && room.members.length > 1 ? room.members[1] : null;

              return (
                <button
                  key={room.id}
                  onClick={() => onSelectRoom(room.id)}
                  // Active state: gray-200 (#e5e7eb), Hover state: gray-100 (#f3f4f6)
                  className={`w-full text-left flex items-center space-x-2 px-2 py-1.5 rounded-md transition-colors ${
                    isActive 
                      ? 'bg-gray-200 text-gray-900 font-medium' 
                      : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {isGroup || !partner ? (
                    <Hash size={16} className={`flex-shrink-0 ${isActive ? 'text-gray-700' : 'text-gray-400'}`} />
                  ) : (
                    <div className="flex-shrink-0 opacity-80">
                      <Avatar src={partner.avatar} alt={partner.name} size="sm" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0">
                    <div className={`text-[13px] truncate ${isActive ? 'font-medium' : ''}`}>
                      {room.name}
                    </div>
                  </div>
                </button>
              );
            })
          )}
        </div>
      </aside>

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
