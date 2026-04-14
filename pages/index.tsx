import React, { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { generateId, generateDiceBearAvatar } from '../utils/helpers';
import { User } from '../types';

// SignIn Page (/)
// The entry point for Phase 1. Since we have no database, we generate
// an "in-memory" session by creating a User object and storing it in localStorage.
export default function SignIn() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // If a user is already "logged in", automatically redirect them to the chat page.
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

    // Create a new User object.
    // If no avatar is provided, generate a cute fallback using DiceBear
    const newUser: User = {
      id: generateId(),
      name: name.trim(),
      avatar: avatarUrl.trim() || generateDiceBearAvatar(name.trim()),
    };

    // Store in localStorage to simulate an active session
    localStorage.setItem('syncforge_user', JSON.stringify(newUser));
    
    // Using a tiny timeout just to show the loading state for UX polish
    setTimeout(() => {
      router.push('/chat');
    }, 500);
  };

  return (
    <>
      <Head>
        <title>Sign In | SyncForge</title>
      </Head>
      
      {/* Background with a subtle gradient for a premium feel */}
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-4 font-sans">
        
        {/* Main Card */}
        <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden transform transition-all">
          
          <div className="p-8">
            {/* Visual Header */}
            <div className="flex justify-center mb-6">
              <div className="w-16 h-16 bg-green-500 rounded-xl flex items-center justify-center shadow-lg shadow-green-200">
                <span className="text-white font-bold text-3xl leading-none">S</span>
              </div>
            </div>
            
            <h1 className="text-2xl font-extrabold text-center text-gray-800 mb-2 tracking-tight">
              Welcome to SyncForge
            </h1>
            <p className="text-center text-gray-500 text-sm mb-8">
              Enter your details to join the real-time chat workspace.
            </p>

            {/* Entry Form */}
            <form onSubmit={handleJoin} className="space-y-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-1.5 flex items-center space-x-1">
                  <span>Display Name</span>
                  <span className="text-red-500">*</span>
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Jane Doe"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-400 font-medium"
                />
              </div>

              <div>
                <label htmlFor="avatar" className="block text-sm font-semibold text-gray-700 mb-1.5">
                  Avatar URL (Optional)
                </label>
                <input
                  id="avatar"
                  type="url"
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  placeholder="https://example.com/avatar.jpg"
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all placeholder:text-gray-400 font-medium"
                />
              </div>

              <button
                type="submit"
                disabled={!name.trim() || isLoading}
                className="w-full py-3.5 px-4 bg-green-500 hover:bg-green-600 disabled:bg-green-300 disabled:cursor-not-allowed text-white text-sm font-bold rounded-xl transition-all shadow-md shadow-green-200 flex items-center justify-center space-x-2 mt-4"
              >
                {isLoading ? (
                  <span className="block w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                ) : (
                  <span>Continue to App</span>
                )}
              </button>
            </form>
          </div>
          
          <div className="bg-gray-50 px-8 py-4 border-t border-gray-100">
            <p className="text-xs text-center text-gray-400 font-medium">
              Phase 1: Temporary in-memory session. Data is lost upon closing.
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
