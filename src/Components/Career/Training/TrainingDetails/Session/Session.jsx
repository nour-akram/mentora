import React, { useState, useEffect } from 'react';
import "./Session.css";
import addTrainingIcon from "../../../../../assets/addTrainingIcon.png";
import nosession from "../../../../../assets/no session Yet.png";
import { PopupSession } from './Popup/PopupSession';
import link from "../../../../../assets/linkSession.png";
import edit from "../../../../../assets/editSession.png";
import delet from "../../../../../assets/deleteSession.png";
import { PopupDetails } from './PopupDetails/PopupDetails';

export const Session = () => {
  const [showPopupSession, setShowPopupSession] = useState(false);
  const [sessions, setSessions] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedSession, setSelectedSession] = useState(null);
  const [editSession, setEditSession] = useState(null); 

  useEffect(() => {
    const savedSessions = localStorage.getItem('sessions');
    if (savedSessions) {
      setSessions(JSON.parse(savedSessions));
    }
    setIsDataLoaded(true);
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem('sessions', JSON.stringify(sessions));
    }
  }, [sessions, isDataLoaded]);


  const handleShowPopupSession = () => {
    setShowPopupSession(!showPopupSession);
  };

  const handleAddSession = (newSession) => {
    if (editSession !== null) {
      const updatedSessions = sessions.map((session, index) =>
        index === editSession ? newSession : session
      );
      setSessions(updatedSessions);
      setEditSession(null);
    } else {
      setSessions([...sessions, newSession]);
    }
    setShowPopupSession(false);
  };

  const handleShowDetails = (session) => {
    setSelectedSession(session);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedSession(null);
  };

  const handleEditSession = (index) => {
    setEditSession(index);
    setShowPopupSession(true);
  };

  const handleDeleteSession = (index) => {
    const updatedSessions = sessions.filter((session, i) => i !== index);
    setSessions(updatedSessions);
  };

  return (
    <div className='session_training_container'>
      {sessions.length > 0 ? (
        <div className="sessionList">
          {sessions.map((session, index) => (
            <div key={index} className="sessionItem">
              <div className="left_session" onClick={() => handleShowDetails(session)}>
                <img src={link} alt="not found" />
                <p>{session.title}</p>
              </div>
              <div className="right_session">
                <img src={edit} alt="not found" onClick={() => handleEditSession(index)} />
                <img src={delet} alt="not found" onClick={() => handleDeleteSession(index)} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="notrainingYet">
          <img src={nosession} alt="not found" />
        </div>
      )}
      <div className="createTrainingSticky"  onClick={handleShowPopupSession} >
        <img src={addTrainingIcon} alt="not found"/>
      </div>
      {showPopupSession && (
        <PopupSession
          handleShowPopupSession={handleShowPopupSession}
          handleAddSession={handleAddSession}
          session={editSession !== null ? sessions[editSession] : null} 
        />
      )}
      {showPopupSession && <div className="overlay"></div>}
      {showDetails && <PopupDetails handleCloseDetails={handleCloseDetails} session={selectedSession} />}
      {showDetails && <div className="overlay"></div>}
    </div>
  );
};
