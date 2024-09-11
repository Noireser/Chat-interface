import React, { useState, useEffect } from 'react';
import './App.css';
import gptlogo from './assets/chatgpt.svg';
import addBtn from './assets/add-30.png';
import msgIcon from './assets/message.svg';
import home from './assets/home.svg';
import saved from './assets/bookmark.svg';
import rocket from './assets/rocket.svg';
import sendBtn from './assets/send.svg';
import userIcon from './assets/user-icon.png';
import gptImgLogo from './assets/chatgptLogo.svg';

function App() {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([{ id: 1, title: 'New Chat', messages: [] }]);
  const [currentChatId, setCurrentChatId] = useState(1);

  // Handle sending user message and bot response
  const handleSendMessage = () => {
    if (inputMessage.trim()) {
      const newMessage = { text: inputMessage, sender: 'user' };
      const botResponse = { text: 'Hi', sender: 'bot' }; // Standard bot response

      setMessages((prevMessages) => {
        const updatedMessages = [...prevMessages, newMessage, botResponse];

        // Update the current chat in the chat history with new messages
        setChatHistory((prevHistory) =>
          prevHistory.map((chat) =>
            chat.id === currentChatId ? { ...chat, messages: updatedMessages } : chat
          )
        );

        return updatedMessages;
      });

      setInputMessage(''); // Clear input

      // Update the chat title with the first user message if it's still "New Chat"
      setChatHistory((prevHistory) =>
        prevHistory.map((chat) =>
          chat.id === currentChatId && chat.title === 'New Chat'
            ? { ...chat, title: newMessage.text }
            : chat
        )
      );
    }
  };

  // Handle Enter key to send message
  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleSendMessage();
    }
  };

  // Save current chat and start a new one
  const handleNewChat = () => {
    // Check if a "New Chat" already exists
    const existingNewChat = chatHistory.find((chat) => chat.title === 'New Chat');

    if (existingNewChat) {
      // If there's already a "New Chat," switch to it
      setMessages(existingNewChat.messages);
      setCurrentChatId(existingNewChat.id);
    } else {
      // Save the current chat if there are messages
      if (messages.length > 0) {
        setChatHistory((prevHistory) =>
          prevHistory.map((chat) =>
            chat.id === currentChatId ? { ...chat, messages } : chat
          )
        );
      }

      // Create a new chat entry
      const newChatId = chatHistory.length + 1;
      const newChat = { id: newChatId, title: 'New Chat', messages: [] };
      setChatHistory([...chatHistory, newChat]);
      setCurrentChatId(newChatId);
      setMessages([]);
    }
  };

  // Load a chat from history
  const handleLoadChat = (chat) => {
    setMessages(chat.messages);
    setCurrentChatId(chat.id);
  };

  // Initialize with a default chat log on the first render
  useEffect(() => {
    if (chatHistory.length === 0) {
      const initialChat = { id: 1, title: 'New Chat', messages: [] };
      setChatHistory([initialChat]);
      setCurrentChatId(1);
    }
  }, [chatHistory.length]);

  return (
    <div className="App">
      <div className="sideBar">
        <div className="upperSide">
          <div className="upperSideTop">
            <img src={gptlogo} alt="logo" className="logo" />
            <span className="brand">Chat Interface</span>
          </div>
          <button className="midBtn" onClick={handleNewChat}>
            <img src={addBtn} alt="new chat" className="addBtn" />
            New Chat
          </button>

          <div className="upperSideBottom">
            <div className="chatHistory">
              {chatHistory.map((chat) => (
                <button
                  key={chat.id}
                  className="query"
                  onClick={() => handleLoadChat(chat)}
                >
                  <img src={msgIcon} alt="Query" className="addBtn" />
                  {chat.title}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="LowerSide">
          <div className="listItems">
            <img src={home} alt="home" className="listItemsImg" />
            Home
          </div>
          <div className="listItems2">
            <img src={saved} alt="saved" className="listItemsImg2" />
            Saved
          </div>
          <div className="listItems3">
            <img src={rocket} alt="upgrade" className="listItemsImg3" />
            Upgrade to Pro
          </div>
        </div>
      </div>

      <div className="Main">
        <div className="chats">
          {messages.map((message, index) => (
            <div
              key={index}
              className={`chat ${message.sender === 'bot' ? 'bot' : ''}`}
            >
              <img
                src={message.sender === 'bot' ? gptImgLogo : userIcon}
                className="userIcon"
                alt=""
              />
              <p className="txt">{message.text}</p>
            </div>
          ))}
        </div>
        <div className="input-container">
          <input
            type="text"
            placeholder="Type your message..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button onClick={handleSendMessage}>
            <img src={sendBtn} alt="send it" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;
