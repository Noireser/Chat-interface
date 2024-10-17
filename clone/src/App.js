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
  const [loggedIn, setLoggedIn] = useState(false);
  const [creatingAccount, setCreatingAccount] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [users, setUsers] = useState([]); // Store all login data
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatHistory, setChatHistory] = useState([{ id: 1, title: 'New Chat', messages: [] }]);
  const [currentChatId, setCurrentChatId] = useState(1);

  // Load user data from the server
  const loadUsers = () => {
    fetch('http://localhost:5000/api/users')
      .then((response) => response.json())
      .then((data) => {
        console.log('Fetched users:', data); // Debugging log
        if (Array.isArray(data)) {
          setUsers(data);
        } else {
          console.error('Fetched data is not an array:', data);
        }
      })
      .catch((error) => console.error('Error fetching user data:', error));
  };

  useEffect(() => {
    loadUsers(); // Load users on initial render
  }, []);

  // Handle login validation
  const handleLogin = () => {
    console.log('Attempting to log in with:', { username, password }); // Debugging log
    console.log('Current users:', users); // Debugging log to see the users array

    // Check if users is an array
    if (Array.isArray(users)) {
      const user = users.find((user) => user.username === username && user.password === password);
      if (user) {
        setLoggedIn(true);
        console.log('Login successful:', user); // Debugging log
      } else {
        alert('Invalid username or password');
        console.log('Login failed. User not found.'); // Debugging log
      }
    } else {
      console.error('Users is not an array:', users);
      alert('User data is not available');
    }
  };

  // Handle account creation
  const handleCreateAccount = () => {
    const newUser = { username, password };
    fetch('http://localhost:5000/api/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newUser),
    })
      .then((response) => {
        if (response.ok) {
          alert('Account created successfully');
          loadUsers(); // Refresh the user list after account creation
          setCreatingAccount(false);
          setUsername('');
          setPassword('');
        } else {
          return response.text().then((text) => {
            throw new Error(text);
          });
        }
      })
      .catch((error) => {
        alert(error.message);
      });
  };

  // Create a new chat
  const handleNewChat = () => {
    const existingNewChat = chatHistory.find((chat) => chat.title === 'New Chat');

    if (existingNewChat) {
      setMessages(existingNewChat.messages);
      setCurrentChatId(existingNewChat.id);
    } else {
      if (messages.length > 0) {
        setChatHistory((prevHistory) =>
          prevHistory.map((chat) =>
            chat.id === currentChatId ? { ...chat, messages } : chat
          )
        );
      }

      const newChatId = chatHistory.length + 1;
      const newChat = { id: newChatId, title: 'New Chat', messages: [] };
      setChatHistory([...chatHistory, newChat]);
      setCurrentChatId(newChatId);
      setMessages([]);
    }
  };

  // Load an existing chat from history
  const handleLoadChat = (chat) => {
    setMessages(chat.messages);
    setCurrentChatId(chat.id);
  };

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

  // Login page rendering
  if (!loggedIn) {
    return (
      <div className="login-container">
        <div className="login-box">
          <h2>{creatingAccount ? 'Create Account' : 'Login'}</h2>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {creatingAccount ? (
            <button onClick={handleCreateAccount}>Create Account</button>
          ) : (
            <>
              <button onClick={handleLogin}>Login</button>
              <button onClick={() => setCreatingAccount(true)}>Create Account</button>
            </>
          )}
        </div>
      </div>
    );
  }

  // Main chat interface rendering
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
