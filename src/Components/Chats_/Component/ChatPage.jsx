import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck, faSearch } from "@fortawesome/free-solid-svg-icons";
import Cookies from "universal-cookie";
import "./ChatPage.css";
import ChatTopbar from "./ChatTopbar";
import axiosInstance from "../../../api/axiosConfig";

const ChatPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedChat, setSelectedChat] = useState(null);
  const [chatsData, setChatsData] = useState([]);
  const [chatDetails, setChatDetails] = useState(null);
  const [userName, setUserName] = useState("");

  const cookies = new Cookies();
  const token = cookies.get("Bearer");

  useEffect(() => {
    const fetchChatsData = async () => {
      try {
        const response = await axiosInstance.get("/chat/getChats", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (Array.isArray(response.data.data)) {
          setChatsData(response.data.data);
        } else {
          console.error("Fetched data is not an array:", response.data.data);
        }
      } catch (error) {
        console.error("Error fetching chat data:", error);
      }
    };

    fetchChatsData();
  }, [token]);

  const fetchChatData = async (chatId) => {
    try {
      const response = await axiosInstance.get(`/chat/findChat/${chatId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = response.data;
      const firstName = result.data.users[1].firstName;
      const lastName = result.data.users[1].lastName;
      const userName = `${firstName} ${lastName}`;
      
      setUserName(userName);
      setSelectedChat(result.data._id);
    } catch (error) {
      console.error("Error fetching chat content:", error);
    }
  };

  const handleChatClick = async (chatId) => {
    setSelectedChat(chatId === selectedChat ? null : chatId);
    if (chatId !== selectedChat) {
      await fetchChatData(chatId);
    } else {
      setChatDetails(null);
    }
  };

  const filteredChats = chatsData.filter((chat) => {
    return (
      (chat.last_message?.message
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
        chat.user?.some((user) =>
          `${user.firstName} ${user.lastName}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase())
        )) ??
      false
    );
  });

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
            {filteredChats.length > 0 ? (
              filteredChats.map((chat) => (
                <div
                  key={chat._id}
                  className={`chat-item ${
                    selectedChat === chat._id ? "selected" : ""
                  }`}
                  onClick={() => handleChatClick(chat._id)}
                >
                  <div className="info">
                    <div>
                      <span>
                        <h3>
                          {chat.user?.map((user, index) => (
                            <span key={user._id}>
                              {user.firstName} {user.lastName}
                              {index < (chat.user?.length ?? 0) - 1 && ", "}
                            </span>
                          ))}
                        </h3>
                      </span>
                      <span>
                        <p>
                          {chat.last_message &&
                            new Date(
                              chat.last_message.createdAt
                            ).toLocaleString()}
                        </p>
                      </span>
                    </div>
                    <span className="last-message">
                      <span className="last-message-text">
                        {chat.last_message?.message}
                      </span>
                      <span>
                        {chat.last_message?.isRead && (
                          <FontAwesomeIcon icon={faCheck} />
                        )}
                      </span>
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p>No chats found.</p>
            )}
          </div>
        </div>
        <div className="chat-page-container">
          <div className="chat-page">
            <ChatTopbar selectedChat={selectedChat} chatDetails={chatDetails} userName={userName} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
