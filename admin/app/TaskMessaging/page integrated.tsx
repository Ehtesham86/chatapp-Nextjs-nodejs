'use client'
import React, { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import axios from 'axios';

let socket: Socket;

interface Contact {
  id: number;
  name: string;
}

const ChatComponent = () => {
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    const [message, setMessage] = useState<string>('');
    const [username, setUsername] = useState<string>('');
    const [receivedMessages, setReceivedMessages] = useState<{ user: string; message: string }[]>([]);
    console.log(username,'contactusername')
    useEffect(() => {
        // Fetch users from the API
        const fetchUsers = async () => {
            try {
                const { data } = await axios.get('http://localhost:8000/api/users');
                setContacts(data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        // Initialize the Socket.IO client connection
        socket = io('http://localhost:8000');

        // Listen for incoming messages from the server
        socket.on('message', (msg: { user: string; message: string }) => {
            setReceivedMessages((prev) => [...prev, msg]); // Append new message to the list
        });

        fetchUsers();

        // Cleanup when the component is unmounted
        return () => {
            if (socket) socket.disconnect();
        };
    }, []);

    // Function to send a message to the server
// Function to send a message to the server
const sendMessage = () => {
  if (message?.trim() && username?.trim() && selectedContact) {
      socket.emit('message', { user: username, message, receiver: selectedContact.id });
      
      setMessage(''); // Clear the input field
  } else {
      console.warn('Message or Username is undefined or empty');
  }
};

    // Function to handle contact selection
    const handleContactClick = (contact: Contact) => {
      console.log(contact,'contact+_+__')
        setSelectedContact(contact);
        setUsername(contact.full_name); // Set username to the selected contact's name
    };

    return (
        <div className="w-full h-screen">
            <div className="flex h-full">
                <div className="flex-1 bg-gray-100 w-full h-full">
                    <div className="main-body container m-auto w-11/12 h-full flex flex-col">
                        <div className="py-4 flex-2 flex flex-row">
                            {/* Header and Status */}
                        </div>

                        <div className="main flex-1 flex flex-col">
                            <div className="hidden lg:block heading flex-2">
                                <h1 className="text-3xl text-gray-700 mb-4">Chat</h1>
                            </div>

                            <div className="flex-1 flex h-full">
                                <div className="sidebar hidden lg:flex w-1/3 flex-2 flex-col pr-6">
                                    <div className="search flex-2 pb-6 px-2">
                                        <input type="text" className="outline-none py-2 block w-full bg-transparent border-b-2 border-gray-200" placeholder="Search" />
                                    </div>
                                    <div className="flex-1 h-full overflow-auto px-2">
                                        {contacts.map((contact, index) => (
                                            <div 
                                                key={index} 
                                                className={`entry cursor-pointer transform hover:scale-105 duration-300 bg-white mb-4 rounded p-4 flex shadow-md ${selectedContact === contact ? 'border-l-4 border-red-500' : ''}`} 
                                                onClick={() =>{ handleContactClick(contact)
console.log(contact,'contact____')
                                                  }
                                                }
                                            >
                                                <div className="flex-2">
                                                    <div className="w-12 h-12 relative">
                                                        <img className="w-12 h-12 rounded-full mx-auto" src="../resources/profile-image.png" alt="chat-user" />
                                                        <span className="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white"></span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 px-2">
                                                    <div className="truncate w-32 "><span className="text-gray-800">{contact.full_name}</span></div>
                                                    <div><small className="text-gray-600">Yea, Sure!</small></div>
                                                </div>
                                                <div className="flex-2 text-right">
                                                    <div><small className="text-gray-500">15 April</small></div>
                                                    <div>
                                                        <small className="text-xs bg-red-500 text-white rounded-full h-6 w-6 leading-6 text-center inline-block">
                                                            {index === 2 ? '0' : index === 1 ? '10' : index === 0 ? '23' : ''}
                                                        </small>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="chat-area flex-1 flex flex-col">
                                    {selectedContact ? (
                                        <>
                                            <div className="flex-3">
                                                <h2 className="text-xl py-1 mb-8 border-b-2 border-gray-200">
                                                    Chatting with <b>{selectedContact.full_name}</b>
                                                </h2>
                                            </div>
                                            <div className="messages flex-1 overflow-auto">
                                                {receivedMessages.map((message, index) => (
                                                    <div key={index} className={`message mb-4 flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                                                        <div className={`flex-2 ${index % 2 === 0 ? '' : 'order-last'}`}>
                                                            <div className="w-12 h-12 relative">
                                                                <img className="w-12 h-12 rounded-full mx-auto" src="../resources/profile-image.png" alt="chat-user" />
                                                                <span className="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white"></span>
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 px-2">
                                                            <div className={`message-content p-3 ${index % 2 === 0 ? 'bg-gray-200' : 'bg-red-500 text-white'} text-black rounded-lg`}>{message.message}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Default message displayed above the input box */}
                                            <div className="flex-1 flex items-center justify-center">
    <div className="send-box flex mt-4 w-full"> {/* Added w-full to ensure full width */}
        <input 
        onChange={(e) => setMessage(e.target.value)}
            type="text" 
            className="outline-none py-2 block flex-1 bg-transparent border border-gray-200 rounded-l-lg text-black" 
            placeholder="Type a message..." 
        />
        <button className="bg-red-500 text-white rounded-r-lg px-4" onClick={sendMessage}>Send</button>
    </div>
</div>
 
                                        
                                        </>
                                    ) : (
                                        <div className="flex-1 flex items-center justify-center">
                                            <h2 className="text-xl text-black">Your Podium chat is here</h2>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ChatComponent;