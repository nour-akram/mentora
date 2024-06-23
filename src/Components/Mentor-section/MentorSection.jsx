import React from 'react'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import Training from '../Career/Training/Training'

export const MentorSection = () => {
  return (
    <div className="home-container">
      <Navbar/>
      <div className="home-content-container">
        <Sidebar/>
        <div className="Training-Container">
            <Training/>
        </div>
     </div>
     </div>
  )
}
