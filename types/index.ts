// types/index.ts

// The User type represents a participant in the chat system.
// We use a simple data structure to keep it lightweight.
export interface User {
  id: string; // Unique identifier for the user
  name: string; // Display name of the user
  avatar: string; // URL to the user's avatar image
}

// The Message type represents a single chat message sent by a user in a specific room.
export interface Message {
  id: string; // Unique identifier for the message
  senderId: string; // The ID of the User who sent this message
  content: string; // The actual text content of the message
  timestamp: string; // ISO string representation of when the message was sent
  roomId: string; // The ID of the Room where this message was sent
}

// The Room type represents either a private 1-on-1 chat or a group chat.
export interface Room {
  id: string; // Unique identifier for the room
  name: string; // Display name for the room (especially useful for group chats)
  type: "private" | "group"; // Determines if it's a 1-on-1 or multi-user chat
  members: User[]; // List of users who are currently part of this room
}
