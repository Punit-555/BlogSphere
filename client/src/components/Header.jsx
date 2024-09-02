import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Auth from "./Auth";
import { VscAccount } from "react-icons/vsc";
import { toast } from "react-toastify";
import { LoaderContext } from "../context/LoaderContext";
import { AuthContext } from "../context/userAuth";

const Header = () => {
  const [isModalOpen, setModalOpen] = useState(true);
  const [profile, setProfile] = useState();
  const { userDetails } = useContext(AuthContext);
  const navigate = useNavigate();

  const openModal = () => setModalOpen(true);
  const closeModal = () => setModalOpen(false);
  const { setIsLoading } = useContext(LoaderContext);
  const accessToken = localStorage.getItem("access_token");

  useEffect(() => {
    if (accessToken) {
      setModalOpen(false);
    }
  }, [accessToken]);

  const logoutHandler = async (e) => {
    e.preventDefault();
    localStorage.removeItem("access_token");
    setIsLoading(true);

    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    toast.success("Logout Successfully!");
    localStorage.clear();
    navigate("/");
  };

  const handleProfileChange = (e) => {
    const selectedOption = e.target.value;
    if (selectedOption === "logout") {
      logoutHandler(e);
    } else if (selectedOption === "profile") {
      navigate("/profile");
    }
    setProfile("");
  };
  return (
    <header>
      <h1
        className="logo"
        onClick={() => {
          navigate("/");
        }}
        style={{ cursor: "pointer" }}
      >
        {" "}
        BlogSphere
      </h1>
      <ul>
        <li>
          <Link to="/">HOME</Link>
        </li>
        <li>
          <Link to="/about">ABOUT US</Link>
        </li>
        <li>
          <Link to="/services">SERVICES</Link>
        </li>
        <li>
          <Link to="/contact">CONTACT</Link>
        </li>
        {accessToken && (
          <li>
            <Link to="/blogs">BLOGS</Link>
          </li>
        )}
      </ul>
      <div className="accounts">
        {accessToken ? (
          <div>
            <select
              name="profile"
              id=""
              className="select_field_input"
              onChange={handleProfileChange}
            >
              <option value="" selected disabled>
                Hi, {userDetails?.name?.split(" ")[0]}
              </option>
              <option value="profile">Profile</option>
              <option value="logout">Logout</option>
            </select>
          </div>
        ) : (
          <button className="user_btn" onClick={openModal}>
            Login / Register <VscAccount />
          </button>
        )}
      </div>

      <Auth isOpen={isModalOpen} onClose={closeModal} />
    </header>
  );
};

export default Header;
