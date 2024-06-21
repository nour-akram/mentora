import React, { useState } from "react";
import Navbar from "../Navbar/Navbar";
import Sidebar from "../Sidebar/Sidebar";
import Session from './Seesions/Sessions';
import Requests from "./Requests/Requests";
import { Training } from "./Training/Training";
import "./Carrer.css";

const Carrer = () => {
  const [selectedSection, setSelectedSection] = useState("requests");

  const handleSectionClick = (section) => {
    setSelectedSection(section);
  };

  return (
    <div className="home-container">
      <Navbar />
      <div className="home-content-container">
        <Sidebar />
        <div className="Training-Container">
          <div className="list_career">
            <h3
              onClick={() => handleSectionClick("requests")}
              className={selectedSection === "requests" ? "selected" : ""}
            >
              Requests
            </h3>
            <h3
              onClick={() => handleSectionClick("sessions")}
              className={selectedSection === "sessions" ? "selected" : ""}
            >
              Sessions
            </h3>
            <h3
              onClick={() => handleSectionClick("trainings")}
              className={selectedSection === "trainings" ? "selected" : ""}
            >
              Trainings
            </h3>
          </div>
          <div className="section-content">
            {selectedSection === "requests" && <Requests />}
            {selectedSection === "sessions" && <Session />}
            {selectedSection === "trainings" && <Training />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Carrer;
