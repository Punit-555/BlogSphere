import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/userAuth";

function Profile() {
  const { userDetails } = useContext(AuthContext);

  const [formData, setFormData] = useState({
    name: userDetails?.name,
    email: userDetails?.email,
    phoneNumber: userDetails?.phoneNumber,
    // password: ,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const sumbitHandler = async (e) => {
    e.preventDefault();
  };

  console.log("UDER", userDetails, formData);

  useEffect(() => {
    setFormData({
      name: userDetails?.name,
      email: userDetails?.email,
      phoneNumber: userDetails?.phoneNumber,
      // password: ,
    });
  }, [userDetails]);

  return (
    <div className="profile_container">
      <section className="profile_section">
        <h3>Hii, {userDetails?.name}</h3>
        <div className="form form_outline">
          <div className="input_container">
            <label htmlFor="">Name</label>
            <input
              type="text"
              className="input_field"
              onChange={handleChange}
              name="name"
              value={formData?.name}
            />
          </div>
          <div className="input_container">
            <label htmlFor="">Email</label>
            <input
              type="email"
              className="input_field"
              onChange={handleChange}
              name="email"
              value={formData?.email}
            />
          </div>
          <div className="input_container">
            <label htmlFor="">Phone Number</label>
            <input
              type="phoneNumber"
              className="input_field"
              onChange={handleChange}
              name="phoneNumber"
              value={formData?.phoneNumber}
            />
          </div>
          <div className="button_group">
            <button
              className="create-btn"
              onClick={(e) => {
                sumbitHandler(e);
              }}
            >
              Update
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Profile;
