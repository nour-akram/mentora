import React from 'react'
import "./PopupDetails.css"
import exit from "../../../../../../assets/exit.png"
export const PopupDetails = ({ handleCloseDetails, session }) => {
  return (
    <div className='session_details'>
       <div className="title">
          <h4> Session details</h4>
       </div>
       {session ? (
          <>
            <div className="session_title">
                <p> Session Title:</p>
                <p>{session.title}</p>
            </div>
            <div className="session_description">
                <p>Session Description:</p>
                <p>{session.description}</p>
            </div>
            <div className="session_duration">
                 <p>Session Duration:</p>
                 <p>{session.date} {session.time}</p>
            </div>
          </>
        ) : (
          <p>No session details available.</p>
        )}


      
       <div className="close">
         <button  onClick={handleCloseDetails}>
            <p>Close</p>
            <img src={exit} alt="not found" />
         </button>
       </div>
    </div>
  )
}
