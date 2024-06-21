import React from 'react';
import "./PopupDetails.css";
import exit from "../../../../../../assets/exit.png";

export const PopupDetails = ({ task, handleClose }) => {
  return (
    <div className='session_details'>
       <div className="title">
          <h2> Task details</h2>
       </div>
       {task ? (
          <>
            <div className="session_duration">
                 <p>Task Deadline:</p>
                 <p>{task.date} {task.time}</p>
            </div>
            <div className="file_display">
              <embed
                src={task.file}
                type="application/pdf"
                width="50%"
                height="300px"
              />
            </div>
          </>
        ) : (
          <p>No Task details available.</p>
        )}

       <div className="close">
         <button onClick={handleClose}>
            <p>Close</p>
            <img src={exit} alt="not found" />
         </button>
       </div>
    </div>
  );
};
