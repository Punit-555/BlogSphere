import React, { useContext, useState } from "react";
import { toast } from "react-toastify";
import { loginUserAPI, signupUserAPI } from "../api/userAuth";
import { LoaderContext } from "../context/LoaderContext";
import { AuthContext } from "../context/userAuth";

const Auth = ({ isOpen, onClose }) => {
  const [isLogin, setIsLogin] = useState(true);
  const { setIsLoading } = useContext(LoaderContext);
  const { setIsUserLoggedIn } = useContext(AuthContext);
  const { setUserDetails, userDetails } = useContext(AuthContext);

  const [loginForm, setLoginForm] = useState({
    email: "",
    password: "",
  });

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({
      ...loginForm,
      [name]: value,
    });
  };

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let isValid = true;

    if (!formData.name) {
      toast.error("Name is required");
      isValid = false;
    }

    if (!formData.email) {
      toast.error("Email is required");
      isValid = false;
    }

    if (!formData.password) {
      toast.error("Password is required");
      isValid = false;
    }

    if (!formData.phoneNumber) {
      toast.error("Phone Number is required");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const allFieldsEmpty = Object.values(formData).every(
      (value) => value.trim() === ""
    );

    if (allFieldsEmpty) {
      toast.error("Enter all fields!");
      return;
    }

    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await signupUserAPI(formData);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        toast.success(response?.data?.message);
        onClose();
      } catch (error) {
        setIsLoading(false);
        toast.error(error.response?.data.error);
      }
    }
  };

  const handleSubmitLogin = async (e) => {
    e.preventDefault();

    const allFieldsEmpty = Object.values(loginForm).every(
      (value) => value.trim() === ""
    );

    if (allFieldsEmpty) {
      toast.error("Enter username & password!");
      return;
    }

    setIsLoading(true);
    try {
      const response = await loginUserAPI(loginForm);

      setUserDetails(response?.data?.user);

      localStorage.setItem("access_token", response?.data?.token);
      localStorage.setItem(
        "user_details",
        JSON.stringify(response?.data?.user)
      );

      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      toast.success(response?.data?.message);

      setIsUserLoggedIn(true);
      onClose();
    } catch (error) {
      setIsLoading(false);
      toast.error(error.response?.data.error);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          X
        </button>
        {isLogin ? (
          <div className="form">
            <div className="auth_heading">
              <h1>Welcome Back</h1>
            </div>

            <div className="input_container">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="input_field"
                name="email"
                onChange={handleLoginChange}
                value={loginForm.email}
              />
            </div>
            <div className="input_container">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="input_field"
                name="password"
                onChange={handleLoginChange}
                value={loginForm.password}
              />
            </div>

            <p
              className="account_text"
              onClick={() => {
                setIsLogin(false);
              }}
            >
              Don't have an account ?
            </p>
            <div className="btn_group">
              <button
                className="signup_btn"
                onClick={(e) => {
                  handleSubmitLogin(e);
                }}
              >
                Login
              </button>
            </div>
          </div>
        ) : (
          <div className="form">
            <div className="auth_heading">
              <h1>Create an account</h1>
            </div>
            <div className="input_container">
              <label htmlFor="name">Your Full Name</label>
              <input
                type="text"
                className="input_field"
                name="name"
                onChange={handleChange}
                value={formData.name}
              />
            </div>
            <div className="input_container">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className="input_field"
                name="email"
                onChange={handleChange}
                value={formData.email}
              />
            </div>
            <div className="input_container">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className="input_field"
                name="password"
                onChange={handleChange}
                value={formData?.password}
              />
            </div>
            <div className="input_container">
              <label htmlFor="phoneNumber">Phone Number</label>
              <input
                type="text"
                className="input_field"
                name="phoneNumber"
                onChange={handleChange}
                value={formData?.phoneNumber}
              />
            </div>

            <p
              className="account_text"
              onClick={() => {
                setIsLogin(!isLogin);
              }}
            >
              Already have an account?
            </p>
            <div
              className="btn_group"
              onClick={(e) => {
                handleSubmit(e);
              }}
            >
              <button className="signup_btn">Signup</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Auth;
