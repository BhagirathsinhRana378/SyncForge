import React from 'react';
import { formatTime } from '../utils/helpers';
import { Message, User } from '../types';
import { Avatar } from './Avatar';

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean; // Tells us whether the current user sent it or someone else
  sender?: User; // We might not always have sender info strictly tied, so it's optional
  showAvatar?: boolean; // Useful for grouping messages by the same user to avoid duplicate avatars
}

// MessageBubble Component
// Renders an individual chat message.
// Notice how it aligns right for "own" messages with a green background,
// and left for "others" messages with a grey background.
export const MessageBubble: React.FC<MessageBubbleProps> = ({ 
  message, 
  isOwnMessage, 
  sender,
  showAvatar = true 
}) => {
  return (
    <div className={`flex w-full mb-4 ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
      
      {/* If it's someone else's message, optionally render their avatar on the left */}
      {!isOwnMessage && showAvatar && sender && (
        <div className="mr-3 flex-shrink-0 flex items-end">
          <Avatar src={sender.avatar} alt={sender.name} size="sm" />
        </div>
      )}
      
      {/* If we aren't showing an avatar for others, we want an empty spacer so messages align nicely */}
      {!isOwnMessage && !showAvatar && (
        <div className="w-8 mr-3 flex-shrink-0" />
      )}

      {/* The actual bubble content */}
      <div className={`max-w-[70%] flex flex-col ${isOwnMessage ? 'items-end' : 'items-start'}`}>
        {/* Name is only really needed for group chats, but good to have when it's not our own message */}
        {!isOwnMessage && sender && showAvatar && (
          <span className="text-xs text-gray-500 ml-1 mb-1">{sender.name}</span>
        )}
        
        <div 
          className={`px-4 py-2 rounded-2xl shadow-sm text-sm ${
            isOwnMessage 
              ? 'bg-green-500 text-white rounded-br-none' 
              : 'bg-white border border-gray-200 text-gray-800 rounded-bl-none'
          }`}
        >
          {message.content}
        </div>
        
        {/* Timestamp */}
        <span className="text-[10px] text-gray-400 mt-1 mx-1">
          {formatTime(message.timestamp)}
        </span>
      </div>
    </div>
  );
};
