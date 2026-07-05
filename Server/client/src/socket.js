// src/socket.js
// Single shared socket instance — import this everywhere

import { io } from "socket.io-client";

const SOCKET_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

const socket = io(SOCKET_URL, {
  autoConnect: false,      // connect manually when needed
  withCredentials: true,
});

export default socket;