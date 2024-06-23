import React from 'react';
import "./PopupDetails.css";
import exit from "../../../../../../assets/exit.png";

export const PopupDetails = ({ handleClose, deadline }) => {
  const fileUrl = localStorage.getItem('fileUrl');
  console.log(fileUrl)
  return (
    <div className='session_details'>
      <div className="title">
        <h2> Task details</h2>
      </div>

      <>
        <div className="session_duration">
          <p>Task Deadline:</p>
          <p>{deadline}</p>
        </div>
        <div className="file_display">
          {fileUrl ? (
            <embed
              src={fileUrl}
              type="application/pdf"
              width="50%"
              height="300px"
            />
          ) : (
            <p>No file available</p>
          )}
        </div>
      </>

      <div className="close">
        <button onClick={handleClose}>
          <p>Close</p>
          <img src={exit} alt="not found" />
        </button>
      </div>
    </div>
  );
};

