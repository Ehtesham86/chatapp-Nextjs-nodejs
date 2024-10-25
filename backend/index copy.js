// server.js
const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

const app = express();
const server = http.createServer(app);

// Set up CORS
app.use(cors({
  origin: "*",  // Allow all origins for simplicity. Adjust for security if needed.
}));

// Initialize Supabase client
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_KEY);

// Create a new Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*",  // Allow all origins
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection event
io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  // Example event listener for receiving a message from the client
  socket.on('message', async ({ user, message }) => {
    console.log('Message received:', message, 'from user:', user);
    
    // Insert message into Supabase
    const { data, error } = await supabase
      .from('receivedmessages')
      .insert([{ user, message }]);  // Assuming your table has columns named 'user' and 'message'

    if (error) {
      console.error('Error inserting message:', error);
    } else {
      console.log('Message stored in Supabase:', data);
    }

    // Broadcasting message back to all connected clients
    io.emit('message', { user, message: `Server: ${message}` });
  });

  // On disconnection
  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

// Create a GET endpoint to retrieve messages
app.get('/api/messages', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('receivedmessages')
      .select('*')  // Retrieve all columns; you can modify this to select specific ones
      .order('id', { ascending: false });  // Order by 'id' in descending order (if you have an id column)

    if (error) {
      throw error;
    }

    // Send the retrieved messages as a response
    res.status(200).json(data);
  } catch (error) {
    console.error('Error fetching messages:', error);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
});

// Starting the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on http://localhost:${PORT}`);
});
