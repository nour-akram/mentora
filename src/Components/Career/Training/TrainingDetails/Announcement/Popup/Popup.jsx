import React, { useState, useEffect } from 'react';
import exit from "../../../../../../assets/exitWhite.png";
import "./Popup.css";

export const Popup = ({ handelshowpopupAnnoucement, handleAddAnnouncement, handleUpdateAnnouncement, announcementToEdit }) => {
  const [announcementText, setAnnouncementText] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (announcementToEdit) {
      setAnnouncementText(announcementToEdit.announcement);
    } else {
      setAnnouncementText(""); 
    }
  }, [announcementToEdit]);

  
  const handleInputChange = (e) => {
    setAnnouncementText(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!announcementText.trim()) {
      setError("Announcement cannot be empty");
      return;
    }
    setError("");

    if (announcementToEdit) {
      handleUpdateAnnouncement(announcementToEdit.index, announcementText);
    } else {
      handleAddAnnouncement(announcementText);
    }
    handelshowpopupAnnoucement();
  };

  return (
    <div className='popup_Announcement'>
      <div className="header_Announcement">
        <p>{announcementToEdit ? "Edit Announcement" : "Create Announcement"}</p>
        <img src={exit} alt="not found" onClick={handelshowpopupAnnoucement} />
      </div>
      <form className="feilds_announcement" onSubmit={handleSubmit}>
        <div className="announcementData">
          <label>Write your Announcement</label>
          <textarea
            value={announcementText}
            onChange={handleInputChange}
            style={{ borderColor: error ? 'red' : '' }}
          ></textarea>
          {error && <p className="error">{error}</p>}
        </div>
        <div className="upload">
          <button type="submit">
            <h3>{announcementToEdit ? "Save Changes" : "Submit"}</h3>
          </button>
        </div>
      </form>
    </div>
  );
};
