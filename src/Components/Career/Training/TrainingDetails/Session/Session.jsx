import React, { useState, useEffect } from 'react';
import "./Session.css";
import addTrainingIcon from "../../../../../assets/addTrainingIcon.png";
import nosession from "../../../../../assets/no session Yet.png";
import { PopupSession } from './Popup/PopupSession';
import link from "../../../../../assets/linkSession.png";
import edit from "../../../../../assets/editSession.png";
import delet from "../../../../../assets/deleteSession.png";
import { PopupDetails } from './PopupDetails/PopupDetails';
import axiosInstance from '../../../../../api/axiosConfig';
import Cookies from "universal-cookie";

export const Session = ({ trainingId }) => {
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

  useEffect(() => {
    if (isDataLoaded && trainingId) {
      fetchAllSessionsMentor();
    }
  }, [isDataLoaded, trainingId]);

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
    fetchAllSessionsMentor();
  };

  const handleShowDetails = (session) => {
    setSelectedSession(session);
    setShowDetails(true);
  };

  const handleCloseDetails = () => {
    setShowDetails(false);
    setSelectedSession(null);
  };

  // const handleEditSession = (index) => {
  //   setEditSession(index);
  //   setShowPopupSession(true);
  // };

  // const handleDeleteSession = (index) => {
  //   const updatedSessions = sessions.filter((session, i) => i !== index);
  //   setSessions(updatedSessions);
  // };

  const cookies = new Cookies();
  const token = cookies.get("Bearer");
  const role =cookies.get("role")
  const fetchAllSessionsMentor = async () => {
    try {
      const getSessionsResponse = await axiosInstance.get(`/training/getSessions/${trainingId}`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      console.log('Sessions:', getSessionsResponse.data.data);
      setSessions(getSessionsResponse.data.data.sessions); 
    } catch (error) {
      console.error('Error fetching sessions:', error);
    }
  };

  console.log(sessions)
  return (
    <div className='session_training_container'>
      {sessions.length > 0 ? (
        <div className="sessionList">
          {sessions.map((session, index) => (
            <div key={index} className="sessionItem" onClick={() => handleShowDetails(session)}>
              <div className="left_session" >
                <img src={link} alt="not found" />
                <p>{session.title}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="notrainingYet">
          <img src={nosession} alt="not found" />
        </div>
      )}
      {role!=="User"&&<div className="createTrainingSticky" onClick={handleShowPopupSession}>
        <img src={addTrainingIcon} alt="not found" />
      </div>}
      
      {showPopupSession && (
        <PopupSession
          handleShowPopupSession={handleShowPopupSession}
          session={editSession !== null ? sessions[editSession] : null}
          trainingId={trainingId}
          handleAddSession={handleAddSession}  
        />
      )}
      {showPopupSession && <div className="overlay"></div>}
      {showDetails && <PopupDetails handleCloseDetails={handleCloseDetails} session={selectedSession} />}
      {showDetails && <div className="overlay"></div>}
    </div>
  );
};
