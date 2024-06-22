import React, { useState, useEffect, useRef } from 'react';
import "./Chat.css";
import imageTraining from "../../../../../assets/image react 1.png";
import send from "../../../../../assets/sendGroup.png";
import attachement from "../../../../../assets/attachementGroup.png";
import exit from "../../../../../assets/exitWhite.png";
import editIcon from "../../../../../assets/editSession.png";
import deleteIcon from "../../../../../assets/deleteSession.png";
import axiosInstance from "../../../../../api/axiosConfig";
import Cookies from "universal-cookie";

export const ChatTraining = ({ trainingId, trainingName, trainigImage }) => {
  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [attachedFile, setAttachedFile] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [confirm, setConfirm] = useState(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    setCurrentMessage(e.target.value);
  };

  const handleFileInputChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAttachedFile(file);
      setPreviewFile(file);
    }
  };

  const cookies = new Cookies();
  const token = cookies.get("Bearer");

  const handleSendClick = async () => {
    if (currentMessage.trim() || attachedFile) {
      const formData = new FormData();
      formData.append('message', currentMessage.trim());
      if (attachedFile) {
        formData.append('files', attachedFile);
      }

      try {
        if (selectedMessageId) {
          const editMessage = {
            message: currentMessage.trim()
          };
          const response = await axiosInstance.put(`/chat/editMessage/${selectedMessageId}`, editMessage, {
            headers: {
              Authorization: "Bearer " + token,
            },
          });
          console.log('Edit Message Response:', response.data);
          fetchMessages();
          setSelectedMessageId(null);
        } else {
          const response = await axiosInstance.post(`/training/sendMessage/${trainingId}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: "Bearer " + token,
            },
          });
          console.log('Send Message Response:', response.data);
          fetchMessages();
        }

        setCurrentMessage("");
        setAttachedFile(null);
        setPreviewFile(null);
      } catch (error) {
        console.error('Error sending message:', error.response ? error.response.data : error.message);
      }
    }
  };

  const handleAttachmentClick = (file) => {
    if (file.fileType === "pdf") {
      setConfirm(file);
    } else {
      setPreviewFile(file);
      setShowPopup(true);
    }
  };

  const handleCloseConfirmation = () => {
    setConfirm(null);
  };

  const handleDownload = (file) => {
    const url = URL.createObjectURL(file);
    const link = document.createElement('a');
    link.href = url;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    handleCloseConfirmation();
  };

  const handleDoubleClick = (id) => {
    if (selectedMessageId === id) {
      setSelectedMessageId(null);
    } else {
      setSelectedMessageId(id);
    }
  };

  const handleEditClick = (id) => {
    const messageToEdit = messages.find((message) => message._id === id);
    setCurrentMessage(messageToEdit.message);
    setAttachedFile(messageToEdit.files);
    setSelectedMessageId(messageToEdit._id);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const fetchMessages = async () => {
    try {
      const response = await axiosInstance.get(`/training/getMessages/${trainingId}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      console.log('Fetch Messages Response:', response.data.data.messages);

      const messagesData = Array.isArray(response.data.data.messages) ? response.data.data.messages : [];
      setMessages(messagesData);
    } catch (error) {
      console.error('Error fetching messages:', error.response ? error.response.data : error.message);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);


  const handleDeleteClick = async (id) => {
    try {
      await axiosInstance.delete(`/chat/deleteMessage/${id}/${trainingId}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      fetchMessages();
      setSelectedMessageId(null);
    } catch (error) {
      console.error('Error deleting message:', error.response ? error.response.data : error.message);
    }
  };

  return (
    <div className='container_chat_group'>
      <div className="header_chat_group">
        <div className="left_part">
          <img src={trainigImage ? trainigImage : imageTraining} alt="not found" />
          <p>{trainingName}</p>
        </div>
        {selectedMessageId && (
          <div className="imageMenu">
            <img src={editIcon} alt="Edit" onClick={() => handleEditClick(selectedMessageId)} />
            <img src={deleteIcon} alt="Delete" onClick={() => handleDeleteClick(selectedMessageId)} />
          </div>
        )}
      </div>
      <div className="body_chat_group">
        {messages.map((message) => (
          <div key={message._id} className="message">
            {message.files && message.files.map((file, index) => (
              <div key={index} className="file-message">
                {file.fileType === "image" && (
                  <img
                    src={file.filePath}
                    alt="Attached Image"
                    style={{ cursor: "pointer", maxWidth: "100%", maxHeight: "200px" }}
                    onClick={() => handleAttachmentClick(file)}
                  />
                )}
                {file.fileType === "pdf" && (
                  <embed
                    src={file.filePath}
                    type="application/pdf"
                    width="100%"
                    height="200px"
                    style={{ cursor: "pointer" }}
                    onClick={() => handleAttachmentClick(file)}
                  />
                )}
              </div>
            ))}
            {message.message && (
              <p onDoubleClick={() => handleDoubleClick(message._id)}>{message.message}</p>
            )}
          </div>
        ))}
      </div>
      <div className="fixed-input-field_group">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type your message..."
          value={currentMessage}
          onChange={handleInputChange}
        />
        <div className="icons_group">
          <label htmlFor="file-input">
            <img src={attachement} alt="Attachment" />
          </label>
          <input id="file-input" type="file" style={{ display: "none" }} onChange={handleFileInputChange} />
          <img src={send} alt="Send" onClick={handleSendClick} />
        </div>
      </div>

      {showPopup && (
        <div className="attachment-popup">
          <div className="popup-content">
            <img src={exit} alt='Close' onClick={() => setShowPopup(false)} className='closeIcon' />
            {previewFile && previewFile.fileType === "image" && (
              <img src={previewFile.filePath} alt="Selected Image" className='imageShow' />
            )}
          </div>
        </div>
      )}
      {showPopup && <div className="overlay"></div>}

      {confirm && (
        <div className="attachment-popup-confirm">
          <div className="popup-content">
            <h2>Are you sure you want to download this file?</h2>
            <div className="buttons">
              <button className='download' onClick={() => handleDownload(confirm)}>Download</button>
              <button className='canceled' onClick={handleCloseConfirmation}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      {confirm && <div className="overlay"></div>}
    </div>
  );
};
