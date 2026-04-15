import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*", 
  },
});

/*
 * ARCHITECTURE INSIGHTS:
 * We use a Map to track active users.
 * Why a Map instead of an array?
 * - O(1) time complexity for insertions, deletions, and lookups by socket.id.
 * - An array would require O(N) time to find a user when they disconnect.
 * Why is socket.id the key?
 * - Every connected client gets a unique, temporary socket.id from Socket.IO.
 * - Using it as the key forms our temporary user identity system for the current session.
 * Limitations of in-memory storage:
 * - If the server restarts, all in-memory data (users) is lost.
 * - It doesn't scale to multiple server instances (Node.js clustering) without a pub/sub adapter (like Redis).
 */
const onlineUsers = new Map<string, { username: string; socketId: string }>();

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  /*
   * 🎯 FEATURE 1: On user registration
   * Event-driven system flow: Frontend emits 'register_user' -> Backend processes and stores identity -> Broadcasts state.
   */
  socket.on("register_user", (username: string) => {
    // 🎯 FIX 3: AVATAR SYSTEM
    /*
     * ARCHITECTURE COMMENT:
     * Why avatar should be generated server-side:
     * - Generating avatars server-side ensures the user's avatar is identical across all clients 
     *   without requiring each client to run independent generation logic.
     * Why consistent identity matters:
     * - Identity must be verified and consistent. If a client injects their own malicious avatar URL, 
     *   it can break the UI or impersonate others. Server guarantees the schema.
     */
    const avatar = `https://ui-avatars.com/api/?name=${username}&background=random&color=fff`;

    // Map socket.id to the user details
    onlineUsers.set(socket.id, {
      username,
      socketId: socket.id,
      avatar
    });

    console.log(`User connected: ${username} (${socket.id})`);
    console.log("Online users:", onlineUsers);

    /*
     * IMPORTANT COMMENT:
     * Why registration must happen AFTER connection:
     * - Socket connection ≠ user identity. A connection only establishes a network pipe.
     * - The username must be manually registered because the backend needs to store a mapping 
     *   of socketId -> user to tie the transport layer to the app's business logic.
     * Why socket.id alone is not enough:
     * - socket.id is just a random ephemeral string. Without associating it with a username, 
     *   the system cannot show who is online to other users or route messages meaningly.
     */
    io.emit("online_users", Array.from(onlineUsers.values()));
  });

  /*
   * 🎯 FEATURE 3: Join room
   * How Socket.IO rooms work internally:
   * - A room is just a server-side concept in Socket.IO where sockets can subscribe to a specific channel string.
   * Why they are efficient for group messaging:
   * - Instead of iterating over all connected sockets to send a message to specific users,
   *   Socket.IO internally manages sets of sockets subscribed to a room and broadcasts only to them.
   */
  socket.on("join_room", (roomId: string) => {
    socket.join(roomId);
  });

  /*
   * 🎯 FEATURE 2 & 3: Send message
   * We handle both direct messages and room/group messages here.
   */
  socket.on("send_message", (data) => {
    const { toUserId, roomId, message, senderName } = data;

    // Prevent sending empty messages
    if (!message || message.trim() === "") return;

    // Standardized payload format
    const payload = {
      message,
      from: socket.id,
      to: toUserId,
      roomId,
      senderName,
      time: new Date().toISOString()
    };

    if (roomId) {
      // 🎯 FEATURE 3: Send room message
      // Note: room broadcasts send to all in the room, including the sender if they joined it.
      io.to(roomId).emit("receive_message", payload);
    } else if (toUserId) {
      // 🎯 FEATURE 2: Send direct message
      
      /*
       * ARCHITECTURE COMMENT:
       * Why sender must receive message from server:
       * - It ensures total consistency across all clients and synchronizes the exact state the backend processed.
       * Why UI should not assume message delivery:
       * - Optimistic UI updates (where the frontend assumes success instantly) can result in ghost messages
       *   if the connection drops or the server rejects the payload. Server confirmation is the single source of truth.
       * 
       * ⚠️ CRITICAL EDGE CASE:
       * - Without `socket.emit("receive_message", payload);`, Sender won’t see their own message instantly!
       */
      io.to(toUserId).emit("receive_message", payload);
      socket.emit("receive_message", payload); // send back to sender
    }
  });

  /*
   * 🎯 FEATURE 1: On disconnect
   * Cleanup is critical:
   * - When a user closes the tab or drops connection, their socket.id is invalid.
   * What happens if we don’t remove users?
   * - A memory leak occurs, and the frontend will display "ghost" users who aren't actually online anymore.
   */
  socket.on("disconnect", () => {
    const user = onlineUsers.get(socket.id);

    if (user) {
      console.log(`User disconnected: ${user.username} (${socket.id})`);
      onlineUsers.delete(socket.id);
    }

    io.emit("online_users", Array.from(onlineUsers.values()));
  });
});

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

server.listen(4600, () => {
  console.log("Server running on port 4600");
});