import React from 'react';
import exit from "../../../../../../assets/exitWhite.png";
import "./PopupDetails.css"
export const PDFPopup = ({fileURL, handleClose}) => {
    return (
        <div className="pdf_popup">
            <div className="pdf_popup_content">
                <div className="pdf_popup_header">
                    <img src={exit} alt="Close" onClick={handleClose} />
                </div>
                <embed src={fileURL} type="application/pdf" width="100%" height="400px" />
            </div>
        </div>
    );
};
