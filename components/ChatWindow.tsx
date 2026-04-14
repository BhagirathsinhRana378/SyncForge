import React, { useEffect, useRef } from 'react';
import { Message, Room, User } from '../types';
import { MessageBubble } from './MessageBubble';
import { MessageInput } from './MessageInput';
import { Hash, Users } from 'lucide-react';

interface ChatWindowProps {
  currentRoom: Room | null;
  messages: Message[];
  currentUser: User;
  onSendMessage: (content: string) => void;
}

// ChatWindow Component
// The main area where messages are displayed and new messages are typed.
// Includes logic to auto-scroll to the bottom when new messages arrive.
export const ChatWindow: React.FC<ChatWindowProps> = ({
  currentRoom,
  messages,
  currentUser,
  onSendMessage
}) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll logic: whenever the messages array changes, we scroll to the bottom marker.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // If no room is selected, display a placeholder empty state
  if (!currentRoom) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-gray-50 h-full">
        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
          <Hash className="text-green-500 w-10 h-10" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Welcome to SyncForge</h2>
        <p className="text-gray-500 max-w-sm text-center">
          Select a chat from the sidebar to continue your conversation, or wait for others to join.
        </p>
      </div>
    );
  }

  // Find the sender data for a specific message.
  // In a real app we might have a global state or map of standard users.
  // Here we just look into the room members.
  const getSender = (senderId: string): User | undefined => {
    return currentRoom.members.find(m => m.id === senderId);
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-gray-50 relative">
      {/* Header bar for the specific chat room */}
      <div className="h-16 bg-white border-b border-gray-200 flex items-center px-6 sticky top-0 z-10 shadow-sm flex-shrink-0">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-green-100 text-green-600 rounded-lg flex items-center justify-center">
            {currentRoom.type === 'group' ? <Hash size={20} /> : <span className="font-bold text-lg">{currentRoom.name.charAt(0)}</span>}
          </div>
          <div>
            <h2 className="font-bold text-gray-800 tracking-tight">{currentRoom.name}</h2>
            <div className="flex items-center text-xs text-green-600 font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5 animate-pulse"></span>
              {currentRoom.members.length} participants
            </div>
          </div>
        </div>
      </div>

      {/* Scrollable messages container */}
      <div className="flex-1 overflow-y-auto p-6 scroll-smooth">
        <div className="max-w-4xl mx-auto flex flex-col">
          {messages.length === 0 ? (
            <div className="text-center my-10 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mx-auto max-w-sm">
              <p className="text-gray-500 font-medium">This is the beginning of the chat.</p>
              <p className="text-gray-400 text-sm mt-1">Say hi to get things started!</p>
            </div>
          ) : (
            messages.map((message, index) => {
              const isOwnMessage = message.senderId === currentUser.id;
              const sender = getSender(message.senderId);
              
              // Only show avatar if it's the first message in a sequence from the same user
              // to make the UI look cleaner (like Slack/WhatsApp)
              const previousMessage = index > 0 ? messages[index - 1] : null;
              const isNewSenderSequence = !previousMessage || previousMessage.senderId !== message.senderId;

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwnMessage={isOwnMessage}
                  sender={sender}
                  showAvatar={isNewSenderSequence}
                />
              );
            })
          )}
          {/* This empty div acts as our scroll target anchor */}
          <div ref={messagesEndRef} className="h-1" />
        </div>
      </div>

      {/* Input area sticky at the bottom */}
      <div className="mt-auto">
        <MessageInput onSendMessage={onSendMessage} />
      </div>
    </div>
  );
};
