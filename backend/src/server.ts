import express from "express";
import http from "http";
import { Server } from "socket.io";
import cors from "cors";

// what cors does is that it allows the frontend to connect to the backend
// without it the frontend will not be able to connect to the backend

const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("send_message", (data) => {
    socket.broadcast.emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

app.get('/', (req, res) => {
  res.send('<h1>Hello world</h1>');
});

server.listen(4600, () => {
  console.log("Server running on port 4600");
});