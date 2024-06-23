import React from 'react';
import exit from "../../../../../../assets/exitWhite.png";
import "./PopupDetails.css"
// import { Viewer } from '@react-pdf-viewer/core';
// import '@react-pdf-viewer/core/lib/styles/index.css';
export const PDFPopup = ({fileURL, handleClose}) => {
    console.log(fileURL)
    return (
        <div className="pdf_popup">
            <div className="pdf_popup_content">
                <div className="pdf_popup_header">
                    <img src={exit} alt="Close" onClick={handleClose} />
                </div>
                  {/* <a href={fileURL}>show file</a> */}
                {/* <Viewer fileUrl={fileURL}  width="100%" height="400px" /> */}
                <embed src={fileURL} type="application/pdf" width="100%" height="400px" />
            </div>
        </div>
    );
};
