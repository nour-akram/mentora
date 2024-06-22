import { React, useState,useCallback,useEffect } from "react";
import Navbar from "../../Navbar/Navbar";
import "./SystemAdminProfile.css";
import avatar from "../../../assets/Default_avatar.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import rolee from "../../../assets/role.png"
import edit from "../../../assets/edit.png";
import Apply from "../../../assets/ApplyAsMentor.png";
import info from "../../../assets/infoImage.png";
import email from "../../../assets/email.png";
import country from "../../../assets/country.png";
import age from "../../../assets/age.png";
import gender from "../../../assets/gender.png";
import Language from "../../../assets/language.png";
import Interests from "../../../assets/interests.png";
import Sidebar from "../../Sidebar/Sidebar";
import axiosInstance from "../../../api/axiosConfig";
import Cookies from "universal-cookie";
import { useLocation } from 'react-router-dom';
import {Popup} from "../UserProfile/Popup/Popup"
// import { Popup } from "../UserProfile/Popup/Popup"
export const SystemAdminProfile = () => {
  const [user, setUser] = useState({});
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const [requests, setRequests] = useState([
    {
      id: 1,
      name: "Nour Shazly",
      trackName: "Web Development",
      trackType: "Full Stack",
      imageUrl: "https://via.placeholder.com/150",
      requestDate: new Date(),
      reason: "I want to improve my skills.",
      duration: "3 months",
      language: "English",
      minSalary: "$50,000",
      maxSalary: "$70,000",
      linkedin: "https://linkedin.com/in/nourshazly",
      github: "https://github.com/nourshazly",
      cv: "https://example.com/nourshazly_cv.pdf",
      yearOfExperience: 3,
      experience: "Worked on several projects.",
      bio: "A passionate web developer .",
    },
    {
      id: 2,
      name: "Nour Shazly",
      trackName: "Data Science",
      trackType: "Machine Learning",
      imageUrl: "https://via.placeholder.com/150",
      requestDate: new Date(),
      reason: "I want to switch careers.",
      duration: "6 months",
      language: "English",
      minSalary: "$60,000",
      maxSalary: "$90,000",
      linkedin: "https://linkedin.com/in/nourshazly",
      github: "https://github.com/nourshazly",
      cv: "https://example.com/nourshazly_cv.pdf", 
      yearOfExperience: 2,
      experience: "Worked on machine learning .",
      bio: "A data science machine learning.",
    },
  ]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [detailsPopup, setDetailsPopup] = useState(false);
  const [showAcceptForm, setShowAcceptForm] = useState(false);

  const handleReject = (id) => {
    setRequests(requests.filter((req) => req.id !== id));
  };

  const handleAccept = (request) => {
    setSelectedRequest(request);
    setShowAcceptForm(true);
    setShowPopup(true);
    setRequests(requests.filter((req) => req.id !== request.id));
  };

  const handleDetailsClick = (request) => {
    setSelectedRequest(request);
    setDetailsPopup(true);
    setShowAcceptForm(false); 
  };

  const handleCloseDetails = () => {
    setDetailsPopup(false);
  };







  const cookies = new Cookies();
  const token = cookies.get("Bearer");
  const role = cookies.get("role");
  // const location = useLocation();
  // const { userId } = location.state || {};
  // console.log(userId)
  const getUser = useCallback(async () => {
    try {
      // console.log(auth);
      const { data } = await axiosInstance.get(`/user/`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      console.log(data.data.user);
      setUser(data.data.user);
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  const getFollowers = useCallback(async () => {
    try {
      // console.log(auth);
      const { data } = await axiosInstance.get(
        "user/followers",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      // console.log(data);
      setFollowers(data.data.Followers);
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  const getFollowing = useCallback(async () => {
    try {
      // console.log(auth);
      const { data } = await axiosInstance.get(
        "user/following",
        {
          headers: {
            Authorization: "Bearer " + token,
          },
        }
      );
      // console.log(data);
      setFollowing(data.data.Following);
    } catch (error) {
      console.error(error.message);
    }
  }, []);

  useEffect(() => {
    getUser();
    getFollowers();
    getFollowing();
  }, []);
  console.log(followers, following);


  const[showEditPopup,setShowEditPopup]=useState(false)
  const handelshowEditPopup=()=>{
    setShowEditPopup(!showEditPopup)
  }
  return (
    <>
      <div className="profileAdmin-container">
        <Navbar />
        <div className="profileAdmin-content">
          <Sidebar />
          <div className="userData">
            <div className="info-div">
              <div className="leftSide">
                <div className="imgadmin">
                  <img src={user.profilePicture} alt="not found" className="userImage" />
                </div>
                <h2 className="userName">{user.name}</h2>
                <p className="bio">{user.bio}</p>
                <div className="followers-following">
                <div className="no-posts">
                  <span>{(user.posts && user.posts.length) | 0}</span>
                  <p>Posts</p>
                </div>
                <div className="followers">
                  <span>{followers.length}</span>
                  <p>Followers</p>
                </div>
                <div className="following">
                  <span>{following.length}</span>
                  <p>Following</p>
                </div>
              </div>
                <div className="buttons">
                  <div className="editProfile" onClick={handelshowEditPopup}>
                    <button>
                      <p>Edit profile</p>
                      <img src={edit} alt="not found" />
                    </button>
                  </div>
                </div>
                <div className="line1"></div>
              </div>
              <div className="info">
              <h2>info</h2>
              <div className="img">
                <img src={info} alt="not found" />
              </div>
              <div className="line"></div>
              <div className="Data">
                <div className="item">
                  <div className="nameIcon">
                    <img src={email} alt="not found" />
                    <p>Email :</p>
                  </div>
                  <div className="value">
                    <p>{user.email || "Loading..."}</p>
                  </div>
                </div>
                {user.country &&
                   <div className="item">
                   <div className="nameIcon">
                     <img src={country} alt="not found" />
                     <p>Country :</p>
                   </div>
                   <div className="value">
                     <p>{user.country}</p>
                   </div>
                   </div>
                
                }
                {role &&
                   <div className="item">
                   <div className="nameIcon">
                   <img src={rolee} alt="not found" />
                     <p>Role :</p>
                   </div>
                   <div className="value">
                     <p>{role}</p>
                   </div>
                   </div>
                
                }
               
              </div>
              <div className="line"></div>
               {user.languages&&
                 <>
                     <div className="Languages">
                <img src={Language} alt="not found" />
                <p>Languages</p>
              </div>
              <ul
                className="listofLanguages"
                style={{ flexDirection: "column", alignItems: "flex-start" }}
              >
                {!user.languages && "Loading..."}
                {user.languages &&
                  user.languages.map((lan, index) => (
                    <li key={index}>{lan}</li>
                  ))}
              </ul>
              <div className="line"></div>
                 </>
               }


             
              {user.interests&&
                 <>
                 
                 <div className="Interests">
                <img src={Interests} alt="not found" />
                <p>Interests</p>
              </div>
              <ul
                className="listofInterests"
                style={{ flexDirection: "column", alignItems: "flex-start" }}
              >
                {!user.interests && "Loading..."}
                {user.interests &&
                  user.interests.map((int, index) => (
                    <li key={index}>{int}</li>
                  ))}
              </ul>
                 
                 </>
              
              }
              
            </div>
            </div>
            <div className="profileSystem-container">
              <h2>Apply As Mentor Requests</h2>
              {requests.map((request) => (
                <div key={request.id} className="profileSystem-wrapper">
                  <div
                    className="profileSystem-card"
                    onClick={() => handleDetailsClick(request)}
                  >
                    <div className="profileSystem-left">
                      <img src={request.imageUrl} alt={request.name} />
                      <div className="profileSystem-info">
                        <h4>{request.name}</h4>
                        <p>{request.trackName}</p>
                        <p>{request.trackType}</p>
                      </div>
                    </div>
                    <div className="profileSystem-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAccept(request);
                        }}
                        className="accept"
                      >
                        Accept
                      </button>
                      <button
                        className="reject"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleReject(request.id);
                        }}
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {detailsPopup && selectedRequest && (
                <div className="details-popup">
                  <div className="details-popup-content">
                    <h3>Request Details</h3>
                    <p>Name: {selectedRequest.name}</p>
                    <p>Track Name: {selectedRequest.trackName}</p>
                    <p>Bio: {selectedRequest.bio}</p>
                    <p>
                      Request Date:{" "}
                      {selectedRequest.requestDate.toLocaleDateString()}
                    </p>
                    <p>Reason: {selectedRequest.reason}</p>
                    <p>
                      LinkedIn:{" "}
                      <a
                        href={selectedRequest.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selectedRequest.linkedin}
                      </a>
                    </p>
                    <p>
                      GitHub:{" "}
                      <a
                        href={selectedRequest.github}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {selectedRequest.github}
                      </a>
                    </p>
                    <p>
                      CV:{" "}
                      <a
                        href={selectedRequest.cv}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Download CV
                      </a>
                    </p>
                    <p>
                      Year Of Experience: {selectedRequest.yearOfExperience}
                    </p>
                    <p>Experience: {selectedRequest.experience}</p>
                    <p>Language: {selectedRequest.language}</p>
                   
                    <button onClick={handleCloseDetails}>Close</button>
                  </div>
                </div>
              )}
              {showPopup && (
                <div className="profileSystem-popup">
                  <div className="profileSystem-popup-content">
                    <div className="xx">
                      <div
                        className="profileSystem-close"
                        onClick={() => setShowPopup(false)}
                      >
                        <FontAwesomeIcon icon={faTimes} />
                      </div>
                      <div className="profileSystem-success">
                        <FontAwesomeIcon
                          icon={faCheckCircle}
                          className="profileSystem-success-icon"
                        />
                        <h3>Success</h3>
                      </div>
                    </div>
                    <div className="ppp">
                      <p>Request Accepted Successfully!</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {showEditPopup&&<Popup handelshowEditPopup={handelshowEditPopup} getUser={getUser}/>}
      {showEditPopup&&<div className="overlay"></div>}
    </>
  );
};
