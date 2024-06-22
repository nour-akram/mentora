import React, { useCallback, useEffect, useState } from "react";
import Navbar from "../../Navbar/Navbar";
import "./UserProfile.css";
import avatar from "../../../assets/Default_avatar.png";
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
import { useLocation } from 'react-router-dom';
import axiosInstance from "../../../api/axiosConfig";
import { Link } from "react-router-dom";
import Cookies from "universal-cookie";
import { Popup } from "./Popup/Popup";
import follow from "../../../assets/follow.png"
import message from "../../../assets/message.png"
export const UserProfile = () => {
  // const { auth } = useContext(User);
  const [user, setUser] = useState({});
  const [followers, setFollowers] = useState([]);
  const [following, setFollowing] = useState([]);

  const location = useLocation();
  const { userId } = location.state || {}; ///////////////د ال id  ال بباصيه ليه
  // console.log(userId)

  const[currentUser,setCurrentUser]=useState(); ////////////////ود اليوزر ال عامل لوجين حالا
  
  const cookies = new Cookies();
  const token = cookies.get("Bearer");
  const role = cookies.get("role");
  // console.log(role)
 
  const getUser = useCallback(async () => {
    try {
      // console.log(auth);
      const { data } = await axiosInstance.get(`/user/`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      // console.log(data.data.user._id);
      setCurrentUser(data.data.user._id);
    } catch (error) {
      console.error(error.message);
    }
  }, []);


  const getUserById = useCallback(async () => {
    try {
      // console.log(auth);
      const { data } = await axiosInstance.get(`/user/${userId}`, {
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
    getUserById();
    getUser()
    getFollowers();
    getFollowing();
  }, []);
  // console.log(followers, following);
  // console.log(user);


  /////////////////handel show edit popup
  const[showEditPopup,setShowEditPopup]=useState(false)
  const handelshowEditPopup=()=>{
    setShowEditPopup(!showEditPopup)
  }

////////////////////////////////////////////
const calculateAge=(birthdateString)=>{
  const birthdate = new Date(birthdateString);
  const today = new Date();
  
  let age = today.getFullYear() - birthdate.getFullYear();
  const monthDifference = today.getMonth() - birthdate.getMonth();
  const dayDifference = today.getDate() - birthdate.getDate();

  // Adjust age if the birthdate hasn't occurred yet this year
  if (monthDifference < 0 || (monthDifference === 0 && dayDifference < 0)) {
    age--;
  }
  return age;
}
const birthday=user.dateOfBirth
// console.log(age)
const ageuser=calculateAge(birthday)
// console.log(age)
  return (
    <>
      <div className="profile-container">
        <Navbar />
        <div className="profile-content">
          <Sidebar />
          <div className="userData">
            <div className="leftSide">
              <img src={user.profilePicture?user.profilePicture:avatar} alt="not found" className="userImage" />
              <h2 className="userName">{user.name}</h2>
              <span className="bio">{user.bio}</span>
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
                 {role !=="Mentor" ? 
                   userId ===currentUser?
                   <div className="editProfile"   onClick={handelshowEditPopup}>
                    <button>
                    <p>Edit profile</p>
                    <img src={edit} alt="not found" />
                    </button>
                   </div>
                   :
                   <div className="viewprofilementor">
                    
                      <div className="followprofile" >
                        <button>
                            <p>Follow</p>
                            <img src={follow} alt="not found" />
                        </button>
                      </div>
                      <div className="Messageprofile" >
                        <button>
                            <p>Message</p>
                            <img src={message} alt="not found" />
                        </button>
                      </div>
                   
                     <div className="RequestMentor" >
                        <button>
                            <p>Request Mentor</p>
                        </button>
                      </div>
                   </div>
                 :
                 userId ===currentUser?
                 <div className="profileuserviewbyhimself">
                    <div className="editProfile"   onClick={handelshowEditPopup}>
                  <button>
                    <p>Edit profile</p>
                    <img src={edit} alt="not found" />
                  </button>
                     </div>
                     <div className="Apply-as-mentor" >
                  <Link to="/ApplyAsMentor">
                    <button>
                      <p>Apply as Mentor</p>
                      <img src={Apply} alt="not found" />
                    </button>
                  </Link>
                     </div>
                 </div>
                
                :
                <div className="followandmessageprofile">
                  <div className="followprofile" >
                  <button>
                      <p>Follow</p>
                      <img src={follow} alt="not found" />
                  </button>
                  </div>
                 <div className="Messageprofile" >
                  <button>
                      <p>Message</p>
                      <img src={message} alt="not found" />
                  </button>
                 </div>
              </div>
                
                }
                
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
                {user.dateOfBirth &&
                   <div className="item">
                   <div className="nameIcon">
                     <img src={age} alt="not found" />
                     <p>Age :</p>
                   </div>
                   <div className="value">
                     <p>{ageuser}</p>
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
        </div>
      </div>

      {showEditPopup&&<Popup handelshowEditPopup={handelshowEditPopup} getUser={getUserById}/>}
      {showEditPopup&&<div className="overlay"></div>}
    </>
  );
};
