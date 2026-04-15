import React, { useState } from 'react';
import { X } from 'lucide-react';

interface CreateGroupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateGroup: (name: string, additionalMembers: string[]) => void;
}

// CreateGroupModal Component
// Redesigned: Eliminated bright green buttons and heavy focus rings.
// Using grayscale monochrome styling with a subtle button text.
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

    const membersList = membersStr
      .split(',')
      .map(m => m.trim())
      .filter(m => m.length > 0);

    onCreateGroup(groupName.trim(), membersList);
    
    setGroupName('');
    setMembersStr('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-sm">
      <div className="bg-white rounded-[16px] shadow-sm border border-gray-200 w-full max-w-md overflow-hidden transform transition-all animate-in fade-in zoom-in-95 duration-200">
        
        <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
          <h2 className="text-[15px] font-bold text-gray-900">Create Group</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-gray-900 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-2">
                Channel Name
              </label>
              <input
                type="text"
                required
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
                placeholder="Product design"
                className="w-full px-3 py-2.5 text-sm rounded-[8px] border border-gray-300 bg-white focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors placeholder:text-gray-400"
              />
            </div>
            
            <div>
              <label className="block text-[13px] font-semibold text-gray-700 mb-2">
                Members <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                value={membersStr}
                onChange={(e) => setMembersStr(e.target.value)}
                placeholder="Alice, Bob"
                className="w-full px-3 py-2.5 text-sm rounded-[8px] border border-gray-300 bg-white focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors placeholder:text-gray-400"
              />
            </div>

            <div className="pt-4 flex justify-end space-x-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm rounded-[8px] font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!groupName.trim()}
                className="px-4 py-2 text-sm rounded-[8px] font-medium bg-gray-900 text-white hover:bg-black disabled:bg-gray-200 disabled:text-gray-400 transition-colors"
              >
                Create channel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
