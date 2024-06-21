import React, { useState } from 'react';
import "./Popup.css";
import exit from "../../../../assets/exitWhite.png";
import upload from "../../../../assets/Upload icon.png";
import createTraining from "../../../../assets/createTraining.png";

const tracks = ["Web Development", "Data Science", "Mobile App Development", "UI/UX Design", "Cloud Computing"];

export const PopupTraining = ({ handleShowPopupTraining ,handleAddTraining}) => {
  const [selectedTrack, setSelectedTrack] = useState("");
  const [customTrack, setCustomTrack] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    track: "",
    language: "",
    durationNumber: "",
    durationUnit: "",
    salary: "",
    mentees: "",
    description: "",
    requirements: "",
    level: "",
    image: null,
  });
  const [formErrors, setFormErrors] = useState({});
 
 
  const handleFileUploadClick = () => {
    document.getElementById('fileUpload').click();
  };

  const handleTrackChange = (e) => {
    setSelectedTrack(e.target.value);
    if (e.target.value !== "custom") {
      setFormData({ ...formData, track: e.target.value });
    }
  };

  const handleCustomTrackChange = (e) => {
    setCustomTrack(e.target.value);
    setFormData({ ...formData, track: e.target.value });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  
  const handleFileChange = (e) => {
    const imageFile = e.target.files[0];
    if (imageFile) {
      setFormData({ ...formData, image: imageFile });
    }
  };
  










  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = {};
  
    Object.keys(formData).forEach((key) => {
      if (key !== 'image' && !formData[key]) { 
        errors[key] = true;
      }
    });
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
    } else {
      setFormErrors({});
      handleAddTraining(formData); 
      handleShowPopupTraining(); 
    }
  };
  

  return (
    <div className='popup_Training'>
      <div className="header_training">
        <p>Create Training</p>
        <img src={exit} alt="not found" onClick={handleShowPopupTraining} />
      </div>
      <form className="feilds_training" onSubmit={handleSubmit}>
        <div className="firstfeilds">
          <div className="left">
            <label>Name:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              style={{ borderColor: formErrors.name ? 'red' : 'initial' }}
            />
          </div>
          <div className="right">
            <label>Track:</label>
            <div className="containerfeild">
              <select
                value={selectedTrack}
                onChange={handleTrackChange}
                className='selection'
                style={{ borderColor: formErrors.track ? 'red' : 'initial' }}
              >
                <option value="">Select a track...</option>
                {tracks.map((track) => (
                  <option key={track} value={track}>{track}</option>
                ))}
                <option value="custom">Other (Please specify)</option>
              </select>
              {selectedTrack === "custom" && (
                <input
                  type="text"
                  placeholder="Enter custom track..."
                  value={customTrack}
                  onChange={handleCustomTrackChange}
                  style={{ borderColor: formErrors.track ? 'red' : 'initial' }}
                />
              )}
            </div>
          </div>
        </div>
        <div className="secondfeilds">
          <div className="left">
            <label>Language:</label>
            <select
              name="language"
              value={formData.language}
              onChange={handleInputChange}
              style={{ borderColor: formErrors.language ? 'red' : 'initial' }}
            >
              <option value="">Select a language...</option>
              <option value="arabic">Arabic</option>
              <option value="english">English</option>
              <option value="spanish">Spanish</option>
              <option value="french">French</option>
              <option value="german">German</option>
            </select>
          </div>
          <div className="right">
            <label>Duration:</label>
            <div className="duration-inputs">
              <input
                type="number"
                min="0"
                placeholder="Number"
                name="durationNumber"
                value={formData.durationNumber}
                onChange={handleInputChange}
                style={{ borderColor: formErrors.durationNumber ? 'red' : 'initial' }}
              />
              <select
                name="durationUnit"
                value={formData.durationUnit}
                onChange={handleInputChange}
                style={{ borderColor: formErrors.durationUnit ? 'red' : 'initial' }}
              >
                <option value="">Select unit...</option>
                <option value="day">Days</option>
                <option value="week">Weeks</option>
                <option value="year">Years</option>
              </select>
            </div>
          </div>
        </div>
        <div className="thirdfeilds">
          <div className="left">
            <label>Salary:</label>
            <input
              type="number"
              min="0"
              name="salary"
              value={formData.salary}
              onChange={handleInputChange}
              style={{ borderColor: formErrors.salary ? 'red' : 'initial' }}
            />
          </div>
          <div className="right">
            <label>Number Of Required Mentees:</label>
            <input
              type="number"
              min="0"
              name="mentees"
              value={formData.mentees}
              onChange={handleInputChange}
              style={{ borderColor: formErrors.mentees ? 'red' : 'initial' }}
            />
          </div>
        </div>
        <div className="imagefeild">
          <label>Upload Training’s Image:</label>
          <input type="file" id="fileUpload" style={{ display: 'none' }} onChange={handleFileChange} />
          <button type="button" className="uploadButton" onClick={handleFileUploadClick}>
            <img src={upload} alt="not found" />
          </button>
        </div>
        <div className="description">
          <label>Description:</label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            style={{ borderColor: formErrors.description ? 'red' : 'initial' }}
          />
        </div>
        <div className="description">
          <label>Requirements:</label>
          <input
            type="text"
            name="requirements"
            value={formData.requirements}
            onChange={handleInputChange}
            style={{ borderColor: formErrors.requirements ? 'red' : 'initial' }}
          />
        </div>
        <div className="levelField">
          <label>Level:</label>
          <div className="radioGroup">
            <input
              type="radio"
              id="beginner"
              name="level"
              value="beginner"
              onChange={handleInputChange}
              style={{ borderColor: formErrors.level ? 'red' : 'initial' }}
            />
            <label htmlFor="beginner">Beginner</label>
            <input
              type="radio"
              id="advanced"
              name="level"
              value="advanced"
              onChange={handleInputChange}
              style={{ borderColor: formErrors.level ? 'red' : 'initial' }}
            />
            <label htmlFor="advanced">Advanced</label>
          </div>
        </div>

        <div className="buttonTraining">
          <button type="submit">
            <p>Create Training</p>
            <img src={createTraining} alt="not found" />
          </button>
        </div>
      </form>
    </div>
  );
};
