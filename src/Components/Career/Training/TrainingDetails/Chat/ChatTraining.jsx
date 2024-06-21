import {React,useState} from 'react'
import "./Chat.css"
import imageTraining from "../../../../../assets/image react 1.png"
// import menu from "../../../../../assets/menuChatGroup.png"
import send from "../../../../../assets/sendGroup.png"
import attachement from"../../../../../assets/attachementGroup.png"
import exit from"../../../../../assets/exitWhite.png"
import editIcon from "../../../../../assets/editSession.png"; 
import deleteIcon from "../../../../../assets/deleteSession.png";
export const ChatTraining = () => {

  const [messages, setMessages] = useState([]);
  const [currentMessage, setCurrentMessage] = useState("");
  const [attachedFiles, setAttachedFiles] = useState([]);
  const [attachedFileNames, setAttachedFileNames] = useState([]);
  const [previewFiles, setPreviewFiles] = useState([]);

  const handleInputChange = (e) => {
    setCurrentMessage(e.target.value);
  };

  const handleFileInputChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (newFiles.length > 0) {
      const names = newFiles.map(file => file.name);
      setAttachedFiles([...attachedFiles, ...newFiles]);
      setAttachedFileNames([...attachedFileNames, ...names]);
      setPreviewFiles([...previewFiles, ...newFiles]);
    }
  };


  const handleSendClick = () => {
    if (currentMessage.trim() || attachedFiles.length > 0) {
      const message = {
        text: currentMessage.trim(),
        files: attachedFiles,
      };
      setMessages([...messages, message]);
      setCurrentMessage("");
      setAttachedFiles([]);
      setAttachedFileNames([]);
      setPreviewFiles([]);
    }
  };


  const [showPopup, setShowPopup] = useState(false);
  const[Confirm,setConfirm]=useState()

  const handleAttachmentClick = (file) => {
    if (file.type.startsWith('application/pdf')) {
      setConfirm(file); 
    } else {
      setPreviewFiles([file]); 
      setShowPopup(true);
    }
  };

  const handleCloseConfirmation = () => {
    setConfirm(null); 
  };

  // console.log(showPopup,attachedFiles,previewFiles)
  console.log(Confirm)


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


  const [selectedMessageIndex, setSelectedMessageIndex] = useState(null);
  const handleDoubleClick = (index) => {
    setSelectedMessageIndex(index);
  };

  const handleEditClick = (index) => {
    const messageToEdit = messages[index];
    setCurrentMessage(messageToEdit.text);
    setAttachedFiles(messageToEdit.files);
    setSelectedMessageIndex(null);
    setMessages(messages.filter((_, i) => i !== index));
  };

  const handleDeleteClick = (index) => {
    setMessages(messages.filter((_, i) => i !== index));
    setSelectedMessageIndex(null);
  };
  return (
    <div className='container_chat_group'>
      <div className="header_chat_group">
         <div className="left_part">
            <img src={imageTraining} alt="not found" />
            <p>name training</p>
         </div>
         {selectedMessageIndex !== null && (
           <div className="imageMenu">
             <img src={editIcon} alt="Edit" onClick={() => handleEditClick(selectedMessageIndex)} />
             <img src={deleteIcon} alt="Delete" onClick={() => handleDeleteClick(selectedMessageIndex)} />
           </div>
         )}
      </div>
      <div className="body_chat_group">
        {messages.map((message, index) => (
          <div key={index} className="message" onDoubleClick={() => handleDoubleClick(index)}>
           
            {message.files && message.files.map((file, i) => (
              <div key={i} className="file-message">
                {file.type.startsWith('image/') && (
                  <img src={URL.createObjectURL(file)}  alt="Attached Image" width="100%" height="200px" onClick={() => handleAttachmentClick(file)} style={{cursor:"pointer"}} />
                )}
                {file.type.startsWith('application/pdf') && (
                  <embed src={URL.createObjectURL(file)} type="application/pdf" width="100%" height="200px" onClick={()=>handleAttachmentClick(file)} style={{cursor:"pointer"}}/>
                )}
              </div>
            ))}
             {message.text && <p>{message.text}</p>}
             
          </div>
        ))}
      </div>
      <div className="fixed-input-field_group">
            <input
              type="text"
              placeholder="Type your message..."
              value={currentMessage}
              onChange={handleInputChange}
            />
            <div className="icons_group">
                 <label htmlFor="file-input">
                     <img src={attachement} alt="not found" />
                 </label>
                <input id="file-input"  type="file" style={{ display: "none" }} onChange={handleFileInputChange} />
                <img src={send} alt="not found" onClick={handleSendClick} />
            </div>
            
      </div>


      {showPopup && (
        <div className="attachment-popup">
          <div className="popup-content">
            
            <img src={exit} alt='not found' onClick={() => setShowPopup(false)} className='closeIcon'/>
            {previewFiles.length > 0 && (
              <>
                {previewFiles.map((file, index) => (
                  <div key={index}>
                    {file.type.startsWith('image/') && (
                      <img src={URL.createObjectURL(file)} alt="Selected Image"  className='imageShow' />
                    )}
                    
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
      {showPopup&&<div className="overlay"></div>}

      {Confirm&&
         <div className="attachment-popup-cofirm">
           <div className="popup-content">
              <h2>Are you sure you want to download this file?</h2>
              <div className="buttons">
                 <button className='donwload' onClick={() => handleDownload(Confirm)}>Download</button>
                 <button className='canceled' onClick={handleCloseConfirmation} >Canceled</button>
              </div>
          </div>
         </div>
      }
      {Confirm&&<div className="overlay"></div>}
    </div>
  )
}
