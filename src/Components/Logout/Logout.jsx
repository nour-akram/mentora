import React from 'react'
import Navbar from '../Navbar/Navbar'
import Sidebar from '../Sidebar/Sidebar'
import logout from '../../assets/logoutimage.png'
import "./Logout.css"
import Cookies from "universal-cookie";
export const Logout = () => {

    const cookies = new Cookies();
    const handelLogout=()=>{
       cookies.remove("Bearer");
       cookies.remove("role")
       window.location.href = "/loginpage";
    }
  return (
    <div className="home-container">
      <Navbar />
      <div className="home-content-container">
        <Sidebar />
        <div className="Training-Container">
          <img src={logout} alt='not found' className='logoutimage'/>
          <button className='logoutbutton' onClick={handelLogout}>Logout</button>
        </div>
      </div>
    </div>
  )
}
