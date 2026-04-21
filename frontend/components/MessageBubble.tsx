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
  console.log("Rendering avatar:", message.senderAvatar || sender?.avatar);

  /*
   * ARCHITECTURE COMMENT:
   * Why UI must reflect message ownership:
   * - Using distinct visual ownership properties (like specific alignments, distinct background colors, and labeling "You") 
   *   anchors cognitive clarity in the read flow. It prevents context collapse when multiple people chat rapidly.
   */
  return (
    <div className={`flex items-end gap-2 w-full mb-3 ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      
      {!isOwnMessage && showAvatar && (
        <img
          src={message.senderAvatar || "https://ui-avatars.com/api/?name=User"}
          className="w-8 h-8 rounded-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://ui-avatars.com/api/?name=User";
          }}
        />
      )}
      
      {!isOwnMessage && !showAvatar && (
        <div className="w-6 mr-1 flex-shrink-0" />
      )}

      <div className={`
        max-w-[65%] px-4 py-2 rounded-2xl text-sm shadow-sm flex flex-col
        ${isOwnMessage 
          ? "bg-blue-500 text-white rounded-br-none" 
          : "bg-gray-200 text-gray-900 rounded-bl-none"}
      `}>
        {(message.senderName || sender?.name) && showAvatar && (
          <p className="text-xs font-semibold mb-1 opacity-80">
            {isOwnMessage ? "You" : (message.senderName || sender?.name)}
          </p>
        )}
        <p className="leading-relaxed whitespace-pre-wrap">{message.message}</p>
        <span className="text-[10px] opacity-70 block text-right mt-1">
          {formatTime(message.time)}
        </span>
      </div>
    </div>
  );
};
