import React, { useState, useEffect } from 'react';
import exit from "../../../../../../assets/exitWhite.png";
import axiosInstance from '../../../../../../api/axiosConfig'; 
import Cookies from "universal-cookie";
import "./Popup.css";

export const Popup = ({ handelshowpopupAnnoucement,fetchAnnouncements, trainingId, handleAddAnnouncement, handleUpdateAnnouncement, announcementToEdit }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (announcementToEdit) {
      setTitle(announcementToEdit.title);
      setDescription(announcementToEdit.description);
    } else {
      setTitle("");
      setDescription("");
    }
  }, [announcementToEdit]);

  const handleTitleChange = (e) => {
    setTitle(e.target.value);
  };

  const handleDescriptionChange = (e) => {
    setDescription(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title.trim() || !description.trim()) {
      setError("Title and description cannot be empty");
      return;
    }
    setError("");

    const newAnnouncement = {
      title:title,
      description:description,
      trainingId:trainingId,
    };

    const cookies = new Cookies();
    const token = cookies.get("Bearer");

    try {
      const response = await axiosInstance.post('/training/addAnnouncement', newAnnouncement, {
        headers: {
          Authorization: "Bearer " + token,
        }
      });
      // handleAddAnnouncement(newAnnouncement);
      console.log(response);
      fetchAnnouncements();
      handelshowpopupAnnoucement();
    } catch (error) {
      console.error('Error adding/updating announcement:', error);
      setError("An error occurred. Please try again.");
    }
  };

  return (
    <div className='popup_Announcement'>
      <div className="header_Announcement">
        <p>{announcementToEdit ? "Edit Announcement" : "Create Announcement"}</p>
        <img src={exit} alt="not found" onClick={handelshowpopupAnnoucement} />
      </div>
      <form className="feilds_announcement" onSubmit={handleSubmit}>
        <div className="announcementData">
          <label>Title</label>
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            className='extra-feild'
            style={{ borderColor: error ? 'red' : '' }}
          />
          <label>Description</label>
          <textarea
            value={description}
            onChange={handleDescriptionChange}
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
