import React, { useState,useEffect } from 'react'
import "./Announcement.css"
import noannouncement from "../../../../../assets/no announcement.png"
import upload from "../../../../../assets/uploadMaterial.png"
import { Popup } from './Popup/Popup'
import edit from "../../../../../assets/editSession.png";
import delet from "../../../../../assets/deleteSession.png";
import axiosInstance from '../../../../../api/axiosConfig'
import Cookies from "universal-cookie";
export const Announcement = ({trainingId}) => {
  const[showpopupAnnoucement,setshowpopupAnnouncement]=useState(false)
  const handelshowpopupAnnoucement =()=>{
    setshowpopupAnnouncement(!showpopupAnnoucement)
  }

  const [Announcements, setAnnouncements] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  useEffect(() => {
    const savedannouncements = localStorage.getItem('announcements');
    if (savedannouncements) {
      setAnnouncements(JSON.parse(savedannouncements));
    }
    setIsDataLoaded(true);
  }, []);

  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem('announcements', JSON.stringify(Announcements));
    }
  }, [Announcements, isDataLoaded]);

  const handleAddAnnouncement = (newAnnouncement) => {
    setAnnouncements([...Announcements, { announcement: newAnnouncement }]);
  };



  const [announcementToEdit, setAnnouncementToEdit] = useState(null);
  const handleUpdateAnnouncement = (index, updatedText) => {
    const updatedAnnouncements = Announcements.map((announcement, i) =>
      i === index ? { ...announcement, announcement: updatedText } : announcement
    );
    setAnnouncements(updatedAnnouncements);
    setAnnouncementToEdit(null);
  };

  const handleEditClick = (index) => {
    setAnnouncementToEdit({ index, announcement: Announcements[index].announcement });
    handelshowpopupAnnoucement();
  };


  const handleDeleteAnnoucement = (index) => {
    const updatedMaterials = [...Announcements];
    updatedMaterials.splice(index, 1);
    setAnnouncements(updatedMaterials);
};


const fetchAnnouncements = async () => {
  const cookies = new Cookies();
  const token = cookies.get('Bearer');
  try {
    const response = await axiosInstance.get(`/training/getAnnouncements/${trainingId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    setAnnouncements(response.data.data);
    console.log(response,"announcement");
  } catch (error) {
    console.error('Error fetching announcements:', error);
  }
};
useEffect(() => {
  

  fetchAnnouncements();
}, [trainingId]);
  return (
    <div className='session_training_container'>
        {Announcements.length > 0 ? (
        <div className="sessionList">
          {Announcements.map((announcement, index) => (
            <div key={index} className="AnnouncementItem">
              <div className="left_session" >
                <p>{announcement.announcement}</p>
                 <span>when it accur</span>
              </div>
              <div className="right_session">
                <img src={edit} alt="not found" onClick={() => handleEditClick(index)} />
                <img src={delet} alt="not found" onClick={()=>handleDeleteAnnoucement(index)}/>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="notrainingYet">
               <img src={noannouncement} alt="not found" />
        </div>
      )}


        
        <div className="createTrainingSticky" onClick={handelshowpopupAnnoucement} >
            <img src={upload} alt="not found" />
         </div>
         {showpopupAnnoucement&&<Popup handelshowpopupAnnoucement={handelshowpopupAnnoucement} handleAddAnnouncement={handleAddAnnouncement} handleUpdateAnnouncement={handleUpdateAnnouncement}trainingI={trainingId} announcementToEdit={announcementToEdit} fetchAnnouncements={fetchAnnouncements}/>}
         {showpopupAnnoucement&&<div className="overlay"></div>}

    </div>
  )
}
