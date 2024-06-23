import React, { useContext, useState } from "react";
import "./ApplyAsMentorForm.css";
import image from "./mentor.png";
import linkedinIcon from "./linkedin-icon.png";
import githubIcon from "./github-icon.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { User } from "../Context/userContext";
import Cookies from "universal-cookie";
const ApplyAsMentorForm = () => {
  const { auth } = useContext(User);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    LinkedinUrl: "",
    GithubUrl: "",
    track: "",
    experience: "",
    YearOfExperience: "",
  });

  const [formErrors, setFormErrors] = useState({
    LinkedinUrl: "",
    GithubUrl: "",
    track: "",
    experience: "",
    YearOfExperience: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    setFormErrors({
      ...formErrors,
      [name]: "",
    });
  };

  const validateForm = () => {
    const errors = {};

    if (!formData.track.trim()) {
      errors.track = "Your track is required";
    }

    if (!formData.LinkedinUrl.trim()) {
      errors.LinkedinUrl = "Linkedin URL is required";
    }

    if (!formData.GithubUrl.trim()) {
      errors.GithubUrl = "Github URL is required";
    }

    if (!formData.experience.trim()) {
      errors.experience = "Experience is required";
    }

    if (!formData.YearOfExperience.trim()) {
      errors.YearOfExperience = "Year of Experience is required";
    }

    setFormErrors(errors);

    return Object.keys(errors).length === 0;
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    
    const cookies = new Cookies();
    const token = cookies.get("Bearer");
    if (validateForm()) {
      try {
        const response = await axios.post(
          formData,
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
          }
          }
        );
        console.log(response);
        navigate("/profile");
      }catch (error) {
        console.error(error.message);
        console.log(error);
      }
    } else {
      console.log("Form has errors. Please fix them.");
    }
  };

  return (
    <div className="container">
      <div className="applyAsMentorContainer">
        <div className="rightSection">
          <label htmlFor="fileInput">
            <img src={image} alt="Mentor" className="mentorImage" />
          </label>
        </div>
        <div className="leftSection">
          <h1 className="applyAsMentorText">
            Apply as <span className="greenText">Mentor</span>
          </h1>
          <form className="applyAsMentorForm" onSubmit={handleFormSubmit}>
            <label>Your Track:</label>
            <textarea
              name="track"
              value={formData.track}
              onChange={handleInputChange}
              className="inputField"
            />
            {formErrors.track && (
              <div className="errorText">{formErrors.track}</div>
            )}

            <label>Linkedin URL:</label>
            <div className="inputWithIconContainer">
              <input
                type="text"
                name="LinkedinUrl"
                value={formData.LinkedinUrl}
                onChange={handleInputChange}
                className="inputField"
              />
              <img src={linkedinIcon} alt="Linkedin Icon" className="icon" />
            </div>
            {formErrors.LinkedinUrl && (
              <div className="errorText">{formErrors.LinkedinUrl}</div>
            )}
<label>Github URL:</label>
            <div className="inputWithIconContainer">
              <input
                type="text"
                name="GithubUrl"
                value={formData.GithubUrl}
                onChange={handleInputChange}
                className="inputField"
              />
              <img src={githubIcon} alt="Github Icon" className="icon" />
            </div>
            {formErrors.GithubUrl && (
              <div className="errorText">{formErrors.GithubUrl}</div>
            )}

            <label>Year Of Experience:</label>
            <div className="inputWithIconContainer">
              <input
                type="number"
                name="YearOfExperience"
                value={formData.YearOfExperience}
                onChange={handleInputChange}
                className="inputField"
              />
            </div>
            {formErrors.YearOfExperience && (
              <div className="errorText">{formErrors.YearOfExperience}</div>
            )}

            <label>Why do you want to become a mentor?</label>
            <textarea
              name="experience"
              value={formData.experience}
              onChange={handleInputChange}
              className="inputField"
            />
            {formErrors.experience && (
              <div className="errorText">{formErrors.experience}</div>
            )}

            <button type="submit" className="nextButton">
              <span className="nextText">Apply</span>
              <span className="arrowIcon">&rarr;</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ApplyAsMentorForm;