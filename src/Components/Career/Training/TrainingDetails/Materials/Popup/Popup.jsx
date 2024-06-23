import React, { useState, useEffect } from 'react';
import "./Popup.css";
import exit from "../../../../../../assets/exitWhite.png";
import upload from "../../../../../../assets/Upload icon.png";
import uploadcolored from "../../../../../../assets/uploadMaterialcolored.png";
import axiosInstance from '../../../../../../api/axiosConfig'
import Cookies from "universal-cookie";
export const Popup = ({ handleShowPopupMaterial, handleAddMaterial, isEditing, currentMaterial, handleEditMaterial, materialIndex, trainingId }) => {
    const [description, setDescription] = useState('');
    const [descriptionError, setDescriptionError] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const [fileError, setFileError] = useState(false);

    console.log(selectedFile)
    useEffect(() => {
        if (isEditing && currentMaterial) {
            setDescription(currentMaterial.description);
            setSelectedFile(currentMaterial.file);
        }
    }, [isEditing, currentMaterial]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name === 'description') {
            setDescription(value);
            setDescriptionError(value.trim() === '');
        }
    };

    const handleFileUploadClick = () => {
        document.getElementById('fileUpload').click();
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedFile(file);
        setFileError(false);
    };

    
  const cookies = new Cookies();
  const token = cookies.get("Bearer");
    const handleSubmit = async (e) => {
        e.preventDefault();

        setDescriptionError(description.trim() === '');
        setFileError(!selectedFile);

        if (!descriptionError && !fileError && description.trim() !== '' && selectedFile) {
            const base64File = selectedFile instanceof File ? await toBase64(selectedFile) : selectedFile;
            const newMaterial = {
                description: description,
                files: selectedFile
            };

            try {
                const response = await axiosInstance.post(`/training/${trainingId}/uploadMaterial`, newMaterial, {
                    headers: {
                        Authorization: "Bearer " + token,
                        'Content-Type': 'multipart/form-data'
                    }
                });
                console.log('Response:', response.data);
                setSelectedFile(null);
                setDescription('');
                document.getElementById('fileUpload').value = '';
                handleShowPopupMaterial();
            } catch (error) {
                console.error('Error uploading material:', error);
            }
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
                <p>{isEditing ? 'Edit Material' : 'Upload Material'}</p>
                <img src={exit} alt="not found" onClick={handleShowPopupMaterial} />
            </div>
            <form className="feilds_material" onSubmit={handleSubmit}>
                <div className="imagefeild">
                    <label htmlFor="fileUpload">Upload PDF:</label>
                    <input
                        type="file"
                        id="fileUpload"
                        accept=".pdf"
                        style={{ display: 'none' }}
                        onChange={handleFileChange}
                    />
                    <button type="button" className="uploadButton" onClick={handleFileUploadClick}>
                        <img src={upload} alt="not found" />
                    </button>
                    {fileError && <span className="error">Please upload a file</span>}
                </div>
                <div className="description">
                    <label>Description:</label>
                    <input
                        type="text"
                        name="description"
                        value={description}
                        onChange={handleChange}
                    />
                    {descriptionError && <span className="error">Description is required</span>}
                </div>
                <div className="upload">
                    <button type="submit">
                        <p>{isEditing ? 'Update' : 'Upload'}</p>
                        <img src={uploadcolored} alt="not found" />
                    </button>
                </div>
            </form>
        </div>
    );
};
