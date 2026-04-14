import React, { useState, KeyboardEvent, useRef } from 'react';
import { Send } from 'lucide-react'; // Switched to minimal Send icon instead of SendHorizonal

interface MessageInputProps {
  onSendMessage: (content: string) => void;
  disabled?: boolean;
}

// MessageInput Component
// Redesigned: White background, subtle border. Send button is now a minimal icon button,
// avoiding heavy colored blocks. We use Emerald green ONLY slightly on hover/active states.
export const MessageInput: React.FC<MessageInputProps> = ({ onSendMessage, disabled = false }) => {
  const [text, setText] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (text.trim() && !disabled) {
      onSendMessage(text.trim());
      setText(''); 
      inputRef.current?.focus(); 
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault(); 
      handleSend();
    }
  };

  return (
    <div className="px-6 py-4 bg-gray-50/30 border-t border-gray-200">
      <div className="flex items-center w-full max-w-4xl mx-auto bg-white border border-gray-200 rounded-full shadow-sm pr-2 pl-4 focus-within:ring-1 focus-within:ring-gray-300 focus-within:border-gray-300 transition-all">
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          placeholder={disabled ? "Please select a channel..." : "Message..."}
          className="flex-1 text-sm text-gray-800 bg-transparent py-3 focus:outline-none placeholder:text-gray-400"
        />
        <button
          onClick={handleSend}
          disabled={disabled || !text.trim()}
          className="text-gray-400 hover:text-emerald-600 disabled:text-gray-300 disabled:cursor-not-allowed p-1.5 flex items-center justify-center transition-colors flex-shrink-0"
          aria-label="Send message"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};
