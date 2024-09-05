import React from "react";

function ContactUs() {
  return (
    <div className="home_container">
      <section className="about_form_section">
        <div className="about_form">
          <div className="about_form_input_container">
            <h1 className="heading_h1">Contact Us</h1>
            <label htmlFor="">Name</label>
            <input type="text" className="about_form_input_field" />
          </div>
          <div className="about_form_input_container">
            <label htmlFor="">Email</label>
            <input type="text" className="about_form_input_field" />
          </div>
          <div className="about_form_input_container">
            <label htmlFor="">Message</label>
            <textarea
              type="text"
              className="about_form_input_field"
              rows="5"
              cols={2}
            />
          </div>
          <div className="about_form_input_container">
            <button className="about_form_input_container_btn">Submit</button>
          </div>
        </div>
      </section>
    </div>
  );
}

export default ContactUs;
