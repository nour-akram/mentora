import React, { useState,useEffect } from 'react'
import Navbar from '../../Navbar/Navbar'
import Sidebar from '../../Sidebar/Sidebar'
import "./Training.css"
import notraining from "../../../assets/no trining yet.png"
import addTrainingIcon from "../../../assets/addTrainingIcon.png"
import { PopupTraining } from './Popup/PopupTraining'
import running from "../../../assets/running.png"
import finished from "../../../assets/finished.png"
import imageReact from "../../../assets/image react 1.png"
import track from "../../../assets/track.png"
import mentees from "../../../assets/mentees.png"
import {  useNavigate } from 'react-router-dom'; 
export const Training = () => {
  const [ShowPopupTraining,setShowPopupTraining]=useState(false);
  const [activeTab, setActiveTab] = useState('all');
  //
  const [trainings, setTrainings] = useState([]);
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  
  useEffect(() => {
    const savedTrainings = localStorage.getItem('trainings');
    if (savedTrainings) {
      setTrainings(JSON.parse(savedTrainings));
    }
    setIsDataLoaded(true);
  }, []);

  
  useEffect(() => {
    if (isDataLoaded) {
      localStorage.setItem('trainings', JSON.stringify(trainings));
    }
  }, [trainings, isDataLoaded]);

 //





  const handleShowPopupTraining=()=>{
    setShowPopupTraining(!ShowPopupTraining)
  }

  const handleAddTraining = (newTraining) => {
    setTrainings([...trainings, newTraining]);
    setShowPopupTraining(false);
  };
  
  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  const getTabClass = (tab) => {
    return activeTab === tab ? 'tab active' : 'tab';
  };

  // console.log(trainings.image)

  const navigate = useNavigate();
  const handelShowDetailsOfTraining = (training) => {
    navigate(`/training-details/${training.name}`, { state: { training } });
  };
  return (
    <div className="contactUss-container"style={{margin:"auto",width:"100%"}}>
    <div className="contactUss-content"  style={{width:"90%"}}>
      <div className="App">
         <div className="requests-container">
      {isDataLoaded && (
            <>
              {trainings.length > 0 ? (
                <>
                  <div className="training_header">
                    <div className={getTabClass('all')} onClick={() => handleTabClick('all')}>All</div>
                    <div className={getTabClass('running')} onClick={() => handleTabClick('running')}>
                       <p>Running</p>
                       <img src={running} alt="not found" />
                    </div>
                    <div className={getTabClass('finished')} onClick={() => handleTabClick('finished')}>
                      <p>Finished</p>
                      <img src={finished} alt="not found" />
                    </div>
                  </div>
                  <div className="training-list">
                    {trainings.map((training, index) => (
                      <div key={index} className="training-item"  onClick={() => handelShowDetailsOfTraining(training)}>
                        <div className="firstPart">
                       
                            <img src={imageReact} alt="Default" className='imageTraining' />
                     
                         <div className="middel">
                           <p>{training.name}/{training.description}</p>
                           <div className="detailsTraining">
                             <div className="track">
                                <p>{training.track}</p>
                                <img src={track} alt="not found" />
                             </div>
                             <div className="mentee">
                                <p>{training.mentees}Mentees</p>
                                <img src={mentees} alt="not found" />
                             </div>
                           </div>
                         </div>
                        </div>
                        
                        <div className="status">
                          <img src={running} alt="not found" />
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
          {ShowPopupTraining&&<PopupTraining handleShowPopupTraining={handleShowPopupTraining}  handleAddTraining={handleAddTraining}/>}
          {ShowPopupTraining && <div className="overlay"></div>}
          
     </div>
   
  </div>
  </div>
  </div>


   
  )
}
