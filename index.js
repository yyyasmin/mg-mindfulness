"use strict";
const express = require("express");
const http = require("http");
const socket = require("socket.io");
const cors = require("cors");
const path = require("path");

const app = express();
const server = http.Server(app);

// Add the 'cors' middleware with options to allow requests from 'http://localhost:8080'
const corsOptions = {
  origin: "*",
  optionsSuccessStatus: 200,
};
app.use(cors(corsOptions));

// Add the following lines to handle Socket.IO connections
const io = socket(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
    allowedHeaders: ["*"],
    credentials: true,
  },
});

// Serve static files from the "public" directory
app.use(express.static(path.join(__dirname, "public")));


  app.get("/database/Cards.json", (req, res) => {
  const filePath = path.join(__dirname, "database", "Cards.json");
  res.sendFile(filePath);
});

app.get("/database/rooms.json", (req, res) => {
  const filePath = path.join(__dirname, "database", "rooms.json");
  res.sendFile(filePath);
});

const serverSocketServices = require("./serverSocketServices");// Use the io instance to invoke serverSocketServices
serverSocketServices(io);

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, console.log(`Listening to ${PORT}!`));
