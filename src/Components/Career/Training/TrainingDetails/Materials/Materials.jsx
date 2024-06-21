import React, { useState, useEffect } from 'react';
import nomaterial from "../../../../../assets/no material yet.png";
import upload from "../../../../../assets/uploadMaterial.png";
import { Popup } from './Popup/Popup';
import { PDFPopup } from './PopupDetails/PopupDetails';
import edit from "../../../../../assets/editSession.png";
import delet from "../../../../../assets/deleteSession.png";
import pdf from "../../../../../assets/pdf.png";

export const Materials = () => {
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

    useEffect(() => {
        const savedSessions = localStorage.getItem('materials');
        if (savedSessions) {
            setMaterials(JSON.parse(savedSessions));
        }
        setIsDataLoaded(true);
    }, []);

    useEffect(() => {
        if (isDataLoaded) {
            localStorage.setItem('materials', JSON.stringify(materials));
        }
    }, [materials, isDataLoaded]);



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
                                <p>{material.description}</p>
                            </div>
                            <div className="right_session">
                                <img src={edit} alt="not found" onClick={() => handleEditClick(material, index)} />
                                <img src={delet} alt="not found" onClick={() => handleDeleteMaterial(index)} />
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="notrainingYet">
                    <img src={nomaterial} alt="not found" />
                </div>
            )}

            <div className="createTrainingSticky" onClick={handleShowPopupMaterial}>
                <img src={upload} alt="not found" />
            </div>

            {showPopupMaterial && <div className="overlay"></div>}
            {showPopupMaterial && (
                <Popup
                    handleShowPopupMaterial={handleShowPopupMaterial}
                    handleAddMaterial={handleAddMaterial}
                    isEditing={isEditing}
                    currentMaterial={currentMaterial}
                    handleEditMaterial={handleEditMaterial}
                    materialIndex={materialIndex}
                />
            )}
            {showPDFPopup && <PDFPopup fileURL={selectedFileURL} handleClose={handleClosePDFPopup} />}
            {showPDFPopup && <div className="overlay"></div>}
        </div>
    );
};
