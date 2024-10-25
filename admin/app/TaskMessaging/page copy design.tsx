'use client'
import React, { useState,useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
let socket: Socket;

interface Contact {
  id: number; // Add other properties as needed
  messages: string[]; // Assuming messages is an array of strings
  name: string; // Add the name property here

}
const ChatComponent = () => {
    // State to hold the selected contact
    const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
    console.log(selectedContact,'_____selectedContact')
    const [message, setMessage] = useState<string>('');
    const [username, setUsername] = useState<string>(''); // New state for username
    const [receivedMessages, setReceivedMessages] = useState<{ user: string; message: string }[]>([]);
    console.log(message,'_____message')
    console.log(receivedMessages,'_____receivedMessages')

  
    useEffect(() => {
      // Initialize the Socket.IO client connection
      socket = io('http://localhost:8000/api/messages');
  
      // Listen for incoming messages from the server
      socket.on('message', (msg: { user: string; message: string }) => {
        setReceivedMessages((prev) => [...prev, msg]); // Append new message to the list
      });
  
      // Cleanup when the component is unmounted
      return () => {
        if (socket) socket.disconnect();
      };
    }, []);
  
    // Function to send a message to the server
    const sendMessage = () => {
      if (message.trim() && username.trim()) {
        socket.emit('message', { user: username, message }); // Send both user and message
        setMessage('');  // Clear the input field
      }
    };
    // Sample contact data
    const contacts = [
        {
            name: 'Ryann Remo',
            messages: [
                'Hi there!',
                'How can I help you?',
                'Let’s schedule a meeting.',
            ],
        },
        {
            name: 'Karp Bonolo',
            messages: [
                'Hello!',
                'I have a question about our project.',
                'Can we discuss it later?',
            ],
        },
        {
            name: 'Mercedes Yemelyan',
            messages: [
                'Good morning!',
                'What time is our call today?',
            ],
        },
        {
            name: 'Cadi Kajetán',
            messages: [
                'Hey, I need your input on the design.',
            ],
        },
        {
            name: 'Rina Samuel',
            messages: [
                'Thanks for the update!',
                'Looking forward to our meeting.',
            ],
        },
    ];

    // Function to handle contact selection
    const handleContactClick = (contact:any) => {
        setSelectedContact(contact);
    };

    return (
        <div className="w-full h-screen">
            <div className="flex h-full">
                <div className="flex-1 bg-gray-100 w-full h-full">
                    <div className="main-body container m-auto w-11/12 h-full flex flex-col">
                        <div className="py-4 flex-2 flex flex-row">
                            <div className="flex-1">
                                <span className="xl:hidden inline-block text-gray-700 hover:text-gray-900 align-bottom">
                                    <span className="block h-6 w-6 p-1 rounded-full hover:bg-gray-400">
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M4 6h16M4 12h16M4 18h16"></path>
                                        </svg>
                                    </span>
                                </span>
                                <span className="lg:hidden inline-block ml-8 text-gray-700 hover:text-gray-900 align-bottom">
                                    <span className="block h-6 w-6 p-1 rounded-full hover:bg-gray-400">
                                        <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24">
                                            <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                        </svg>
                                    </span>
                                </span>
                            </div>
                            <div className="flex-1 text-right">
                                <span className="inline-block text-gray-700">
                                    Status: <span className="inline-block align-text-bottom w-4 h-4 bg-green-400 rounded-full border-2 border-white"></span> <b>Online</b>
                                    <span className="inline-block align-text-bottom">
                                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4">
                                            <path d="M19 9l-7 7-7-7"></path>
                                        </svg>
                                    </span>
                                </span>

                                <span className="inline-block ml-8 text-gray-700 hover:text-gray-900 align-bottom">
                                    <span className="block h-6 w-6 p-1 rounded-full hover:bg-gray-400">
                                        <svg fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" className="w-4 h-4">
                                            <path d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"></path>
                                        </svg>
                                    </span>
                                </span>
                            </div>
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
                                                onClick={() => handleContactClick(contact)}
                                            >
                                                <div className="flex-2">
                                                    <div className="w-12 h-12 relative">
                                                        <img className="w-12 h-12 rounded-full mx-auto" src="../resources/profile-image.png" alt="chat-user" />
                                                        <span className="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white"></span>
                                                    </div>
                                                </div>
                                                <div className="flex-1 px-2">
                                                    <div className="truncate w-32"><span className="text-gray-800">{contact.name}</span></div>
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
                                                    Chatting with <b>{selectedContact.name}</b>
                                                </h2>
                                            </div>
                                            <div className="messages flex-1 overflow-auto">
                                                {selectedContact.messages.map((message, index) => (
                                                    <div key={index} className={`message mb-4 flex ${index % 2 === 0 ? 'justify-start' : 'justify-end'}`}>
                                                        <div className={`flex-2 ${index % 2 === 0 ? '' : 'order-last'}`}>
                                                            <div className="w-12 h-12 relative">
                                                                <img className="w-12 h-12 rounded-full mx-auto" src="../resources/profile-image.png" alt="chat-user" />
                                                                <span className="absolute w-4 h-4 bg-gray-400 rounded-full right-0 bottom-0 border-2 border-white"></span>
                                                            </div>
                                                        </div>
                                                        <div className="flex-1 px-2">
                                                            <div className={`message-content p-3 ${index % 2 === 0 ? 'bg-gray-200' : 'bg-red-500 text-white'} text-black rounded-lg`}>{message}</div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            {/* Default message displayed above the input box */}
                                            <div className="flex-1 flex items-center justify-center">
    <div className="send-box flex mt-4 w-full"> {/* Added w-full to ensure full width */}
        <input 
        onChange={(e) => {setMessage(e.target.value)
          setUsername(selectedContact.name)}

        }
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
