import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CreatePrivateChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePrivate: (username: string) => void;
}

// CreatePrivateChatModal Component
// Provides a clean overlay dialog for initiating a 1-on-1 private chat with someone.
export const CreatePrivateChatModal: React.FC<CreatePrivateChatModalProps> = ({
  isOpen,
  onClose,
  onCreatePrivate
}) => {
  const [username, setUsername] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    onCreatePrivate(username.trim());
    
    // Reset and close
    setUsername('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Start Private Chat</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Username to Chat With <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="E.g. John Doe"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-400"
              />
            </div>

            <div className="pt-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!username.trim()}
                className="px-5 py-2.5 rounded-xl font-medium bg-green-500 text-white hover:bg-green-600 disabled:bg-green-300 transition-colors shadow-sm shadow-green-200"
              >
                Start Chat
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
