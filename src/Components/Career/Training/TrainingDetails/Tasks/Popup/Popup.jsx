import React, { useState, useEffect } from 'react';
import "./Popup.css";
import exit from "../../../../../../assets/exitWhite.png";
import upload from "../../../../../../assets/Upload icon.png";
import uploadcolored from "../../../../../../assets/uploadMaterialcolored.png";
import axiosInstance from '../../../../../../api/axiosConfig'
import Cookies from "universal-cookie";

export const Popup = ({ fetchTasks,handleShowpopupTask, handleAddMaterial, taskToEdit, handleUpdateMaterial ,trainingId}) => {
    const [fileSelected, setFileSelected] = useState();
    const [dateValue, setDateValue] = useState('');
    const [timeValue, setTimeValue] = useState('');
    const [description, setDescription] = useState('');
    const [formError, setFormError] = useState(false);

    useEffect(() => {
        if (taskToEdit) {
            setDateValue(taskToEdit.date || '');
            setTimeValue(taskToEdit.time || '');
            setDescription(taskToEdit.description || '');
        }
    }, [taskToEdit]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFileSelected(file);
        }
    };

    const handleDateChange = (e) => {
        setDateValue(e.target.value);
    };

    const handleTimeChange = (e) => {
        setTimeValue(e.target.value);
    };

    const handleDescriptionChange = (e) => {
        setDescription(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!fileSelected || dateValue.trim() === '' || timeValue.trim() === '' || description.trim() === '') {
            setFormError(true);
        } else {
            try {
                const base64File = await toBase64(document.getElementById('fileUpload').files[0]);
                const updatedTask = {
                    file: base64File,
                    date: dateValue,
                    time: timeValue,
                    description: description
                };

              
                    handleAddMaterial(updatedTask);
                

                setFormError(false);
                handleShowpopupTask();
            } catch (error) {
                console.error('Error converting file to base64:', error);
                setFormError(true);
            }
        }

    const newTask={
        task:fileSelected,
        description:description,
        deadline:`${dateValue}T00:${timeValue}Z`
       }
           console.log(newTask,"task")
  const cookies = new Cookies();
  const token = cookies.get("Bearer");
        try {
          const response = await axiosInstance.post(`/task/addTask/${trainingId}`, newTask, {
              headers: {
                  Authorization: "Bearer " + token,
                  'Content-Type': 'multipart/form-data'
              }
          });
          console.log('Response:', response.data);
          fetchTasks()
          setFileSelected(null);
          setDescription('');
          document.getElementById('fileUpload').value = '';
          handleShowpopupTask();
      } catch (error) {
          console.error('Error uploading material:', error);
      }
    };

    const toBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };

    return (
        <div className='popup_material'>
            <div className="header_material">
                <p>{taskToEdit ? 'Edit Task' : 'Upload Task'}s</p>
                <img src={exit} alt="not found" onClick={handleShowpopupTask} />
            </div>

            <form className="feilds_material" onSubmit={handleSubmit}>
                <div className="imagefeild">
                    <label htmlFor="fileUpload">Upload Task File:</label>
                    <input
                        type="file"
                        id="fileUpload"
                        accept=".pdf"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <button type="button" className="uploadButton" onClick={() => document.getElementById('fileUpload').click()}>
                        <img src={upload} alt="not found" />
                    </button>
                    {formError && !fileSelected && <span className="error">Please select a file</span>}
                </div>

                <div className="description">
                    <label>Description:</label>
                    <input
                        type="text"
                        name="description"
                        value={description}
                        onChange={handleDescriptionChange}
                    />
                    {formError && description.trim() === '' && <span className="error">Description is required</span>}
                </div>

                <div className="deadline_task">
                    <label>Task Deadline (Choose Date & Time)</label>
                    <div className="dateAndTime">
                        <input type="date" name="date" value={dateValue} onChange={handleDateChange} />
                        <input type="time" name="time" value={timeValue} onChange={handleTimeChange} />
                    </div>
                    {formError && (dateValue.trim() === '' || timeValue.trim() === '') && <span className="error">Please choose a date and time</span>}
                </div>

                <div className="upload">
                    <button type="submit">
                        <p>{taskToEdit ? 'Update' : 'Upload'}</p>
                        <img src={uploadcolored} alt="not found" />
                    </button>
                </div>
            </form>
        </div>
    );
};
