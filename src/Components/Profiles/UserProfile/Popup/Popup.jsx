import React from 'react'
import exit from "../../../../assets/exitPopupColored.png"
export const Popup = () => {
  return (
    <div className='UdateProfilePopup'>
        <div className="header">
            <p>Update profile</p>
            <img src={exit} alt="not found" />
        </div>
        <div className="allFeildsUpdate">
         <div className="feildsUpdate">
            <div>
                <label htmlFor="Bio">Bio</label>
                <input type="text" id='Bio' />
            </div>
            <div>
                <label htmlFor="Languages">Languages</label>
                <input type="text" id='Languages' />
            </div>
            <div>
                <label htmlFor="Interests">Interests</label>
                <input type="text" id='Interests' />
            </div>
            <div>
                <label htmlFor="Country">Country</label>
                <input type="text" id='Country' />
            </div>
            <div>
                <label htmlFor="Gender">Gender</label>
                 <div className="genderRadio">
                  <label>
                    <input type="radio" value="Male" />
                     Male
                  </label>
                  <label>
                    <input type="radio" value="Female" />
                    Female
                  </label>
                </div>
            </div>
         </div>


         <div className="imageUpdate">
            <label>Profile Picture :</label>
         </div>
        </div>
         
    </div>
  )
}
