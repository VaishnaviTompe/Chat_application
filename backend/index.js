// Importing the necessary modules 
const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");

app.use(cors());

// Created an HTTP server using Express.
const server = http.createServer(app);

// Initialize a new instance of Socket.IO
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // Allow requests from this origin.
    methods: ["GET", "POST"], // Allow these HTTP methods.
  },
});

// Handle socket connections when a client connects.
io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);   // user with specific id
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
  });
});

// Start the server on port 3001
server.listen(3001, () => {
  console.log("SERVER RUNNING");
});
