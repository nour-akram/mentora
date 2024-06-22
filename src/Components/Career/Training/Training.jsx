import React, { useState, useEffect } from 'react';
import Navbar from '../../Navbar/Navbar';
import Sidebar from '../../Sidebar/Sidebar';
import "./Training.css";
import notraining from "../../../assets/no trining yet.png";
import addTrainingIcon from "../../../assets/addTrainingIcon.png";
import { PopupTraining } from './Popup/PopupTraining';
import active from "../../../assets/running.png";
import finished from "../../../assets/finished.png";
import pinding from "../../../assets/pending.png"
import imageReact from "../../../assets/image react 1.png";
import track from "../../../assets/track.png";
import mentees from "../../../assets/mentees.png";
import { Navigate, useNavigate } from 'react-router-dom';
import axiosInstance from '../../../api/axiosConfig';
import Cookies from "universal-cookie";

export const Training = () => {
  const [ShowPopupTraining, setShowPopupTraining] = useState(false);
  const [activeTab, setActiveTab] = useState('all');
  const [trainings, setTrainings] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const [filteredTrainings, setFilteredTrainings] = useState([]);

  const cookies = new Cookies();
  const token = cookies.get("Bearer");

  // const[count,setcount]=useState()
  console.log(trainings);

  const fetchTrainings = async () => {
    try {
      const response = await axiosInstance.get('/training/mentor', {
        headers: {
          Authorization: "Bearer " + token,
        },
      });

      let trainingData = response.data.data.trainigs ? Object.values(response.data.data.trainigs) : [];

      if (trainingData.length > 0) {
        trainingData = trainingData.slice(0, -1);
        setTrainings(trainingData);
        setFilteredTrainings(trainingData);
      }

      setIsDataLoaded(true);
      setIsLoading(false);
    } catch (err) {
      console.log(err);
      setError(err.message);
      setIsLoading(false);
    }
  };

   useEffect(() => {
    fetchTrainings();
  }, [token]);

  
  const handleTabClick = (tab) => {
    setActiveTab(tab);
    switch (tab) {
      case 'all':
        setFilteredTrainings(trainings);
        break;
      case 'running':
        setFilteredTrainings(trainings.filter(training => training.status === 'active'));
        break;
      case 'finished':
        setFilteredTrainings(trainings.filter(training => training.status === 'finished'));
        break;
      case 'pending':
        setFilteredTrainings(trainings.filter(training => training.status === 'pending'));
        break;
      default:
        setFilteredTrainings(trainings);
    }
  };

  const handleShowPopupTraining = () => {
    setShowPopupTraining(!ShowPopupTraining);
    fetchTrainings()
  };

  // const handleAddTraining = (newTraining) => {
  //   setTrainings(prevTrainings => [...prevTrainings, newTraining]);
  //   setShowPopupTraining(false);
  // };


  const getTabClass = (tab) => {
    return activeTab === tab ? 'tab active' : 'tab';
  };

  const navigate = useNavigate();
  
  const handelShowDetailsOfTraining = (training) => {
    navigate(`/training-details/${training.name}`, { state: { training } });

  };
  


  return (
    <div className="contactUss-container" style={{ margin: "auto", width: "100%" }}>
      <div className="contactUss-content" style={{ width: "90%" }}>
        <div className="App">
          <div className="requests-container">
            {isLoading ? (
              <div>Loading...</div>
            ) : error ? (
              <div>Error: {error}</div>
            ) : (
              <>
                {trainings.length>0? (
                  <>
                    <div className="training_header">
                      <div className={getTabClass('all')} onClick={() => handleTabClick('all')}>All</div>
                      <div className={getTabClass('running')} onClick={() => handleTabClick('running')}>
                        <p>Running</p>
                        <img src={active} alt="not found" />
                      </div>
                      <div className={getTabClass('finished')} onClick={() => handleTabClick('finished')}>
                        <p>Finished</p>
                        <img src={finished} alt="not found" />
                      </div>
                      <div className={getTabClass('pinding')} onClick={() => handleTabClick('pinding')}>
                        <p>Pending</p>
                        <img src={pinding} alt="not found" />
                      </div>
                    </div>
                    <div className="training-list">
                      {filteredTrainings.map((training, index) => (
                        <div key={training._id} className="training-item" onClick={() => handelShowDetailsOfTraining(training)}>
                          <div className="firstPart">
                            <img src={training.TrainingPicture?training.TrainingPicture:imageReact} alt="Default" className='imageTraining' />
                            <div className="middel">
                              <p>{training.name}/{training.description}</p>
                              <div className="detailsTraining">
                                <div className="track">
                                  <p>{training.track}</p>
                                  <img src={track} alt="not found" />
                                </div>
                                <div className="mentee">
                                  <p>{training.numberOfRequiredMentees} Mentees</p>
                                  <img src={mentees} alt="not found" />
                                </div>
                              </div>
                            </div>
                          </div>
                          <div className="status">
                          {training.status==="active"&&   <img src={active} alt="not found" />}
                          {training.status==="pending"&&   <img src={pinding} alt="not found" />}
                          {training.status==="finished"&&   <img src={finished} alt="not found" />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="notrainingYet">
                    <img src={notraining} alt="not found" />
                  </div>
                )}
              </>
            )}
            <div className="createTrainingSticky" onClick={handleShowPopupTraining}>
              <img src={addTrainingIcon} alt="not found" />
            </div>
            {ShowPopupTraining && <PopupTraining handleShowPopupTraining={handleShowPopupTraining} />}
            {ShowPopupTraining && <div className="overlay"></div>}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Training;
