import React, { useState, useEffect, useContext } from 'react';
import '../Popup/Popup.css';
import exit from '../../assets/exit.png';
// import axios from 'axios';
import { User } from "../Context/userContext";
import axiosInstance from '../../api/axiosConfig';
import Cookies from "universal-cookie";

const PopupCommint = ({
    type,
    ShowPopup,
    showEditCommint,
    editCommintData,
    handleShowPopup,
    editArticleData,
    handlePopupType,
    handleOverlay,
    idPost
}) => {
    const { auth } = useContext(User);
    // Initialize state for textarea and selected option
    const [textarea, setTextarea] = useState('');
    const [selectedOption, setSelectedOption] = useState('');

    // Effect to set the textarea content when editCommintData changes
    useEffect(() => {
        if (editCommintData) {
            setTextarea(editCommintData.content);
        }
    }, [editCommintData]);

   
    const cookies = new Cookies();
  const token = cookies.get("Bearer");
    const reset = () => {
        setTextarea('');
        showEditCommint(false); 
    };
    // console.log(auth.Token);

    // Handle the edit action
    const handleEdit = async (e) => {
        e.preventDefault();

        const response = await axiosInstance.put(`/post/${idPost}/${editCommintData._id}/updateComment`,{
            content: textarea
        }, {
            headers: {
                Authorization: "Bearer " + token,
                'Content-Type': 'application/json'
            }
        });

        if (response.ok) {
            handleShowPopup(false);
        } else {
            console.error('Failed to edit comment');
        }
    };

    // Handle option change
    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (
        ShowPopup && (
            <div className='popup-container'>
                <div className="popup-header">
                    <span>Edit a Comment</span>
                    <img src={exit} alt="Close" onClick={reset} />
                </div>
                <div className="popup-user-info">
                    <span>{editCommintData.authorName}</span>
                </div>
                <textarea
                    placeholder='What do you want to talk about?'
                    className='textarea'
                    autoFocus
                    value={textarea}
                    onChange={(e) => setTextarea(e.target.value)}
                />
                <div className="popup-footer">
                    <button
                        disabled={!textarea}
                        className={textarea.length !== 0 ? "" : "disabled"}
                        onClick={handleEdit}
                    >
                        Edit
                    </button>
                </div>
            </div>
        )
    );
};

export default PopupCommint;
