import { React, useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";
import notification from '../../assets/notification.png';
import chat from "../../assets/messageIcon.png";
import userIcon from "../../assets/userIcon.png";
import searchIcon from "../../assets/searchIcon.png";
import mentoraLogo from "../../assets/mentoraLogo.png";
import axiosInstance from "../../api/axiosConfig";
import Cookies from "universal-cookie";

const Navbar = () => {
  const [user, setUser] = useState("");
  const [isUserFetched, setIsUserFetched] = useState(false);
  const [shouldNavigate, setShouldNavigate] = useState(false);
  const cookies = new Cookies();
  const token = cookies.get("Bearer");
  const role = cookies.get("role");

  const getUser = useCallback(async () => {
    try {
      const { data } = await axiosInstance.get("user/", {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      setUser(data.data.user);
      setIsUserFetched(true);
      console.log(data);
    } catch (error) {
      console.error(error.message);
      setIsUserFetched(false);
    }
  }, [token]);

  const navigate = useNavigate();

  const handleShowMyProfile = () => {
    if (!isUserFetched) {
      getUser();
      setShouldNavigate(true);
    } else {
      if (role === 'Admin') {
        navigate("/profileSystemAdmin");
      } else {
        navigate("/profile", { state: { userId: user._id } });
      }
    }
  };

  useEffect(() => {
    if (isUserFetched && shouldNavigate) {
      if (role === 'Admin') {
        navigate("/profileSystemAdmin");
      } else {
        navigate("/profile", { state: { userId: user._id } });
      }
      setShouldNavigate(false); 
    }
  }, [isUserFetched, shouldNavigate, navigate, role, user._id]);

  return (
    <nav className="navbar">
      <div className="MentoraLogo">
        <Link to="/home">
          <img src={mentoraLogo} alt="Mentora Logo" />
        </Link>
      </div>
      <div className="search-bar">
        <div className="search-container">
          <input type="text" placeholder="Search..." />
          <button onClick={() => console.log("Search clicked")}>
            <img src={searchIcon} alt="Search Icon" />
          </button>
        </div>
      </div>
      <div className="items">
        <div className="nav-item">
          <Link to="/notifications">
            <img src={notification} alt="Notification Icon" />
            <span>Notifications</span>
          </Link>
        </div>
        <div className="nav-item">
          <Link to="/chat">
            <img src={chat} alt="Chat Icon" />
            <span>Chats</span>
          </Link>
        </div>
        <div className="nav-item">
          <Link onClick={handleShowMyProfile}>
            <img src={userIcon} alt="User Icon" />
            <span>Me</span>
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
