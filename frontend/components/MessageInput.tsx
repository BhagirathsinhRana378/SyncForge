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
    <div className="flex items-center gap-2 p-3 border-t border-gray-200 bg-white">
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
        placeholder={disabled ? "Please select a channel..." : "Message..."}
        className="flex-1 p-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-blue-400 outline-none text-sm text-gray-900 transition-all"
      />
      <button
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        className="bg-blue-500 text-white px-4 py-[13px] rounded-xl hover:bg-blue-600 disabled:bg-gray-300 disabled:text-gray-500 transition-colors shadow-sm font-medium text-sm flex items-center justify-center min-w-[70px]"
        aria-label="Send message"
      >
        Send
      </button>
    </div>
  );
};
