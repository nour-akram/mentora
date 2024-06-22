import React, { useContext, useEffect, useState,useCallback } from "react";
import Navbar from "../Navbar/Navbar";
import { connect,useDispatch,useSelector } from "react-redux";
import "./Home.css";
import { setArticles } from "../../redux/Articles/articlesActions";
import Sidebar from "../Sidebar/Sidebar";
import PublishBox from "../PublishPost/PublishBox";
import noposts from "../../assets/noPostsYet.png";
import Popup  from "../Popup/Popup";
import {postUserDataSuccess} from "../../redux/Register/registerActions"
import RightSection from "../Rightside/RightSection";
import Post from "../Post/Post";
import axios from "axios";
import { User } from "../Context/userContext";
import axiosInstance from "../../api/axiosConfig";
import Cookies from "universal-cookie";

const Home = () => {
  const { auth } = useContext(User);
  const [ShowPopup,setShowPopup] = useState(false);
  const [PopupType,setPopupType] = useState(null);
  const dispatch = useDispatch();
  const articles = useSelector(state => state.articles.articles);
  const [overlay, setOverlay] = useState(false);
  const handleShowPopup=() =>{
    setShowPopup(!ShowPopup);
  }

  

  const handlePopupType = (type) => {
    setPopupType(type);
  };

   const handleOverlay =(value)=>{
    setOverlay(value);
   }

   const cookies = new Cookies();
   const token = cookies.get("Bearer");
   const fetchArticles = async () => {
    try {
      const response = await axiosInstance.get("/post/", {
        headers: {
          Authorization: "Bearer " + token,
          'Content-Type': 'application/json',
        },
        
      });
      setArticles(response.data);
      dispatch(setArticles(response.data));
      // console.log("success : ",response.data);
    } catch (error) {
      console.log("Error fetching articles:", error);
    }
  };
   useEffect(() => {
    // console.log("Hellooo");
    fetchArticles();
  }, [token,fetchArticles]);

  const [currentuser,setcurrentuser]=useState();
  const[currentuserimage,setcurrentuserimage]=useState()
  const getUser = useCallback(async () => {
    try {
      // console.log(auth);
      const { data } = await axiosInstance.get(`/user/`, {
        headers: {
          Authorization: "Bearer " + token,
        },
      });
      if(data.data.user){
        setcurrentuser(data.data.user._id);
        setcurrentuserimage(data.data.user.profilePicture)
      }
      // setCurrentUser(data.data.user._id);
    } catch (error) {
      console.error(error.message);
    }
  }, [token]);


  useEffect(()=>{
    getUser();
    // console.log(currentuser,"currnt")
  },[])


  return (
    <>
    <div className="home-container">
       <Navbar/>
       <div className="home-content-container">
           <Sidebar/>
           <div className="container-home">
             <div className="home-main-content1">
               <PublishBox  handleShowPopup={handleShowPopup} handlePopupType={handlePopupType} currentuserimage={currentuserimage}/>
               {articles.length=== 0?<img src={noposts} className="nopostsyet" alt="not found"/>:
                 <Post handleOverlay={handleOverlay} fetchArticles={fetchArticles} getUser={getUser} currentuser={currentuser} currentuserimage={currentuserimage}/>
               }
               <Popup type={PopupType} ShowPopup={ShowPopup} handleShowPopup={handleShowPopup} handlePopupType={handlePopupType} />
             </div> 
             <div className="home-main-content2">
               <RightSection/>
            </div>
           </div>
           {ShowPopup && <div className="overlay"></div>}
           {overlay && <div className="overlay"></div>}
        </div>
    </div>
    </>
  );
};

const mapStateToProps = (state) => ({
  articles:state.articles.articles,
});

const mapDispatchToProps = (dispatch) => ({
  postUserDataSuccess: () => dispatch(postUserDataSuccess()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

