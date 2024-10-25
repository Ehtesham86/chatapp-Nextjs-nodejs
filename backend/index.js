const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const { v4: uuidv4 } = require('uuid'); // For generating unique IDs
const { error } = require('console');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
app.use(express.json()); // Add this line

// Set up CORS
app.use(cors({
  origin: "*",
  methods: ["GET", "POST"]
}));

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Create a new Socket.IO server
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const getOrCreateChat = async (senderId, receiverId) => {
  try {
    const { data: chat, error: chatError } = await supabase
      .from('chats')
      .select('*')
      .or(`latestmessage.eq.${receiverId},latestmessage.eq.${senderId}`)
      .single();

    if (!chat) {
      const newChatId = uuidv4();

      const { data: newChat, error: createChatError } = await supabase
        .from('chats')
        .insert([{ 
          id: newChatId,
          updated_at: new Date().toISOString(),
          created_at: new Date().toISOString(),
          latestmessage: `${senderId} initiated a chat`
        }])
        .select()
        .single();

      if (createChatError) throw new Error('Failed to create chat');
      return newChat;
    }
    return chat;
  } catch (error) {
    console.error('Error in getOrCreateChat:', error.message);
    throw error;
  }
};


io.on('connection', (socket) => {
  console.log('A user connected', socket.id);

  socket.on('message', async ({ content, sender, receiver,from }) => {
    try {
      if (!content || !sender || !receiver) throw new Error('Invalid message content or sender/receiver ID');

      const chat = await getOrCreateChat(sender, receiver);

      const { data: insertedMessage, error: messageError } = await supabase
        .from('messages')
        .insert([{ 
          sender,
          chat_id: chat.id,
          content,
          from,
          created_at: new Date().toISOString()
        }])
        .select();

      if (messageError) throw new Error(`Message insert error: ${messageError.message}`);

      const { error: updateChatError } = await supabase
        .from('chats')
        .update({ 
          latestmessage: content,
          updated_at: new Date().toISOString(),
          from:from
        })
        .eq('id', chat.id);

      if (updateChatError) throw new Error(`Chat update error: ${updateChatError.message}`);

      // Emit the message to the receiver
      socket.broadcast.emit('message', { sender, content ,from});
    } catch (error) {
      console.error('Error handling message:', error.message);
    }
  });

  socket.on('disconnect', () => {
    console.log('User  disconnected');
  });
});


// Get all users
app.get('/api/users', async (req, res) => {
  try {
    const { data: users, error } = await supabase
      .from('users')
      .select('*');

    if (error) throw error;
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get chats by user ID
app.get('/api/chats/:userId', async (req, res) => {
  const { userId } = req.params;
  
  try {
    const { data: chats, error } = await supabase
      .from('chats')
      .select('*')
      .or(`senderId.eq.${userId},receiverId.eq.${userId}`);

    if (error) throw error;
    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
 
// Get messages by chat ID
app.get('/api/messages/:chatId', async (req, res) => {
  const { chatId } = req.params;

  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_id', chatId);

    if (error) throw error;
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/allmessages', async (req, res) => {
  try {
    const { data: messages, error } = await supabase
      .from('messages')
      .select('*');

    // Check for any errors
    if (error) throw error;

    // Respond with the retrieved messages
    res.status(200).json(messages);
  } catch (error) {
    // Handle errors by responding with a 500 status and the error message
    res.status(500).json({ error: error.message });
  }
});
app.get('/api/getmessagesBySenderId', async (req, res) => {
  const { senderId } = req.query; // Retrieve senderId from query parameters

  try {
    // Build the query to select messages
    let query = supabase.from('messages').select('*');

    // If senderId is provided, filter messages by senderId
    if (senderId) {
      query = query.eq('sender', senderId);
    }

    const { data: messages, error } = await query; // Execute the query

    // Check for any errors
    if (error) throw error;

    // Respond with the retrieved messages
    res.status(200).json(messages);
  } catch (error) {
    // Handle errors by responding with a 500 status and the error message
    res.status(500).json({ error: error.message });
  }
});

// Get all leads
app.get('/api/leads', async (req, res) => {
  try {
    const { data: leads, error } = await supabase
      .from('leads')
      .select('*');

    if (error) throw error;
    res.status(200).json(leads);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
app.post('/api/leads', async (req, res) => {
  console.log('Request body:', req.body); // Log the request body

  try {
    let leads = req.body; // The leads data from the request body

    // Check if the leads data is an array; if not, convert it to an array
    if (!Array.isArray(leads)) {
      leads = [leads]; // Wrap the single lead object in an array
    }

    // Validate that we have valid leads data
    if (leads.length === 0) {
      return res.status(400).json({ error: 'Invalid or empty leads data' });
    }

    // Insert the leads data into the leads table
    const { data, error } = await supabase
      .from('leads')
      .insert(leads)
      .select();

    if (error) {
      console.error('Error inserting leads:', error);
      throw error;
    }

    res.status(201).json({
      message: 'Leads inserted successfully',
      data: data
    });
  } catch (error) {
    res.status(500).json({
      error: error.message || 'An error occurred while inserting leads'
    });
  }
});



// Starting the server
const PORT = process.env.PORT || 8000;
server.listen(PORT, () => {
  console.log(`Socket.IO server running on http://localhost:${PORT}`);
});
