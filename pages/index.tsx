import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { generateId, generateDiceBearAvatar } from '../utils/helpers';
import { User } from '../types';

// SignIn Page (/)
// Redesigned: Removed bright green gradients/shadows.
// Replaced with a stark, minimal card commonly seen in enterprise SaaS (e.g. Linear/Vercel).
export default function SignIn() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedUser = localStorage.getItem('syncforge_user');
    if (savedUser) {
      router.push('/chat');
    }
  }, [router]);

  const handleJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);

    const newUser: User = {
      id: generateId(),
      name: name.trim(),
      avatar: avatarUrl.trim() || generateDiceBearAvatar(name.trim()),
    };

    localStorage.setItem('syncforge_user', JSON.stringify(newUser));
    
    setTimeout(() => {
      router.push('/chat');
    }, 500);
  };

  return (
    <>
      <Head>
        <title>SyncForge | Login</title>
      </Head>
      
      {/* Background: Solid light gray #f3f4f6 instead of gradient, enforcing a calm baseline */}
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 font-sans">
        
        {/* Main Card: Pure white, subtle border, absolutely no heavy shadow drops */}
        <div className="w-full max-w-sm bg-white rounded-[16px] shadow-sm border border-gray-200 overflow-hidden">
          
          <div className="p-8">
            {/* Visual Header: Replaced large green square with a minimal monochrome text logo */}
            <div className="flex justify-center mb-8">
              <h1 className="text-2xl font-bold text-gray-900 tracking-tight">
                SyncForge<span className="text-gray-300">.</span>
              </h1>
            </div>
            
            <p className="text-center text-gray-500 text-sm mb-6 font-medium">
              Enter your details to join the workspace.
            </p>

            <form onSubmit={handleJoin} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  Display Name
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  // Input: Soft border, no heavy focus rings. Just a subtle change in border color to near-black.
                  className="w-full px-3 py-2.5 rounded-[12px] border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors placeholder:text-gray-400 text-sm"
                />
              </div>

              <div>
                <label htmlFor="avatar" className="block text-[13px] font-semibold text-gray-700 mb-1.5">
                  Avatar URL <span className="text-gray-400 font-normal">(Optional)</span>
                </label>
                <input
                  id="avatar"
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-3 py-2.5 rounded-[12px] border border-gray-200 bg-white text-gray-900 focus:outline-none focus:border-gray-900 focus:ring-1 focus:ring-gray-900 transition-colors placeholder:text-gray-400 text-sm"
                />
              </div>

              <div className="pt-2">
                {/* Button: Severe contrast (black/white) instead of bright green. Standard premium SaaS move. */}
                <button
                  type="submit"
                  disabled={!name.trim() || isLoading}
                  className="w-full py-2.5 px-4 bg-gray-900 hover:bg-black disabled:bg-gray-100 disabled:text-gray-400 text-white text-sm font-semibold rounded-[12px] transition-colors flex items-center justify-center"
                >
                  {isLoading ? (
                    <span className="block w-4 h-4 border-2 border-gray-400 border-t-gray-800 rounded-full animate-spin"></span>
                  ) : (
                    <span>Continue</span>
                  )}
                </button>
              </div>
            </form>
          </div>
          
          <div className="bg-gray-50/50 px-8 py-4 border-t border-gray-100">
            <p className="text-[11px] text-center text-gray-400">
              Session is temporary and in-memory only.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
