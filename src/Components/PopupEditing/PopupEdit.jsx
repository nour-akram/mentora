import { React, useContext, useEffect, useState } from 'react'
import "../Popup/Popup.css"
import { User } from "../Context/userContext";
import exit from "../../assets/exit.png";
import defaultimage from "../../assets/Default_avatar.png"
import Cookies from "universal-cookie";
// import axios from 'axios';
import axiosInstance from '../../api/axiosConfig';
const PopupEdit = ({ type, ShowPopup, handleShowPopup, editArticleData, handlePopupType, handleOverlay,fetchArticles }) => {
  const { auth } = useContext(User);
  const [textarea, setTextarea] = useState('');
  const {_id}=editArticleData || ""
  // console.log(_id);
  //
  useEffect(() => {
    if (editArticleData) {
      setTextarea(editArticleData.content);
    }
  }, [editArticleData]);
  const rest = () => {
    setTextarea('');
    handleShowPopup();
    handleOverlay(false);
  }

   
  const cookies = new Cookies();
  const token = cookies.get("Bearer");

 

  const handleEdit = async (e) => {
    e.preventDefault();
    if (e.target !== e.currentTarget) {
      return;
    }
    try {
      const response = await axiosInstance.put(`/post/${_id}/updatePost`, {
        content: textarea
      }, {
        headers: {
          Authorization: "Bearer " + token,
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200) {
        handleShowPopup(false);
        fetchArticles()
      } else {
        console.error('Error:', response.data.message || 'Something went wrong.');
        handleShowPopup(true, response.data.message || 'Something went wrong.');
      }
    } catch (error) {
      console.error('Error:', error.response?.data?.message || error.message);
      handleShowPopup(true, error.response?.data?.message || 'Something went wrong.');
    } finally {
      handleOverlay(false);
    }
  };
  

  const [selectedOption, setSelectedOption] = useState('');
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value);
  };

  return (
    ShowPopup &&
    <>
      <div className='popup-container'>
        <div className="popup-header">
          <span>Edite Post</span>
          <img src={exit} alt="not found" onClick={rest} />
        </div>
        <div className="popup-user-info">
          <img src={defaultimage} alt="not found" />
          <span>{editArticleData.author.firstName + " " + editArticleData.author.lastName}</span>
        </div>
        <textarea placeholder='what do you want  to talk about ?' value={textarea} className='textarea' autoFocus={true} onChange={(e) => { setTextarea(e.target.value) }} />

        <div className="popup-footer">
          <button disabled={!textarea ? true : false} className={textarea.length !== 0 ? "" : "disabled"} onClick={handleEdit}>edit</button>
        </div>
      </div>
    </>
  )
}

export default PopupEdit; 
