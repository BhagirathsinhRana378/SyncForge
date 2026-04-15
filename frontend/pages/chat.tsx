import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { ChatLayout } from '../components/ChatLayout';
import { Sidebar } from '../components/Sidebar';
import { ChatWindow } from '../components/ChatWindow';
import { socket } from '../utils/socket';
import { User, Room, Message } from '../types';
import { generateDiceBearAvatar, generateId } from '../utils/helpers';

// Main Chat Application Page (/chat)
// This serves as the orchestrator component for all chat functionalities.
export default function ChatApp() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  
  const [rooms, setRooms] = useState<Room[]>([]);
  const [currentRoomId, setCurrentRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // 1. Session Validation: Check if the user is "logged in"
  useEffect(() => {
    const savedUser = localStorage.getItem('syncforge_user');
    if (!savedUser) {
      router.push('/'); // Route back to sign in if no valid session
      return;
    }
    setCurrentUser(JSON.parse(savedUser));
    setIsInitializing(false);
  }, [router]);

  // 2. Socket Connection & Event Listeners
  useEffect(() => {
    if (!currentUser) return;

    // Connect to the Socket.IO server once we confirm the user
    socket.connect();

    // Listen for the initial list of rooms available
    socket.on('room_list', (serverRooms: Room[]) => {
      setRooms(serverRooms);
      
      // Auto-select the first group room "General" if it exists, for a better initial UX
      if (serverRooms.length > 0 && !currentRoomId) {
        const generalRoom = serverRooms.find(r => r.name === 'General');
        handleSelectRoom(generalRoom ? generalRoom.id : serverRooms[0].id);
      }
    });

    // Listen for incoming messages
    socket.on('receive_message', (newMessage: Message) => {
      // We only want to display the message if it belongs to the room we are actively viewing
      setMessages((prevMessages) => {
        // Simple deduplication based on ID (optional, but good practice)
        if (prevMessages.some(m => m.id === newMessage.id)) return prevMessages;
        return [...prevMessages, newMessage];
      });
    });

    // Listen for updates to a room (e.g., when someone joins or leaves)
    socket.on('room_updated', (updatedRoom: Room) => {
      setRooms(prevRooms => prevRooms.map(r => r.id === updatedRoom.id ? updatedRoom : r));
    });

    // We emit an event to tell the backend we came online.
    // The backend might send back 'room_list' immediately.
    socket.emit('user_connected', currentUser);

    // Cleanup: Remove listeners when the component unmounts
    return () => {
      socket.off('room_list');
      socket.off('receive_message');
      socket.off('room_updated');
      socket.disconnect();
    };
  }, [currentUser]); // Note: In a real app we'd carefully manage dependency array to avoid reconnects

  // 3. Changing Rooms
  const handleSelectRoom = (roomId: string) => {
    if (roomId === currentRoomId) return;

    // If we were already in a room, optionally leave it (depends on backend logic, often not needed for simple apps)
    
    setCurrentRoomId(roomId);
    setMessages([]); // Clear chat history when switching to a new room

    // Tell the backend we are joining the room.
    // The backend might respond by sending us message history or a join confirmation.
    socket.emit('join_room', { roomId, user: currentUser });
  };

  // 4. Sending a Message
  const handleSendMessage = (content: string) => {
    if (!currentUser || !currentRoomId) return;

    const newMessage: Message = {
      id: generateId(), // Optimistic ID generation
      senderId: currentUser.id,
      content,
      timestamp: new Date().toISOString(),
      roomId: currentRoomId,
    };

    // Optimistic UI update: Show the message immediately on our end
    setMessages(prev => [...prev, newMessage]);

    // Send it to the server so it can broadcast to others
    socket.emit('send_message', newMessage);
  };

  // 5. Room Creation Logic (Phase 1 Frontend-Only Logic)
  // These modify the state optimistically. In a real app, they would emit to the server.
  const handleCreateGroup = (name: string, additionalMembers: string[]) => {
    if (!currentUser) return;
    
    // We mock the additional users securely by name
    const members: User[] = [
      currentUser,
      ...additionalMembers.map(mName => ({
        id: generateId(),
        name: mName,
        avatar: generateDiceBearAvatar(mName)
      }))
    ];

    const newRoom: Room = {
      id: generateId(),
      name,
      type: 'group',
      members
    };

    // Update rooms list and auto-select
    setRooms(prev => [...prev, newRoom]);
    handleSelectRoom(newRoom.id);
  };

  const handleCreatePrivateChat = (username: string) => {
    if (!currentUser) return;

    const newRoom: Room = {
      id: generateId(),
      name: username, // For 1-on-1, using their name makes sense
      type: 'private',
      members: [
        currentUser,
        {
          id: generateId(),
          name: username,
          avatar: generateDiceBearAvatar(username)
        }
      ]
    };

    // Update rooms list and auto-select
    setRooms(prev => [...prev, newRoom]);
    handleSelectRoom(newRoom.id);
  };

  // Prevent flashing the UI before the session check is complete
  if (isInitializing) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <span className="block w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></span>
      </div>
    );
  }

  const currentRoom = rooms.find(r => r.id === currentRoomId) || null;

  return (
    <>
      <Head>
        <title>SyncForge | Chat</title>
      </Head>
      <ChatLayout currentUser={currentUser}>
        <Sidebar 
          rooms={rooms} 
          currentRoomId={currentRoomId} 
          onSelectRoom={handleSelectRoom} 
          onCreateGroup={handleCreateGroup}
          onCreatePrivate={handleCreatePrivateChat}
        />
        <ChatWindow 
          currentRoom={currentRoom}
          messages={messages}
          currentUser={currentUser!}
          onSendMessage={handleSendMessage}
        />
      </ChatLayout>
    </>
  );
}

