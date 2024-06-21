import React, { useState, useEffect } from 'react';
import "./PopupSession.css";
import exit from "../../../../../../assets/exitWhite.png";
import createTraining from "../../../../../../assets/createTraining.png";

export const PopupSession = ({ handleShowPopupSession, handleAddSession, session }) => {
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

  const handleSubmit = (e) => {
    e.preventDefault();

    const errors = {
      title: !formValues.title,
      description: !formValues.description,
      date: !formValues.date,
      time: !formValues.time,
    };

    setFormErrors(errors);

    const hasErrors = Object.values(errors).some(error => error);
    if (!hasErrors) {
      handleAddSession(formValues);
      setFormValues({ title: '', description: '', date: '', time: '' });
      handleShowPopupSession();
    } else {
      console.log('Form has errors:', errors);
    }
  };

  return (
    <div className='popup_Training'>
      <div className="header_training">
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
