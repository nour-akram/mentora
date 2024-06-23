import React, { useState, useEffect } from 'react';
import "./Tasks.css";
import upload from "../../../../../assets/uploadMaterial.png";
import notasks from "../../../../../assets/no Tasks yet.png";
import { Popup } from './Popup/Popup';
import edit from "../../../../../assets/editSession.png";
import delet from "../../../../../assets/deleteSession.png";
import pdf from "../../../../../assets/pdf.png";
import { PopupDetails } from './PopupDetails/PopupDetails';
import axiosInstance from '../../../../../api/axiosConfig';
import Cookies from "universal-cookie";

export const Tasks = ({trainingId}) => {
   const [showPopupTasks, setShowPopupTasks] = useState(false);
   const [showPopupDetails, setShowPopupDetails] = useState(false);
   const [tasks, setTasks] = useState([]);
   const [selectedTask, setSelectedTask] = useState(null);
   const [isDataLoaded, setIsDataLoaded] = useState(false);

   useEffect(() => {
      const savedTasks = localStorage.getItem('tasks');
      if (savedTasks) {
         setTasks(JSON.parse(savedTasks));
      }
      setIsDataLoaded(true);
   }, []);

   useEffect(() => {
      if (isDataLoaded) {
         localStorage.setItem('tasks', JSON.stringify(tasks));
      }
   }, [tasks, isDataLoaded]);

   const handleAddMaterial = (newTask) => {
      setTasks([...tasks, newTask]);
      setShowPopupTasks(false);
   };

   const handleUpdateMaterial = (updatedTask) => {
      const updatedTasks = tasks.map(task => {
         if (task === selectedTask) {
            return { ...task, ...updatedTask };
         }
         return task;
      });
      setTasks(updatedTasks);
      setShowPopupDetails(false);
   };

   const handleShowPopupDetails = (task) => {
      setSelectedTask(task);
      setShowPopupDetails(true);
      console.log(task.attachment.url)
      localStorage.setItem('fileUrl', task.attachment.url); 
   };

   const handleClosePopupDetails = () => {
      setShowPopupDetails(false);
      setSelectedTask(null);
      localStorage.removeItem('fileUrl'); 
   };

   const handleEditTask = (task) => {
      setSelectedTask(task);
      setShowPopupTasks(true);
   };

  
   const handleDeleteTask = (index) => {
    const updatedTast = [...tasks];
    updatedTast.splice(index, 1);
    setTasks(updatedTast);
};

   
const cookies = new Cookies();
const token = cookies.get("Bearer");
const fetchTasks = async () => {
   try {
      const response = await axiosInstance.get(`/task/${trainingId}`,{
         headers: {
         Authorization: "Bearer " + token,
         
     }});
     console.log(response.data.tasks)
      setTasks(response.data.tasks); 
   } catch (error) {
      console.log('Error fetching tasks:', error);
   }
};
useEffect(() => {

   fetchTasks();
}, [trainingId]);
   return (
      <div className='session_training_container'>
         {tasks.length > 0 ? (
            <div className="sessionList">
               {tasks.map((task, index) => (
                  <div key={index} className="sessionItem">
                     <div className="left_session" onClick={() => handleShowPopupDetails(task)}>
                        <img src={pdf} alt="not found" />
                        <p>{task.description}</p>
                     </div>
                     {showPopupDetails && <PopupDetails deadline={task.deadline} fileUrl={task.attachment.url} handleClose={handleClosePopupDetails} />}
                  </div>
               ))}
            </div>
         ) : (
            <div className="notrainingYet">
               <img src={notasks} alt="not found" />
            </div>
         )}

         <div className="createTrainingSticky" onClick={() => setShowPopupTasks(!showPopupTasks)} >
            <img src={upload} alt="not found" />
         </div>
         {showPopupTasks && <Popup fetchTasks={fetchTasks} handleShowpopupTask={() => setShowPopupTasks(false)} handleAddMaterial={handleAddMaterial} handleUpdateMaterial={handleUpdateMaterial} taskToEdit={selectedTask} trainingId={trainingId} />}
         {showPopupTasks && <div className="overlay"></div>}

         {showPopupDetails && <PopupDetails task={selectedTask} handleClose={handleClosePopupDetails} />}
         {showPopupDetails && <div className="overlay"></div>}
      </div>
   );
};
