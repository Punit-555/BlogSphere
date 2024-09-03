import React, { useContext, useEffect, useState } from "react";
import bannerImage from "../assets/banner-img.jpg";
import { TiArrowRightThick } from "react-icons/ti";
import axios, { all } from "axios";
import { LoaderContext } from "../context/LoaderContext";
import { FaArrowRight } from "react-icons/fa6";
import { useNavigate } from "react-router-dom";
import { IoSearch } from "react-icons/io5";
import { searchPosts } from "../api/postApi";
import { convertDate } from "../utility";
import dummyCard from "../assets/dummy_card.jpg";

const truncateText = (text, limit) => {
  const words = text.split(" ");
  if (words.length <= limit) return text;
  return words.slice(0, limit).join(" ") + "...";
};

const CardContent = ({ text, val }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const limit = 18;
  const truncatedText = truncateText(text, limit);
  const navigate = useNavigate();

  return (
    <div>
      <p>{isExpanded ? text : truncatedText}</p>
      {text.split(" ").length > limit && (
        <p onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? "Show Less" : "Continue reading..."}
        </p>
      )}

      <button
        className="card_arrow_icon arrow_btn"
        onClick={() => {
          navigate(`/blog-details/${val?.id}`);
        }}
      >
        <p className="">
          Read more &nbsp;
          <FaArrowRight />
        </p>
      </button>
    </div>
  );
};

function Home() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [allPostData, setAllPostData] = useState([]);
  const { setIsLoading } = useContext(LoaderContext);

  const [selectedOption, setSelectedOption] = useState({
    name: "",
    enteredValue: "",
    selectedCategory: "title",
  });

  useEffect(() => {
    const searchData = async () => {
      try {
        setIsLoading(true);
        const response = await searchPosts(selectedOption);
        console.log("Search Response:", response);
        setAllPostData(response);
        // setTimeout(() => {
        //   setIsLoading(false);
        // }, 500);
      } catch (error) {
        console.error("Error searching posts:", error);
      }
    };

    if (selectedOption.enteredValue !== "") {
      searchData();
    }
  }, [selectedOption, setIsLoading]); // Ensure setIsLoading is part of the dependency array if defined outside

  const handleSelectChange = (e) => {
    setSelectedOption({
      ...selectedOption,
      selectedCategory: e.target.value,
    });
  };

  useEffect(() => {
    const searchData = async () => {
      try {
        setIsLoading(true);
        const response = await searchPosts(selectedOption);
        setAllPostData(response);
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (error) {
        console.log(error);
      }
    };
    if (selectedOption?.enteredValue !== "") {
      searchData();
    }
  }, [selectedOption]);

  console.log("ALL POS", allPostData);
  return (
    <div className="home_container">
      <section className="banner_section">
        <div>
          <h1>
            A catchy and relevant headline that captures the essence of your
            blog.
          </h1>
          <p>
            A brief, engaging description or tagline that adds context to the
            heading.
          </p>
          <button className="readMore">
            Read More <TiArrowRightThick className="readmoreIcon" />
          </button>
        </div>

        <div>
          {!imageLoaded && (
            <div className="image-placeholder">
              <img
                className="banner_image"
                src={bannerImage}
                alt="Banner"
                onLoad={() => setImageLoaded(true)}
                style={{ display: imageLoaded ? "block" : "none" }}
                onError={bannerImage}
              />
            </div>
          )}
          <img
            className="banner_image"
            src={bannerImage}
            alt="Banner"
            onLoad={() => setImageLoaded(true)}
            style={{ display: imageLoaded ? "block" : "none" }}
          />
        </div>
      </section>

      <section className="blog_section">
        <div>
          <h1 className="heading_h1">Search Here</h1>
        </div>

        <div>
          <div className="search_container">
            <div className="input_container">
              <label htmlFor="Select">Search By</label>
              <select
                className="form_select"
                onChange={(e) => {
                  handleSelectChange(e, "CAT");
                }}
              >
                <option value="title">Title</option>
                <option value="category">Category</option>{" "}
                <option value="createdAt">Created At</option>
              </select>
            </div>

            {selectedOption.selectedCategory === "category" ? (
              <div className="input_container">
                <label htmlFor="select">Select Category</label>
                <select
                  className="form_select"
                  onChange={(e) =>
                    setSelectedOption({
                      ...selectedOption,
                      enteredValue: e.target.value,
                    })
                  }
                >
                  <option value="" selected disabled>
                    Select a category
                  </option>
                  <option value="Technology">Technology</option>
                  <option value="Health & Wellness">Health & Wellness</option>
                  <option value="Finance">Finance</option>
                  <option value="Food & Recipes">Food & Recipes</option>
                  <option value="Lifestyle">Lifestyle</option>
                  <option value="Education">Education</option>
                  <option value="Entertainment">Entertainment</option>
                </select>
              </div>
            ) : (
              <div className="input_container">
                <label htmlFor="input">Enter Text</label>
                <input
                  type="text"
                  className="input_field"
                  name="enteredValue"
                  onChange={(e) => {
                    setSelectedOption({
                      ...selectedOption,
                      enteredValue: e.target.value,
                    });
                  }}
                />
              </div>
            )}

            <div className="btn_group">
              <button className="search-btn">
                <IoSearch />
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="card_container">
          {allPostData?.data?.length > 0 ? (
            allPostData?.data?.map((val, index) => {
              return (
                <div className="card" key={index}>
                  <div>
                    <img src={dummyCard} alt="" />
                  </div>
                  <h3>{val?.title}</h3>
                  <p style={{ fontSize: "1rem", color: "grey" }}>
                    Created By: {val?.name}, <br />
                    <span>{convertDate(val?.created_at)} </span>
                  </p>{" "}
                  <CardContent text={val?.content} val={val} />
                  <br />
                </div>
              );
            })
          ) : (
            <h1 style={{ textAlign: "center", margin: "0 auto" }}>
              No Data Found!
            </h1>
          )}
        </div>
      </section>
    </div>
  );
}

export default Home;
