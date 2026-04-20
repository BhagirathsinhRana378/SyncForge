import React, { useEffect, useState, useMemo } from 'react';
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
  // ✅ REQUIRED FIX: GLOBAL MESSAGE STORE
  const [messages, setMessages] = useState<Message[]>([]);
  
  // 🎯 FEATURE 1: Maintain active users list
  const [onlineUsers, setOnlineUsers] = useState<{username: string; socketId: string, avatar?: string}[]>([]);
  
  // 🧠 UX IMPROVEMENT: Track unread counts per chat
  const [unreadCounts, setUnreadCounts] = useState<Record<string, number>>({});

  // 🎯 FEATURE 3: Chat context management instead of just currentRoomId
  // The context tracks whether we are chatting in a group/room or directly with another user
  const [activeChat, setActiveChat] = useState<{
    type: "direct" | "room";
    id: string; // socketId if direct, roomId if room
    name?: string; // Username for direct or room name
  } | null>(null);

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

    // 🎯 FRONTEND FIX 1: REGISTER USER AFTER CONNECT
    /*
     * 🧠 CORE ISSUE EXPLANATION:
     * - Socket connection ≠ user identity. A connection simply opens a raw TCP tunnel to the server.
     * - The username must be manually registered via an event (e.g. "register_user") to pass the app-level identity.
     * - The backend must store a mapping of socketId -> user to bridge the transport layer to the app logic.
     * - Without this, the system cannot:
     *    1. Show online users (since the server only knows raw socket strings, not who they are).
     *    2. Route messages correctly (since direct messaging relies on sending to a specific identity's socket).
     */
    const handleRegister = () => {
      /*
       * COMMENT:
       * Why registration must happen after socket connects:
       * - Calling emit immediately might fail because the socket connection (TCP handshake, etc.) 
       *   takes a few milliseconds to establish.
       * - Waiting for the "connect" event ensures the pipe is open before sending data.
       */
      socket.emit("register_user", currentUser.name);
    };

    if (socket.connected) {
      handleRegister();
    } else {
      socket.on("connect", handleRegister);
    }

    // 🎯 FRONTEND FIX 2: RECEIVE ONLINE USERS
    socket.on('online_users', (users: {username: string; socketId: string}[]) => {
      // ⚠️ DEBUG REQUIREMENTS:
      console.log("ONLINE USERS:", users);
      // Filter out our own user to prevent chatting with ourselves
      setOnlineUsers(users.filter(u => u.socketId !== socket.id));
    });

    // Listen for the initial list of rooms available
    socket.on('room_list', (serverRooms: Room[]) => {
      setRooms(serverRooms);
      
      // Auto-select the first group room "General" if no active chat
      if (serverRooms.length > 0 && !activeChat) {
        const generalRoom = serverRooms.find(r => r.name === 'General');
        handleSelectRoom(generalRoom ? generalRoom.id : serverRooms[0].id);
      }
    });

    // 🎯 FRONTEND FIX 6: RECEIVE MESSAGE
    const receiveMessageHandler = (data: Message) => {
      console.log("RECEIVED MESSAGE:", data);
      console.log("STORED MESSAGE:", data);

      /*
       * COMMENT REQUIRED:
       * Why messages should not depend on active chat:
       * - If we only pushed messages into state while a user is actively viewing that specific channel, 
       *   all data sent entirely off-screen is permanently lost from the UI context.
       * Why local-only state breaks real-time apps:
       * - Real-time applications mean multiple sources of truth push simultaneously. 
       *   Decoupling local logic (filtering) from the core receiver allows global storage consistency.
       */
      // ALWAYS store message, regardless of active chat
      setMessages((prev) => [...prev, data]);
      
      // Update unread counts if we are not actively in that chat
      if (data.from !== socket.id) {
        const chatScopeId = data.roomId ? data.roomId : data.from;
        setUnreadCounts(prev => ({
          ...prev,
          [chatScopeId]: (prev[chatScopeId] || 0) + 1
        }));
      }
    };
    
    socket.on('receive_message', receiveMessageHandler);

    // 🎯 FIX 4: FRONTEND GROUP SYNC
    socket.on('group_created', (group: Room) => {
      setRooms(prev => [...prev, group]);
    });

    socket.on('room_updated', (updatedRoom: Room) => {
      setRooms(prevRooms => prevRooms.map(r => r.id === updatedRoom.id ? updatedRoom : r));
    });

    /*
     * COMMENT REQUIRED:
     * Why cleanup is mandatory:
     * - When the component unmounts or re-renders, the `useEffect` hook runs again and re-registers listeners.
     * - Without `socket.off()`, multiple identical listeners compound silently in the background mapping multiple callbacks per single event.
     * What happens without cleanup (duplicate messages):
     * - Every time the server broadcasts one message, the frontend fires the listener dozens of times, resulting in heavily duplicated UI entries and rapid UI crashes.
     */
    return () => {
      socket.off('connect', handleRegister);
      socket.off('online_users');
      socket.off('room_list');
      socket.off('receive_message', receiveMessageHandler);
      socket.off('group_created');
      socket.off('room_updated');
      socket.disconnect();
    };
  }, [currentUser]);

  // 3. Changing Contexts
  const handleSelectRoom = (roomId: string) => {
    if (activeChat?.id === roomId) return;
    
    // 🎯 FIX 5: ENSURE ROOM JOIN BEFORE MESSAGING
    /*
     * COMMENT:
     * Why joining room is required before receiving messages:
     * - The Socket.IO server isolates room broadcasts (io.to(roomId).emit) exclusively to sockets 
     *   that have formally invoked `socket.join(roomId)`. If we skip this, the server correctly 
     *   routes the message into the channel but our socket drops the packets because it isn't subscribed.
     */
    socket.emit('join_room', roomId);
    
    setActiveChat({ type: 'room', id: roomId });
    // Reset unread count for this scope
    setUnreadCounts(prev => ({...prev, [roomId]: 0}));
  };

  const handleSelectUser = (user: {username: string; socketId: string}) => {
    if (activeChat?.id === user.socketId) return;
    
    // 🎯 FEATURE 2: Select direct chat
    setActiveChat({ type: "direct", id: user.socketId, name: user.username });
    // Reset unread count
    setUnreadCounts(prev => ({...prev, [user.socketId]: 0}));
  };

  // 4. Sending a Message
  const handleSendMessage = (content: string) => {
    if (!currentUser || !activeChat) return;

    // ⚠️ CRITICAL EDGE CASES: Prevent sending empty messages
    if (!content || content.trim() === '') return;

    // Send it to the server so it can properly route it
    socket.emit('send_message', {
      message: content,
      toUserId: activeChat.type === 'direct' ? activeChat.id : undefined,
      roomId: activeChat.type === 'room' ? activeChat.id : undefined
    });
  };

  // 5. Room Creation Logic
  const handleCreateGroup = (name: string, additionalMembers: string[]) => {
    if (!currentUser) return;
    
    // We expect `additionalMembers` to be an array of socketIds for this flow
    // Add current user's socket ID as well
    const allMemberIds = [socket.id, ...additionalMembers];
    
    // Emit to server to handle joining everyone silently to the room channel
    socket.emit("create_group", {
      roomId: generateId(),
      name,
      members: allMemberIds
    });
  };

  // 🎯 FIX 9: DEBUG LOGS (MANDATORY)
  useEffect(() => {
    console.log("Rooms updated:", rooms);
  }, [rooms]);

  // --- ALL HOOKS HERE (TOP LEVEL ONLY) --- //

  /*
   * COMMENT REQUIRED:
   * Why hooks cannot be conditional (e.g. inside if statements or after early returns):
   * - React tracks hooks by their call order across renders using an internal array structure. 
   * - If a hook is conditionally skipped (via 'if' or an early return like `if (isInitializing) return`), 
   *   React loses track of the execution order, mismatching state indexes and crashing with "Rendered more hooks than during the previous render."
   * Why logic should be inside the hook instead:
   * - By always calling the hook unconditionally, we satisfy React's linked-list architecture.
   * - Inside the hook block, we use standard logic `if (!activeChat... return;)` to safely guard execution without breaking React.
   */
  useEffect(() => {
    if (!activeChat?.id) return;

    // SAFE OPTIONAL ACCESS
    const currentUnread = unreadCounts?.[activeChat.id] || 0;
    
    // AVOID STATE UPDATE LOOPS: only update if it is greater than 0
    if (currentUnread > 0) {
      setUnreadCounts(prev => ({
        ...prev,
        [activeChat.id]: 0
      }));
    }
  }, [activeChat, unreadCounts]);

  /*
   * 🎯 CHAT FILTERING (IMPORTANT)
   * COMMENT REQUIRED:
   * Why filtering is done at render level:
   * - Keeps the raw messages bucket (global store) completely independent of UI state.
   * - It is highly flexible. We can dynamically re-evaluate what messages belong to the chat instantly.
   * Why storing all messages is necessary:
   * - We guarantee that switching tabs (or opening a chat later) immediately presents all past messages for that session, as the data was constantly archived in the background globally.
   */
  const filteredMessages = useMemo(() => {
    if (!activeChat) return [];

    return messages.filter(msg => {
      // DIRECT CHAT
      if (activeChat.type === "direct") {
        return msg.from === activeChat.id || msg.to === activeChat.id;
      }
      // ROOM CHAT
      if (activeChat.type === "room") {
        return msg.roomId === activeChat.id;
      }
      return false;
    });
  }, [messages, activeChat]);

  const activeRoomContext = useMemo(() => {
    return activeChat?.type === 'room' 
      ? rooms.find(r => r.id === activeChat.id) || null
      : activeChat && currentUser ? {
          id: activeChat.id,
          name: activeChat.name || "Direct Message",
          type: "private" as const,
          members: [
            { id: activeChat.id, name: activeChat.name || "User", avatar: generateDiceBearAvatar(activeChat.name || "User") }, 
            currentUser
          ]
        } : null;
  }, [activeChat, rooms, currentUser]);

  // ❌ NO HOOKS BELOW THIS LINE 

  if (isInitializing || !currentUser) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-gray-50">
        <span className="block w-8 h-8 border-2 border-gray-300 border-t-gray-900 rounded-full animate-spin"></span>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>SyncForge | Chat</title>
      </Head>
      <ChatLayout currentUser={currentUser}>
        <Sidebar 
          rooms={rooms} 
          currentRoomId={activeChat?.type === 'room' ? activeChat.id : null}
          activeChat={activeChat}
          onlineUsers={onlineUsers}
          unreadCounts={unreadCounts}
          onSelectUser={handleSelectUser}
          onSelectRoom={handleSelectRoom} 
          onCreateGroup={handleCreateGroup}
        />
        <ChatWindow 
          currentRoom={activeRoomContext}
          messages={filteredMessages}
          currentUser={{...currentUser, id: socket.id || currentUser.id }} // Ensure we match Socket IDs for self-recognition
          onSendMessage={handleSendMessage}
        />
      </ChatLayout>
    </>
  );
}
// some changes are done to test the github
