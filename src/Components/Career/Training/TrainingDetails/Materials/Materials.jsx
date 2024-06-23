import React, { useState, useEffect } from 'react';
import nomaterial from "../../../../../assets/no material yet.png";
import upload from "../../../../../assets/uploadMaterial.png";
import { Popup } from './Popup/Popup';
import { PDFPopup } from './PopupDetails/PopupDetails';
import edit from "../../../../../assets/editSession.png";
import delet from "../../../../../assets/deleteSession.png";
import pdf from "../../../../../assets/pdf.png";
import Cookies from "universal-cookie";
import axiosInstance from '../../../../../api/axiosConfig'; 

export const Materials = ({ trainingId }) => {
    const [showPopupMaterial, setShowPopupMaterial] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentMaterial, setCurrentMaterial] = useState(null);
    const [materialIndex, setMaterialIndex] = useState(null);
    const [materials, setMaterials] = useState([]);
    const [isDataLoaded, setIsDataLoaded] = useState(false);
    const [showPDFPopup, setShowPDFPopup] = useState(false);
    const [selectedFileURL, setSelectedFileURL] = useState(null);

    const handleShowPopupMaterial = () => {
        setShowPopupMaterial(!showPopupMaterial);
    };

    const cookies = new Cookies();
    const token = cookies.get("Bearer");
    const role =cookies.get("role")
    useEffect(() => {
        const fetchMaterials = async () => {
            try {
                const response = await axiosInstance.get(`/training/allTrainingMateria/${trainingId}`,{ 
                    headers: {
                    Authorization: "Bearer " + token,
                }});
                console.log(response.data.materials)
                setMaterials(response.data.materials); 
                setIsDataLoaded(true);
            } catch (error) {
                console.error('Error fetching materials:', error);
            }
        };

        fetchMaterials();
    }, [trainingId]);

    const handleAddMaterial = (newMaterial) => {
        setMaterials([...materials, newMaterial]);
        setShowPopupMaterial(false);
    };

    const handleEditMaterial = (updatedMaterial, index) => {
        const updatedMaterials = materials.map((material, i) =>
            i === index ? updatedMaterial : material
        );
        setMaterials(updatedMaterials);
        setShowPopupMaterial(false);
        setIsEditing(false);
        setCurrentMaterial(null);
        setMaterialIndex(null);
    };

    const handleDeleteMaterial = (index) => {
        const updatedMaterials = [...materials];
        updatedMaterials.splice(index, 1);
        setMaterials(updatedMaterials);
    };

    const handleShowPDFPopup = (fileURL) => {
        setSelectedFileURL(fileURL);
        setShowPDFPopup(true);
    };

    const handleClosePDFPopup = () => {
        setShowPDFPopup(false);
        setSelectedFileURL(null);
    };

    const handleEditClick = (material, index) => {
        setCurrentMaterial(material);
        setMaterialIndex(index);
        setIsEditing(true);
        setShowPopupMaterial(true);
    };

    return (
        <div className='session_training_container'>
            {materials.length > 0 ? (
                <div className="sessionList">
                    {materials.map((material, index) => (
                        <div key={index} className="sessionItem">
                            <div className="left_session" onClick={() => handleShowPDFPopup(material.file)}>
                                <img src={pdf} alt="not found" />
                                <p>{material.text}</p>
                            </div>
                            {}
                            {showPDFPopup && <PDFPopup fileURL={material.attachmentsUrl[0].url} handleClose={handleClosePDFPopup} />}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="notrainingYet">
                    <img src={nomaterial} alt="not found" />
                </div>
            )}
          {role!=="User"&&<div className="createTrainingSticky" onClick={handleShowPopupMaterial}>
                <img src={upload} alt="not found" />
            </div>
}
            
            {showPopupMaterial && <div className="overlay"></div>}
            {showPopupMaterial && (
                <Popup
                    handleShowPopupMaterial={handleShowPopupMaterial}
                    handleAddMaterial={handleAddMaterial}
                    isEditing={isEditing}
                    currentMaterial={currentMaterial}
                    handleEditMaterial={handleEditMaterial}
                    materialIndex={materialIndex}
                    trainingId={trainingId}
                />
            )}
            
            {showPDFPopup && <div className="overlay"></div>}
        </div>
    );
};
