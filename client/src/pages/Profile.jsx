import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/userAuth";
import { updateUser } from "../api/postApi";
import { toast } from "react-toastify";
import { LoaderContext } from "../context/LoaderContext";
import { fetchUpdatedUserDetails } from "../api/getApi";

import userIcon from "../assets/user.png";

function Profile() {
  const { userDetails, setUserDetails } = useContext(AuthContext);
  const { setIsLoading } = useContext(LoaderContext);

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
    const payload = {
      formData,
      id: userDetails.id,
    };
    try {
      setIsLoading(true);
      const res = await updateUser(payload);
      console.log("REEE", res);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      toast.success(res?.data?.message);
      fetchUpdatedUserDetails();
      setUserDetails({
        ...res?.data?.user,
      });
    } catch (error) {
      console.log(error);
    }
  };

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
        <img src={userIcon} height={54} width={54} />
        <h3 style={{ fontWeight: "600", fontSize: "2.5rem", color: "#f2f2e" }}>
          Hii, <span>{userDetails?.name} </span>{" "}
        </h3>
        <div className="form form_outline">
          {/* <img src={imageUrl} alt="" /> */}
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
              maxLength={10}
              type="number"
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
