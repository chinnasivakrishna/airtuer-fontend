import React, { useState } from 'react';
import { Search, Send } from 'lucide-react';

const MessagesContent = () => {
  const [selectedContact, setSelectedContact] = useState(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState({
    1: [
      { id: 1, text: "Hi, I'm interested in the position", sender: "them", time: "2:15 PM" },
      { id: 2, text: "Could you tell me more about your experience?", sender: "me", time: "2:20 PM" },
      { id: 3, text: "Thanks for considering my application", sender: "them", time: "2:30 PM" }
    ],
    2: [
      { id: 1, text: "Hello, I saw your job posting", sender: "them", time: "10:45 AM" },
      { id: 2, text: "When can we schedule an interview?", sender: "them", time: "11:00 AM" }
    ]
  });

  const dummyContacts = [
    {
      id: 1,
      name: 'John Doe',
      lastMessage: 'Thanks for considering my application',
      time: '2:30 PM',
      unread: true
    },
    {
      id: 2,
      name: 'Jane Smith',
      lastMessage: 'When can we schedule an interview?',
      time: '11:00 AM',
      unread: false
    }
  ];

  const handleSendMessage = () => {
    if (!message.trim() || !selectedContact) return;

    const newMessage = {
      id: messages[selectedContact.id].length + 1,
      text: message,
      sender: "me",
      time: new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })
    };

    setMessages(prev => ({
      ...prev,
      [selectedContact.id]: [...prev[selectedContact.id], newMessage]
    }));
    setMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="h-[calc(100vh-12rem)]">
      <div className="h-full bg-white rounded-lg shadow-md">
        <div className="h-full flex">
          {/* Contacts List */}
          <div className="w-1/3 border-r">
            <div className="p-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                  placeholder="Search messages..."
                />
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(100%-5rem)]">
              {dummyContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`p-4 cursor-pointer hover:bg-gray-50 ${
                    selectedContact?.id === contact.id ? 'bg-purple-50' : ''
                  }`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="flex justify-between">
                    <span className="font-medium">{contact.name}</span>
                    <span className="text-sm text-gray-500">{contact.time}</span>
                  </div>
                  <div className="text-sm text-gray-500 truncate">
                    {contact.lastMessage}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedContact ? (
              <>
                <div className="p-4 border-b">
                  <h3 className="font-medium">{selectedContact.name}</h3>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                  {messages[selectedContact.id].map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg px-4 py-2 ${
                          msg.sender === 'me'
                            ? 'bg-purple-600 text-white'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        <p>{msg.text}</p>
                        <span className={`text-xs ${
                          msg.sender === 'me' ? 'text-purple-200' : 'text-gray-500'
                        } block mt-1`}>
                          {msg.time}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="p-4 border-t">
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-600 focus:border-transparent"
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                    <button 
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                      onClick={handleSendMessage}
                    >
                      <Send className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center text-gray-500">
                Select a conversation to start messaging
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesContent;