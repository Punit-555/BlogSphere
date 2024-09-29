import React from "react";
import { RiFacebookFill } from "react-icons/ri";
import { FaWhatsapp } from "react-icons/fa";
import { FaTwitter } from "react-icons/fa6";
import { FaPinterest } from "react-icons/fa";

function Footer() {
  return (
    <footer>
      <div className="social_container">
        <div className="social_container_icons">
          <RiFacebookFill />
        </div>
        <div className="social_container_icons">
          <FaWhatsapp />
        </div>
        <div className="social_container_icons">
          <FaTwitter />
        </div>
        <div className="social_container_icons">
          <FaPinterest />
        </div>
      </div>
    </footer>
  );
}

export default Footer;
