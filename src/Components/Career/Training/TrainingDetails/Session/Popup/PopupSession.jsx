import React, { useState, useEffect } from 'react';
import "./PopupSession.css";
import exit from "../../../../../../assets/exitWhite.png";
import createTraining from "../../../../../../assets/createTraining.png";
import axiosInstance from '../../../../../../api/axiosConfig';
import Cookies from "universal-cookie";

export const PopupSession = ({ handleShowPopupSession, handleAddSession, session, trainingId ,fetchAllSessionsMentor}) => {
  const [formValues, setFormValues] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
  });

  const [formErrors, setFormErrors] = useState({
    title: false,
    description: false,
    date: false,
    time: false,
  });

  useEffect(() => {
    if (session) {
      setFormValues(session);
    }
  }, [session]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const cookies = new Cookies();
  const token = cookies.get("Bearer");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errors = {
      title: !formValues.title,
      description: !formValues.description,
      date: !formValues.date,
      time: !formValues.time,
    };

    setFormErrors(errors);

    const sessionCreated = {
      title: formValues.title,
      description: formValues.description,
      trainingId: trainingId,
      date: `${formValues.date}T${formValues.time}:00Z`,
    };

    console.log(sessionCreated);

    const hasErrors = Object.values(errors).some(error => error);
    if (!hasErrors) {
      try {
        const response = await axiosInstance.post('/training/addSession', sessionCreated, {
          headers: {
            Authorization: "Bearer " + token,
          },
        });

        if (response.status === 200) {
          console.log(response);
          handleAddSession(response.data);
          setFormValues({ title: '', description: '', date: '', time: '' });
          handleShowPopupSession();
          fetchAllSessionsMentor()
        } else {
          console.log('Failed to add session:', response.statusText);
        }
      } catch (error) {
        console.error('Error adding session:', error);
      }
    } else {
      console.log('Form has errors:', errors);
    }
  };

   useEffect(()=>{
    fetchAllSessionsMentor()
   },[])

   
  return (
    <div className='popup_Session'>
      <div className="header_session">
        <p>{session ? 'Edit Session' : 'Create Session'}</p>
        <img src={exit} alt="not found" onClick={handleShowPopupSession} />
      </div>
      <form className="feilds_training" onSubmit={handleSubmit}>
        <div className="description">
          <label>Session Title:</label>
          <input
            type="text"
            name="title"
            value={formValues.title}
            onChange={handleChange}
            style={{ borderColor: formErrors.title ? 'red' : '' }}
          />
        </div>
        <div className="description">
          <label>Session Description:</label>
          <input
            type="text"
            name="description"
            value={formValues.description}
            onChange={handleChange}
            style={{ borderColor: formErrors.description ? 'red' : '' }}
          />
        </div>
        <div className="dateAndTime">
          <input
            type="date"
            name="date"
            value={formValues.date}
            onChange={handleChange}
            style={{ borderColor: formErrors.date ? 'red' : '' }}
          />
          <input
            type="time"
            name="time"
            value={formValues.time}
            onChange={handleChange}
            style={{ borderColor: formErrors.time ? 'red' : '' }}
          />
        </div>
        <div className="buttonTraining">
          <button type="submit">
            <p>{session ? 'Update Session' : 'Create Session'}</p>
            <img src={createTraining} alt="not found" />
          </button>
        </div>
      </form>
    </div>
  );
};
