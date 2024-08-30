import React, { useEffect, useState } from "react";

function Profile() {
  const userDetails = JSON.parse(localStorage.getItem("user_details"));

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  useEffect(() => {
    setFormData({
      name: userDetails.name,
      email: userDetails.email,
      phoneNumber: userDetails.phoneNumber,
      password: "",
    });
  }, [userDetails]);

  const handleChange = () => {};

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
            <button className="create-btn">Submit</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Profile;
