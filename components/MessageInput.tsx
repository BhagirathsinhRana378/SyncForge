import React, { useState, KeyboardEvent, useRef, useEffect } from 'react';
import { SendHorizonal } from 'lucide-react'; // We use Lucide icons for clean SaaS aesthetics

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

// MessageInput Component
// The text area where users type their message. 
// Uses an auto-growing input approach or simple enter-to-send.
export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled = false }) => {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // We want to ensure focus is brought back to the input naturally, 
  // but let's keep it simple for now.

  const handleSend = () => {
    // Only send if there's actual content (ignoring pure whitespace)
    if (text.trim() && !disabled) {
      onSendMessage(text.trim());
      setText(''); // clear input after sending
      inputRef.current?.focus(); // keep focus on the input to allow rapid typing
    }
  };

  // Allow sending with the Enter key
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); // prevents form submission or new line issues
      handleSend();
    }
  };

  return (
    <div className="p-4 bg-white border-t border-gray-200">
      <div className="flex items-center space-x-2 w-full max-w-4xl mx-auto">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={disabled ? "Please join a room first..." : "Type a message..."}
          className="flex-1 bg-gray-50 border border-gray-200 text-gray-800 text-sm rounded-full px-5 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-400"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          className="bg-green-500 hover:bg-green-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white rounded-full p-3 flex items-center justify-center transition-colors flex-shrink-0 shadow-sm"
          aria-label="Send message"
        >
          <SendHorizonal size={20} />
        </button>
      </div>
    </div>
  );
};
