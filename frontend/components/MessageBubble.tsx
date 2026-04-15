import React from 'react';
import { formatTime } from '../utils/helpers';
import { Message, User } from '../types';
import { Avatar } from './Avatar';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  sender?: User;
  showAvatar?: boolean;
}

// MessageBubble Component
// Redesigned: Eliminated the standard WhatsApp bubbles (e.g. green bg, jagged corners).
// Sender (current user): #e5e7eb background, dark text, right aligned.
// Others: White background with a thin border, left aligned.
export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isOwnMessage, 
  sender,
  showAvatar = true 
}) => {
  return (
    <div className={`flex w-full mb-3 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      
      {!isOwnMessage && showAvatar && sender && (
        <div className="mr-3 flex-shrink-0 flex items-start mt-1">
          <Avatar src={sender.avatar} alt={sender.name} size="md" />
        </div>
      )}
      
      {!isOwnMessage && !showAvatar && (
        <div className="w-8 mr-3 flex-shrink-0" />
      )}

      <div className={`max-w-[75%] flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        {!isOwnMessage && sender && showAvatar && (
          <div className="flex items-baseline space-x-2 mb-1 mr-1">
            <span className="text-[13px] font-semibold text-gray-900">{sender.name}</span>
            <span className="text-[10px] text-gray-400">{formatTime(message.timestamp)}</span>
          </div>
        )}
        
        <div 
          // SaaS style message bubbles: lg border radius, clean borders.
          className={`px-3.5 py-2 rounded-xl text-[14px] leading-relaxed relative ${
            isOwnMessage 
              ? 'bg-gray-200 text-gray-900' 
              : 'bg-white border text-gray-900 border-gray-200 shadow-sm'
          }`}
        >
          {message.content}
        </div>
        
        {/* If own message, we put time under it, or inside. For simplicity, just small text below. */}
        {isOwnMessage && (
          <div className="mt-1 flex items-center justify-end space-x-1 mr-1">
            <span className="text-[10px] text-gray-400">
              {formatTime(message.timestamp)}
            </span>
          </div>
        )}

      </div>
    </div>
  );
};
