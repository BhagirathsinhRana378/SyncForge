import React, { useEffect, useRef } from 'react';
import { Message, Room, User } from '../types';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { Hash, User as UserIcon } from 'lucide-react';

interface ChatWindowProps {
  currentRoom: Room | null;
  messages: Message[];
  currentUser: User;
  onSendMessage: (content: string) => void;
}

// ChatWindow Component
// Redesigned: No more bright green hero areas. Empty state is highly muted gray.
// Header is a clean white block with soft borders. No heavy shadows.
export const ChatWindow: React.FC<ChatWindowProps> = ({
  currentRoom,
  messages,
  currentUser,
  onSendMessage
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (!currentRoom) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 h-full">
        {/* Subtle monochrome icon vs old bright green circle */}
        <div className="w-16 h-16 border border-gray-200 bg-white rounded-[16px] flex items-center justify-center mb-6 shadow-sm">
          <Hash className="text-gray-300 w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-2 tracking-tight">Welcome to SyncForge</h2>
        <p className="text-gray-500 max-w-sm text-center text-sm">
          Select a channel or message from the sidebar to start collaborating.
        </p>
      </div>
    );
  }

  const getSender = (message: Message): User | undefined => {
    let user = currentRoom.members.find(m => m.id === message.from);
    if (!user && message.fromName) {
      user = { 
        id: message.from, 
        name: message.fromName, 
        // fallback avatar if direct chat doesn't push avatar string
        avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${message.fromName}`
      };
    }
    return user;
  };

  return (
    <div className="flex-1 flex flex-col h-full relative" style={{ background: "linear-gradient(to bottom, #f8fafc, #eef2f7)" }}>
      
      {/* Header bar: Sleek white, minimal text */}
      <div className="h-14 bg-white border-b border-gray-200 flex items-center px-6 sticky top-0 z-10 flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 flex items-center justify-center border border-gray-200 bg-gray-50 rounded-lg text-gray-500">
            {currentRoom.type === 'group' ? <Hash size={16} /> : <UserIcon size={16} />}
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-gray-900 tracking-tight">{currentRoom.name}</h2>
            <div className="flex items-center text-[12px] text-gray-500 font-medium">
              {currentRoom.members.length} members
            </div>
          </div>
        </div>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
        <div className="max-w-4xl mx-auto flex flex-col">
          {messages.length === 0 ? (
            <div className="text-center my-10 mx-auto max-w-sm">
              <p className="text-gray-900 font-semibold text-sm">Conversation started</p>
              <p className="text-gray-500 text-xs mt-1">This is the beginning of your history with this group.</p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isOwnMessage = message.from === currentUser.id;
              const originalSender = getSender(message);
              
              const sender = originalSender ? {
                 ...originalSender,
                 name: isOwnMessage ? "You" : originalSender.name
              } : undefined;
              
              const previousMessage = index > 0 ? messages[index - 1] : null;
              const isNewSenderSequence = !previousMessage || previousMessage.from !== message.from;

              return (
                <MessageBubble
                  key={message.id || index}
                  message={message}
                  isOwnMessage={isOwnMessage}
                  sender={sender}
                  showAvatar={isNewSenderSequence}
                />
              );
            })
          )}
          <div ref={messagesEndRef} className="h-1" />
        </div>
      </div>

      <div className="mt-auto">
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};
