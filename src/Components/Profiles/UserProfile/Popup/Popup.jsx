import React, { useState } from 'react';
import "./Popup.css";
import exit from "../../../../assets/exitPopupColored.png";
import avatar from "../../../../assets/Default_avatar.png";
import camera from "../../../../assets/cameraIcon.png";
import save from "../../../../assets/saveUpdate.png";
import axiosInstance from '../../../../api/axiosConfig';
import Cookies from "universal-cookie";
export const Popup = ({ handelshowEditPopup ,getUser}) => {
  const [formData, setFormData] = useState({
    bio: '',
    languages: '',
    interests: '',
    country: '',
    gender: '',
    profilePicture:""
  });


  console.log(formData.profilePicture)
  const handleChange = (e) => {
    const { name, value, type, files } = e.target;
    if (type === 'file') {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleRadioChange = (e) => {
    setFormData({ ...formData, gender: e.target.value });
  };



  const cookies = new Cookies();
  const token = cookies.get("Bearer");
  const handleSubmit = async (e) => {
    e.preventDefault();

    const form={
        bio:formData.bio,
        languages:formData.languages,
        interests:formData.interests,
        country:formData.country,
        files:formData.profilePicture
    }
    console.log(form)

    try {
      const response = await axiosInstance.put('/user/updateUserData', form,{ 
       headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'multipart/form-data'
      }});
      if (response.status === 200) {
        console.log('Profile updated successfully');
        getUser();
        handelshowEditPopup();
      } else {
        console.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className='UdateProfilePopup'>
      <div className="header">
        <p>Update profile</p>
        <img src={exit} alt="not found" onClick={handelshowEditPopup} />
      </div>
      <form onSubmit={handleSubmit}>
        <div className="allFeildsUpdate">
          <div className="feildsUpdate">
            <div>
              <label htmlFor="Bio">Bio:</label>
              <input
                type="text"
                id="Bio"
                name="bio"
                value={formData.bio}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="Languages">Languages:</label>
              <input
                type="text"
                id="Languages"
                name="languages"
                value={formData.languages}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="Interests">Interests:</label>
              <input
                type="text"
                id="Interests"
                name="interests"
                value={formData.interests}
                onChange={handleChange}
              />
            </div>
            <div>
              <label htmlFor="Country">Country:</label>
              <input
                type="text"
                id="Country"
                name="country"
                value={formData.country}
                onChange={handleChange}
              />
            </div>
            <div className='genderSection'>
              <label>Gender</label>
              <div className="genderRadio">
                <label>
                  <input
                    type="radio"
                    value="Male"
                    checked={formData.gender === 'Male'}
                    onChange={handleRadioChange}
                  />
                  Male
                </label>
                <label>
                  <input
                    type="radio"
                    value="Female"
                    checked={formData.gender === 'Female'}
                    onChange={handleRadioChange}
                  />
                  Female
                </label>
              </div>
            </div>
          </div>

          <div className="imageUpdate">
            <label>Profile Picture:</label>
            <div className="imagewithborder" onClick={() => document.getElementById('profilePicture').click()}>
              <img src={formData.profilePicture ? URL.createObjectURL(formData.profilePicture) : avatar} alt="not found" />
            </div>
            <input
              type="file"
              id="profilePicture"
              name="profilePicture"
              accept="image/*"
              style={{ display: 'none' }}
              onChange={handleChange}
            />
            <img src={camera} alt="not found" className='camera' />
          </div>
        </div>

        <div className="saveUpdateButton">
          <button type="submit">
            <p>Save</p>
            <img src={save} alt="not found" />
          </button>
        </div>
      </form>
    </div>
  );
};

export default Popup;
