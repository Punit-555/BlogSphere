import React, { useContext, useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Auth from "./Auth";
import { toast } from "react-toastify";
import { LoaderContext } from "../context/LoaderContext";
import { AuthContext } from "../context/userAuth";

const Header = () => {
  const ref = useRef(null);
  const [isModalOpen, setModalOpen] = useState(false);
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

  useEffect(() => {
    if (ref.current) {
      ref.current.scrollTop = 0;
    }
  }, []);

  return (
    <header className="header-fixed" ref={ref}>
      <div className="header-limiter">
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

        <nav className="nav_item">
          {accessToken && <Link to="/blogs">Blogs</Link>}
          <Link to="/contact">Contact</Link>

          {accessToken ? (
            <select
              name="profile"
              id=""
              className="profile_select"
              onChange={handleProfileChange}
              defaultValue={""}
            >
              <option value="" selected disabled>
                Hi, {userDetails?.name?.split(" ")[0]}
              </option>
              <option value="profile">Profile</option>
              <option value="logout">Logout</option>
            </select>
          ) : (
            <button className="btn  btn_login" onClick={openModal}>
              Login / Register
            </button>
          )}
        </nav>
      </div>
      <Auth isOpen={isModalOpen} onClose={closeModal} />
    </header>
  );
};

export default Header;
