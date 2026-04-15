import React, { useState, useRef, useEffect } from 'react';
import { Room } from '../types';
import { Avatar } from './Avatar';
import { Hash, Plus, MessageSquare } from 'lucide-react';
import { CreateGroupModal } from './CreateGroupModal';
import { CreatePrivateChatModal } from './CreatePrivateChatModal';

interface SidebarProps {
  rooms: Room[];
  currentRoomId: string | null;
  activeChat?: { type: "direct" | "room", id: string } | null;
  onlineUsers?: { username: string; socketId: string, avatar?: string }[];
  unreadCounts?: Record<string, number>;
  onSelectUser?: (user: {username: string; socketId: string, avatar?: string}) => void;
  onSelectRoom: (roomId: string) => void;
  onCreateGroup: (name: string, members: string[]) => void;
}

// Sidebar Component
// Redesigned: Eliminated the heavy "card" look of the sidebar items. 
// Uses a more Slack/Linear approach. Items are mostly transparent, hover creates a soft gray,
// active turns the background slightly darker gray (#e5e7eb) with no green highlights.
export const Sidebar: React.FC<SidebarProps> = ({ 
  rooms, 
  currentRoomId, 
  activeChat,
  onlineUsers = [],
  unreadCounts = {},
  onSelectUser,
  onSelectRoom,
  onCreateGroup
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isGroupModalOpen, setIsGroupModalOpen] = useState(false);
  
  // 🎯 FEATURE 1: Search functionality
  const [search, setSearch] = useState('');

  const filteredUsers = onlineUsers.filter(user => 
    user.username.toLowerCase().includes(search.toLowerCase())
  );

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
              </div>
            )}
          </div>
        </div>

        {/* Room List */}
        <div className="overflow-y-auto flex-1 px-2 pb-4 space-y-0.5">
          {rooms.length === 0 ? (
            <div className="text-center py-4 text-gray-400 text-xs">
              <p>No group chats available.</p>
            </div>
          ) : (
            rooms.map((room) => {
              const isActive = activeChat?.type === 'room' && activeChat.id === room.id;
              const isGroup = room.type === 'group';
              const partner = !isGroup && room.members.length > 1 ? room.members[1] : null;

              return (
                <button
                  key={room.id}
                  onClick={() => onSelectRoom(room.id)}
                  className={`w-full text-left flex items-center space-x-2 px-2 py-2 transition-all ${
                    isActive 
                      ? 'bg-blue-100/50 border-l-4 border-blue-500 text-gray-900 font-medium' 
                      : 'border-l-4 border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  {isGroup || !partner ? (
                    <Hash size={16} className={`flex-shrink-0 ${isActive ? 'text-blue-500' : 'text-gray-400'}`} />
                  ) : (
                    <div className="flex-shrink-0 opacity-80">
                      <Avatar src={partner.avatar} alt={partner.name} size="sm" />
                    </div>
                  )}
                  
                  <div className="flex-1 min-w-0 flex justify-between items-center">
                    <div className={`text-[13px] truncate ${isActive ? 'font-medium text-blue-900' : ''}`}>
                      {room.name}
                    </div>
                    {unreadCounts[room.id] > 0 && !isActive && (
                      <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {unreadCounts[room.id]}
                      </span>
                    )}
                  </div>
                </button>
              );
            })
          )}

          {/* 🎯 FEATURE 1: Online Users Section */}
          <div className="pt-4 pb-1 px-2 mt-4 border-t border-gray-200/50">
            <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Online Users</h2>
            <input 
              type="text" 
              placeholder="Search users..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-md py-1 px-2 text-[13px] text-gray-700 placeholder-gray-400 focus:outline-none focus:border-gray-300 focus:ring-1 focus:ring-gray-300 mb-2"
            />
          </div>
          
          {filteredUsers.length === 0 ? (
            <div className="text-center py-2 text-gray-400 text-xs">
              <p>{onlineUsers.length === 0 ? 'No users online.' : 'No users found.'}</p>
            </div>
          ) : (
            filteredUsers.map((user) => {
              const isActive = activeChat?.type === 'direct' && activeChat.id === user.socketId;

              return (
                <button
                  key={user.socketId}
                  onClick={() => onSelectUser && onSelectUser(user)}
                  className={`w-full text-left flex items-center space-x-2 px-2 py-2 transition-all ${
                    isActive 
                      ? 'bg-blue-100/50 border-l-4 border-blue-500 text-gray-900 font-medium' 
                      : 'border-l-4 border-transparent text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                  }`}
                >
                  <div className="relative flex-shrink-0 mr-1.5">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.username}
                        className="w-8 h-8 rounded-full"
                      />
                    ) : (
                      <div className={`w-8 h-8 flex items-center justify-center border bg-gray-50 rounded-full text-[12px] uppercase font-bold ${isActive ? 'border-blue-300 text-blue-600' : 'border-gray-200 text-gray-500'}`}>
                        {user.username.charAt(0)}
                      </div>
                    )}
                    {/* Active dot indicator */}
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
                  </div>
                  
                  <div className="flex-1 min-w-0 flex justify-between items-center">
                    <div className={`text-[13px] truncate ${isActive ? 'font-medium text-blue-900' : ''}`}>
                      {user.username}
                    </div>
                    {unreadCounts[user.socketId] > 0 && !isActive && (
                      <span className="bg-blue-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center">
                        {unreadCounts[user.socketId]}
                      </span>
                    )}
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
      
    </>
  );
};
