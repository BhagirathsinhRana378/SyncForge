import React, { useState } from 'react';
import { X } from 'lucide-react';
import { User } from '../types';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (name: string, additionalMembers: string[]) => void;
}

// CreateGroupModal Component
// Renders a centered dialog for creating a new group chat.
// We manage local state for the form inputs and trigger the callback 
// provided by the parent when the user submits it.
export const CreateGroupModal: React.FC<CreateGroupModalProps> = ({
  isOpen,
  onClose,
  onCreateGroup
}) => {
  const [groupName, setGroupName] = useState('');
  const [membersStr, setMembersStr] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!groupName.trim()) return;

    // Splitting a simple comma-separated list of names into an array
    const membersList = membersStr
      .split(',')
      .map(m => m.trim())
      .filter(m => m.length > 0);

    // Call the parent handler to actually generate the room
    onCreateGroup(groupName.trim(), membersList);
    
    // Reset internal state and close modal
    setGroupName('');
    setMembersStr('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      {/* Modal Container */}
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex justify-between items-center p-5 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-800">Create Group</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 p-2 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body Content / Form */}
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Group Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Next.js Warriors"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-400"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Members
              </label>
              <input
                type="text"
                value={membersStr}
                onChange={(e) => setMembersStr(e.target.value)}
                placeholder="Comma separated names (e.g. Alice, Bob)"
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-400"
              />
              <p className="text-xs text-gray-400 mt-2">
                Note: In Phase 1 we mock users by name since there is no persistent backend yet.
              </p>
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
                disabled={!groupName.trim()}
                className="px-5 py-2.5 rounded-xl font-medium bg-green-500 text-white hover:bg-green-600 disabled:bg-green-300 transition-colors shadow-sm shadow-green-200"
              >
                Create
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
