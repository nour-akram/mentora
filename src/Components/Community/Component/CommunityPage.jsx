import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Cookies from "universal-cookie";
import axiosInstance from '../../../api/axiosConfig';
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "./CommunityPage.css";
import CommunityRightSection from "./CommunityRightSection.jsx";
import plus from "../../../assets/plus-colored.png";
import Create from "../../../assets/createcommunity.png";
import join from "../../../assets/joincommunity.png";
import exit from "../../../assets/exitcommunity.png";

const CommunityPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCommunity, setSelectedCommunity] = useState(null); 
  const [communities, setCommunities] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [filteredCommunities, setFilteredCommunities] = useState([]);
  const [communityDetails, setCommunityDetails] = useState(null); 

  const cookies = new Cookies();
  const token = cookies.get("Bearer");
  // console.log(selectedCommunity,"hi")
  useEffect(() => {
    const fetchCommunities = async () => {
      try {
        const response = await axiosInstance.get("/communities/getUserCommunities", {
          headers: {
            Authorization: 'Bearer ' + token
          }
        });
        const communitiesArray = Array.isArray(response.data.communities) ? response.data.communities : [];
        setCommunities(communitiesArray);
        setFilteredCommunities(communitiesArray); 
      } catch (error) {
        console.error('Error fetching communities:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCommunities();
  }, [token]);

  useEffect(() => {
    const filtered = communities.filter(community =>
      community.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredCommunities(filtered);
  }, [searchTerm, communities]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  
  const fetchCommunityDetails = async (communityId) => {
    try {
      const response = await axiosInstance.get(`/communities/${communityId}`, {
        headers: {
          Authorization: 'Bearer ' + token
        }
      });
      setCommunityDetails(response.data); 
    } catch (error) {
      console.error('Error fetching community details:', error);
    }
  };

  const handleCommunityClick = (communityId) => {
    setSelectedCommunity(communityId); 
    fetchCommunityDetails(communityId);
  };

  const [Plus, setPlus] = useState(false);
  const handelCreateAndJoinCommunity = () => {
    setPlus(!Plus);
  };

  const [overlay, setOverlay] = useState(false);
  const handleOverlay = () => {
    setOverlay(!overlay);
  };

  const [showCreatePopup, setShowCreatePopup] = useState(false);
  const handelshowCreatePopup = () => {
    setShowCreatePopup(!showCreatePopup);
    handleOverlay();
    if (!showCreatePopup) {
      setPlus(false);
    }
  };

  const [showFindPopup, setShowFindPopup] = useState(false);
  const handelshowFindPopup = () => {
    setShowFindPopup(!showFindPopup);
    handleOverlay();
    if (!showFindPopup) {
      setPlus(false);
    }
  };

  return (
    <div className="all-community-container">
      <div className="community-container">
        <div className="communities-sidebar">
          <div className="fixed-div">
            <div className="header">
              <h2>Community</h2>
              {Plus ? (
                <img src={exit} alt="not found" onClick={handelCreateAndJoinCommunity} />
              ) : (
                <img src={plus} alt="not found" onClick={handelCreateAndJoinCommunity} />
              )}
            </div>
            {Plus && (
              <div className="showpopupCreateAndJoin">
                <div className="CreateCommunity" onClick={handelshowCreatePopup}>
                  <p>Create community</p>
                  <img src={Create} alt="not found" />
                </div>
                <div className="joinCommunity" onClick={handelshowFindPopup}>
                  <p>Find community</p>
                  <img src={join} alt="not found" />
                </div>
              </div>
            )}
            <div className="search">
              <input
                type="text"
                placeholder="Search communities..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <FontAwesomeIcon icon={faSearch} className="search-icon" />
            </div>
          </div>
          <div className="communities-list">
            {loading ? (
              <div>Loading...</div>
            ) : (
              filteredCommunities.length > 0 ? (
                filteredCommunities.map((community) => (
                  <div
                    key={community._id}
                    className={`community-item ${selectedCommunity === community._id ? "selected" : ""}`}
                    onClick={() => handleCommunityClick(community._id)}
                  >
                    <div className="info-left">
                      <div>
                        <span>
                          <p>{community.name}</p>
                        </span>
                      </div>
                      <span className="communitydes">
                        {community.description}
                      </span>
                    </div>
                    <div className="info-right">
                      {community.creator.firstName} {community.creator.lastName}
                    </div>
                  </div>
                ))
              ) : (
                <div className="no_community ">No communities found.</div>
              )
            )}
          </div>
        </div>
        <div className="community-page-container">
          <div className="community-page">
            <CommunityRightSection
              showFindPopup={showFindPopup}
              handelshowFindPopup={handelshowFindPopup}
              showCreatePopup={showCreatePopup}
              handelshowCreatePopup={handelshowCreatePopup}
              overlay={overlay}
              communityDetails={communityDetails}
              selectedCommunity={selectedCommunity}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommunityPage;
