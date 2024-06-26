import React, { useState,useEffect } from 'react';
import "./TrainingDetails.css";
import Navbar from '../../../Navbar/Navbar';
import Sidebar from '../../../Sidebar/Sidebar';
import chatwhite from "../../../../assets/chatWhite.png";
import chatColored from "../../../../assets/chatcolored.png";
import sessionwhite from "../../../../assets/sessionWhite.png";
import sessionColored from "../../../../assets/sessionColored.png";
import Materialwhite from "../../../../assets/materialWhite.png";
import MaterialColored from "../../../../assets/materialColored.png";
import taskwhite from "../../../../assets/tasksWhite.png";
import taskColored from "../../../../assets/tasksColored.png";
import announcementWhite from "../../../../assets/announcementWhite.png";
import announcementColored from "../../../../assets/announcementColored.png";
import { Link, useLocation } from 'react-router-dom';
import { ChatTraining } from './Chat/ChatTraining';
import { Session } from './Session/Session';
import { Materials } from './Materials/Materials';
import { Tasks } from './Tasks/Tasks';
import { Announcement } from './Announcement/Announcement';

export const TrainingDetails = () => {
  const location = useLocation();
  const { training } = location.state || {};
  const [activeLink, setActiveLink] = useState('chat');
  const [trainingStored, setTrainingStored] = useState(null);


  useEffect(() => {
    if (training) {
      localStorage.setItem('currentTraining', JSON.stringify(training));
    }
  }, [training]);

  useEffect(() => {
    const storedTraining = localStorage.getItem("currentTraining");
    if (storedTraining) {
      setTrainingStored(JSON.parse(storedTraining));
    }
  }, []);
  //  const trainingStored=localStorage.getItem("currentTraining")
  console.log(trainingStored);
  console.log(training)
  const handleLinkClick = (link) => {
    setActiveLink(link);
  };

 
  const renderContent = () => {
    switch (activeLink) {
      case 'chat':
        return trainingStored?(
          <ChatTraining trainingId={trainingStored._id} trainingName={trainingStored.name} trainigImage={trainingStored.TrainingPicture} />
        ) : null;
      case 'session':
        return trainingStored ? (
          <Session trainingId={trainingStored._id}/>
        ) : null;
      case 'material':
        return trainingStored?(
          <Materials trainingId={trainingStored._id}/>
        ):null;
      case 'task':
        return trainingStored? (
          <Tasks trainingId={trainingStored._id}/>
        ):null;
      case 'announcement':
        return trainingStored?(
          <Announcement trainingId={trainingStored._id}/>
        ):null;
      default:
        return null;
    }
  };

  // if (!training) {
  //   return <div>Loading...</div>; // Handle loading state if training is not yet defined
  // }

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-content-container">
        <Sidebar />
        <div className='Training-Container'>
          <div className="trainingDetailsHeader">
            <Link className={`chat ${activeLink === 'chat' ? 'active' : ''}`} onClick={() => handleLinkClick('chat')}>
              <img src={activeLink === 'chat' ? chatwhite : chatColored} alt='not found' />
              <p>Chat</p>
            </Link>
            <Link className={`session ${activeLink === 'session' ? 'active' : ''}`} onClick={() => handleLinkClick('session')}>
              <img src={activeLink === 'session' ? sessionwhite : sessionColored} alt='not found' />
              <p>Sessions</p>
            </Link>
            <Link className={`material ${activeLink === 'material' ? 'active' : ''}`} onClick={() => handleLinkClick('material')}>
              <img src={activeLink === 'material' ? Materialwhite : MaterialColored} alt='not found' />
              <p>Materials</p>
            </Link>
            <Link className={`task ${activeLink === 'task' ? 'active' : ''}`} onClick={() => handleLinkClick('task')}>
              <img src={activeLink === 'task' ? taskwhite : taskColored} alt='not found' />
              <p>Tasks</p>
            </Link>
            <Link className={`announcement ${activeLink === 'announcement' ? 'active' : ''}`} onClick={() => handleLinkClick('announcement')}>
              <img src={activeLink === 'announcement' ? announcementWhite : announcementColored} alt='not found' />
              <p>Announcements</p>
            </Link>
          </div>
          {renderContent()}
        </div>
      </div>
    </div>
  );
};
