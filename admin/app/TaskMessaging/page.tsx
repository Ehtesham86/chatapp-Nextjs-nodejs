"use client";
import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

let socket: Socket;

const TaskMessaging: React.FC = () => {
  const [message, setMessage] = useState<string>('');
  const [receivedMessages, setReceivedMessages] = useState<{ senderId: string, content: string,from:string }[]>([]);
  const [users, setUsers] = useState<any[]>([]);  // List of users
  const [chats, setChats] = useState<any[]>([]);  // List of chats
  const [messages, setMessages] = useState<any[]>([]);  // List of messages
  const [senderId, setSenderId] = useState<string>('d38e0cee-daa7-46e2-bfd1-d7f9c4683546');  // Your ID
  const [receiverId, setReceiverId] = useState<string>('3');  // John's ID
  const [chatId, setChatId] = useState<string>('');  // Selected chat ID
  const [leads, setLeads] = useState<any[]>([]);  // List of leads
   const [refresh, setRefresh] = useState<boolean>(false);
 
  useEffect(() => {
    // Fetch leads from the API
    const fetchLeads = async () => {
      try {
        const { data } = await axios.get('http://localhost:8000/api/getmessagesBySenderId?id=3');
        setReceivedMessages(data);
        console.log(data,'_____dataleads')
        // setSenderId(data[0].id);
      } catch (error) {
        console.error('Error fetching leads:', error);
      }
    };

    fetchLeads();
 
  }, [refresh]);
  useEffect(() => {
    // Fetch users from the API
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get(`http://localhost:8000/api/users`);
        setUsers(data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    // Initialize the Socket.IO client connection
    socket = io('http://localhost:8000');

    // Listen for incoming messages from the server
    socket.on('message', (msg: { sender: string; content: string }) => {
      setReceivedMessages(prevMessages => [...prevMessages, { senderId: msg.sender, content: msg.content }]);
    });

    fetchUsers();

    // Cleanup when the component is unmounted
    return () => {
      if (socket) socket.disconnect();
    };
  }, []);

  // Function to send a message to the server
  const sendMessage = () => {
    if (message.trim() && senderId && receiverId) {
      // Emit the message content to the server
      socket.emit('message', { content: message, sender: senderId, receiver: receiverId,from:'admin' });
      setMessage('');  // Clear the input field
    } else {
      alert("Message content and sender/receiver IDs are required.");
    }
  };

  // Function to fetch chats for a user
  const fetchChats = async (userId: string) => {
    try {
      const { data } = await axios.get(`http://localhost:8000/api/chats/${userId}`);
      setChats(data);
    } catch (error) {
      console.error('Error fetching chats:', error);
    }
  };

  // Function to fetch messages for a chat
  const fetchMessages = async (chatId: string) => {
    try {
      const { data } = await axios.get(`http://localhost:8000/api/messages/${chatId}`);
      setMessages(data);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  return (
    <div>
      <h1>Chat Application</h1>

      <div>
        <h2>Users</h2>
        <ul>
          {users.map((user) => (
            <li key={user.id} onClick={() => fetchChats(user.id)}>
              {user.full_name}<br/>
               (ID: {user.id})
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Chats</h2>
        <ul>
          {chats.map((chat) => (
            <li key={chat.id} onClick={() => fetchMessages(chat.id)}>
              Chat ID: {chat.id}
 
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h2>Messages in Chat</h2>
        <ul>
          {messages.map((msg) => (
            <li key={msg.id}>
              From {msg.sender}: {msg.content}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          style={{ padding: '10px', marginRight: '10px', color: 'black' }}
        />
        <button onClick={sendMessage} style={{ padding: '10px' }}>Send Message</button>
      </div>

      <div>
        <h2>Received Messages:</h2>
        {receivedMessages.map((msg, index) => (

          <p key={index} style={{color:msg.from=='admin'?'gray':''}}>
            {/* From {msg.senderId}: */}
             {msg.content}</p>
        ))}
      </div>
    </div>
  );
};

export default TaskMessaging;