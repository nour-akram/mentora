import React, { useState, useEffect, useContext } from 'react';
import '../Popup/Popup.css';
import exitIcon from '../../assets/exit.png'; // Renamed for clarity
import axios from 'axios';
import { User } from "../Context/userContext";
import axiosInstance from '../../api/axiosConfig';
import Cookies from "universal-cookie";

const AddReply = ({
    ShowPopup,
    showEditCommint,
    editCommintData,
    idPost,
    handleshowComments
}) => {
    // const { auth } = useContext(User);
    const [textarea, setTextarea] = useState('');
    const [selectedOption, setSelectedOption] = useState('');

    const reset = () => {
        setTextarea('');
        showEditCommint(false); // Close the popup on reset
    };

    const cookies = new Cookies();
  const token = cookies.get("Bearer");
    const handleAdd = async (e) => {
        e.preventDefault();

        try {
            const response = await axiosInstance.post(`/post/${idPost}/${editCommintData}/replyComment`, {
                content: textarea
            }, {
                headers: {
                    Authorization: "Bearer " + token,
                    "Content-Type": "application/json"
                }
            });

            if (response.status === 200) {
                console.log('Comment added Reply successfully');
                handleshowComments(idPost, true); 
                reset(); 
            }
        } catch (error) {
            console.error('Error adding Reply to the comment:', error);
        }
    };

    const handleOptionChange = (event) => {
        setSelectedOption(event.target.value);
    };

    return (
        ShowPopup && (
            <div className='popup-container'>
                <div className="popup-header">
                    <span>Add Reply</span>
                    <img src={exitIcon} alt="Close" onClick={reset} className="exit-icon" />
                </div>
                <textarea
                    placeholder='What do you want to talk about?'
                    className='textarea'
                    autoFocus
                    value={textarea}
                    onChange={(e) => setTextarea(e.target.value)}
                />
                <div className="popup-footer popup-footer-1">
                    <button
                        disabled={!textarea}
                        className={textarea.length !== 0 ? "" : "disabled"}
                        onClick={handleAdd}
                    >
                        Add Reply
                    </button>
                </div>
            </div>
        )
    );
};

export default AddReply;
