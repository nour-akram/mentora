import React, { useState,useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisV, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import "./CommunityRightSection.css";
import CommunityPageBody from './CommunityPageBody';
import community from "../../../assets/communityIcon.png";
import exit from "../../../assets/exitWhite.png";
import name from "../../../assets/communityname.png";
import Cookies from "universal-cookie";
import axiosInstance from '../../../api/axiosConfig';
import search from "../../../assets/searchCommunity.png"
import selectCommunity from "../../../assets/selectComm.png"
const CommunityRightSection = ({ showCreatePopup, handelshowCreatePopup, overlay, showFindPopup, handelshowFindPopup,communityDetails,selectedCommunity }) => {
  const [isOptionsMenuOpen, setIsOptionsMenuOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [errorMessages, setErrorMessages] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [searchResults, setSearchResults] = useState([]); 
  



  const [storedCommunityDetails, setStoredCommunityDetails] = useState(null);

  useEffect(() => {
    const storedCommunity = localStorage.getItem("communityDetails");
    if (storedCommunity) {
      setStoredCommunityDetails(JSON.parse(storedCommunity));
    }
  }, []);

  useEffect(() => {
    if (communityDetails && communityDetails.community) {
      localStorage.setItem("communityDetails", JSON.stringify(communityDetails.community));
      setStoredCommunityDetails(communityDetails.community);
    }
  }, [communityDetails]);

  // console.log(storedCommunityDetails);













  // console.log(communityDetails)
  const handleOptionsClick = () => {
    setIsOptionsMenuOpen(!isOptionsMenuOpen);
  };

  const handleDeleteOptionClick = () => {
    setIsOptionsMenuOpen(false);
    setIsDeleteModalOpen(true);
  };

  const cookies = new Cookies();
  const token = cookies.get("Bearer");
  const handleLeaveCommunity = async () => {
    try {
      const response = await axiosInstance.put(`/communities/${selectedCommunity}/leave`, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      });
      if (response.status === 200) {
        console.log(`Successfully left community with ID: ${selectedCommunity}`);
      }
    } catch (error) {
      console.error('Error leaving community:', error);
    }
  };

  const handleDeleteConfirm = () => {
    handleLeaveCommunity()
    setIsDeleteModalOpen(false);
  };

  const handleDeleteCancel = () => {
    setIsDeleteModalOpen(false);
  };



  const [focused, setFocused] = useState({
    communityName: false,
    description: false,
    track: false,
    communityfind: false,
  });

  const handleFocusBlur = (field) => (e) => {
    if (e.type === "focus") {
      setFocused({
        ...focused,
        [field]: true,
      });
    } else if (e.type === "blur") {
      if (e.target.value === "") {
        setFocused({
          ...focused,
          [field]: false,
        });
      } else {
        setFocused({
          ...focused,
          [field]: true,
        });
      }
    }
  };

  

  const [createCommunity, setCreateCommunity] = useState({
    communityName: "",
    description: "",
    track: "",
  });

  const handelchange = (e) => {
    const { name, value } = e.target;
    setCreateCommunity({
      ...createCommunity,
      [name]: value,
    });
  };

  const validateFields = () => {
    const errors = {};
    if (createCommunity.communityName.length < 3) {
      errors.communityName = "Community name must be at least 3 characters long";
    }
    if (!createCommunity.description) {
      errors.description = "Description is required";
    }
    if (!createCommunity.track) {
      errors.track = "Track is required";
    }
    setErrorMessages(errors);
    return Object.keys(errors).length === 0;
  };

  
  // console.log(token);

  const createmodel = {
    name: createCommunity.communityName,
    description: createCommunity.description,
    track: createCommunity.track
  };

  const postCreateCommunity = async () => {
    try {
      const response = await axiosInstance.post(
        "/communities/createNewCommunity",
        createmodel,
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );
      if (response.status === 201) {
        setSuccessMessage(response.data.message);
        handelshowCreatePopup();
        setShowSuccessPopup(true);
        setTimeout(() => {
          setShowSuccessPopup(false);
        }, 4000);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handelButtonCreate = (e) => {
    e.preventDefault();
    if (validateFields()) {
      postCreateCommunity();
    }
  };

  const [findCommunity, setFindCommunity] = useState({
    byname: "",
  });

  const handelChageFindCommunity = (e) => {
    const { name, value } = e.target;
    setFindCommunity({
      ...findCommunity,
      [name]: value,
    });
  };

  // console.log(searchResults)
  const postFindCommunity = async () => {
    try {
      const params = new URLSearchParams({ q: findCommunity.byname });
      const response = await axiosInstance.get(`/communities/searchCommunity?${params.toString()}`, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      });
      if (response.status === 200) {
        setSearchResults(response.data.communities);
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleButtonFindCommunity = (e) => {
    e.preventDefault();
    postFindCommunity();
  };


  const handleJoinCommunity = async (communityId) => {
    try {
      const response = await axiosInstance.post(`/communities/${communityId}/join`,
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );
      if (response.status === 200) {
        console.log(`Successfully joined community with ID: ${communityId}`);
      }
    } catch (error) {
      console.error('Error joining community:', error);
    }
  };
  return (
    <div className="right-section">
      <div className="top-bar">
        <div className="community-details">
          {storedCommunityDetails?
          <>
            <h3 className="communityName"> {storedCommunityDetails.name}</h3>
            <span className="communityMembers"> {storedCommunityDetails.members.length} members </span>
          </>
          :
          <span>select community to show it's details</span>
        }
          
        </div>
        <div className="options-chat">
          <FontAwesomeIcon icon={faEllipsisV} onClick={handleOptionsClick} />
          {isOptionsMenuOpen && (
            <div className="options-menu">
              <div onClick={handleDeleteOptionClick} >
                <div>
                  <FontAwesomeIcon icon={faSignOutAlt} />
                </div>
                <div>Leave</div>
              </div>
            </div>
          )}
        </div>
      </div>
      {selectedCommunity?<CommunityPageBody selectedCommunity={selectedCommunity} />:<div className="selectCommPlz"><img src={selectCommunity} alt="not found"/></div>}
      
      {isDeleteModalOpen && (
        <div className="delete-modal-overlay">
          <div className="delete-modal">
            <p>Are you sure you want to delete this chat?</p>
            <div className="delete-modal-buttons">
              <button onClick={handleDeleteConfirm}>OK</button>
              <button onClick={handleDeleteCancel}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {showCreatePopup &&
        <div className="popupCreateCommunity">
          <div className="header-create-community">
            <div>
              <img src={community} alt="not found" />
              <p>Create community</p>
            </div>
            <img src={exit} alt="not found" className="exit-popup" onClick={handelshowCreatePopup} />
          </div>
          <div className="all-form">
            <div className="form">
              <div className={`input-container ${focused.communityName ? 'focused' : ''}`}>
                <input type="text" name="communityName" className="input-community-name" onFocus={handleFocusBlur('communityName')} onBlur={handleFocusBlur('communityName')} onChange={handelchange} />
                <img src={name} className="communityNameIcon" alt="not found" />
                <label className='label'>community Name</label>
                {errorMessages.communityName && <span className="error-message">{errorMessages.communityName}</span>}
              </div>

              <div className={`input-container ${focused.description ? 'focused' : ''}`}>
                <input type="textarea" name="description" className="input-community-name" onFocus={handleFocusBlur('description')} onBlur={handleFocusBlur('description')} onChange={handelchange} />
                <label className='label'>description</label>
                {errorMessages.description && <span className="error-message">{errorMessages.description}</span>}
              </div>

              <div className={`input-container ${focused.track ? 'focused' : ''}`}>
                <input type="text" name="track" className="input-community-name" onFocus={handleFocusBlur('track')} onBlur={handleFocusBlur('track')} onChange={handelchange} />
                <label className='label'>track</label>
                {errorMessages.track && <span className="error-message">{errorMessages.track}</span>}
              </div>

            </div>
            <div className="createCommunityButton">
              <button onClick={handelButtonCreate}>Create Community</button>
            </div>
          </div>
        </div>
      }

      {showFindPopup &&
        <div className="popupCreateCommunity">
          <div className="header-create-community">
            <div>
              <img src={community} alt="not found" />
              <p>Find community</p>
            </div>
            <img src={exit} alt="not found" className="exit-popup" onClick={handelshowFindPopup} />
          </div>
          <div className="all-form">
            <div className="form-find">
              <div className={`input-container ${focused.communityfind ? 'focused' : ''}`}>
                <input type="text" name="byname" className="input-community-name" onFocus={handleFocusBlur('communityfind')} onBlur={handleFocusBlur('communityfind')} onChange={handelChageFindCommunity} />
                 <img src={search} alt="not found" className="find_comm" onClick={handleButtonFindCommunity}/>
                <label className='label'>Enter your community name to be fined</label>
              </div>
            </div>
            {findCommunity.byname && searchResults.length > 0 && (
            <div className="search-results">
            <h4>Search Results:</h4>
           <ul>
          {searchResults.map((result, index) => (
          <li key={result._id}>
          <div className="nameComm">
            <img src={community} alt="not found" />
            <p>{result.name}</p>
          </div>
          <button onClick={()=>handleJoinCommunity(result._id)}>Join</button>
         </li>
        ))}
       </ul>
            </div>
            )}
          </div>
        </div>
      }

      {overlay && <div className="overlay"></div>}

      {showSuccessPopup && (
        <div className="success-popup">
          <p>{successMessage}</p>
        </div>
      )}
      {showSuccessPopup && <div className="overlay"></div>}
    </div>
  );
};

export default CommunityRightSection;
