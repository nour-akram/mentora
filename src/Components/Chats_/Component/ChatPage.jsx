import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
// import axios from "axios";
import "./ChatPage.css";
import ChatTopbar from './ChatTopbar'
const ChatPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatsData, setChatsData] = useState([]);

  

  // useEffect(() => {
  //   const fetchChatsData = async () => {
  //     try {
  //       const response = await fetch(
  //         "http://localhost:8000/api/chat/getChats",
  //         {
  //           method: "get",
  //         }
  //       ).then((response) => {
  //         //  setChatsData(response.data);
  //         console.log(response);
  //       });
  //       if (response) {
  //         throw new Error(`HTTP error! Status: ${response.status}`);
  //       }
  //       const data = await response.json();

  //       setChatsData(data);
  //     } catch (error) {
  //       console.error("Error fetching chat data:", error);
  //     }
  //   };

  //   fetchChatsData();
  // }, []);

  const handleChatClick = (chatId) => {
    setSelectedChat(chatId === selectedChat ? null : chatId);
  };

  const filteredChats = chatsData.filter(
    (chat) =>
      chat.lastMessage.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chat.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //  const chatsData2 = [
  //    {
  //      id: 1,
  //      name: "Nour Shazly",
  //      lastMessage: "Hello there!",
  //      time: "12:30 PM",
  //      read: true,
  //    },
  //    {
  //      id: 2,
  //      name: "Nour Shazly",
  //      lastMessage:
  //        "Hello there Hello thereHello thereHello thereHello thereHello thereHello thereHello thereHello thereHello thereHello thereHello there!",
  //      time: "12:30 PM",
  //      read: true,
  //    },]
  return (
    <div className="all-chat-container">
      <div className="chat-Container">
        <div className="chats-sidebar">
          <div className="fixed-div">
            <div className="header">
              <h2>Chats</h2>
            </div>
            <div className="search">
              <input
                type="text"
                placeholder="Search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
            </div>
          </div>
          <div className="chats-list">
            {filteredChats.map((chat) => (
              <div
                key={chat.id}
                className={`chat-item ${
                  selectedChat === chat.id ? "selected" : ""
                }`}
                onClick={() => handleChatClick(chat.id)}
              >
                <img
                  src={chat.profilePic} 
                  alt={chat.name}
                />
                <div className="info">
                  <div>
                    <span>
                      <h3>{chat.name}</h3>
                    </span>
                    <span>
                      <p>{chat.time}</p>
                    </span>
                  </div>
                  <span className="last-message">
                    <span className="last-message-text">
                      {chat.lastMessage}
                    </span>
                    <span>
                      {" "}
                      {chat.read && <FontAwesomeIcon icon={faCheck} />}
                    </span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="chat-page-container">
          <div className="chat-page">
              <ChatTopbar selectedChat={ selectedChat} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
