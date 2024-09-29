import React, { useEffect, useState } from "react";
import bannerImage from "../assets/banner-img.jpg";
import { TiArrowRightThick } from "react-icons/ti";
import { IoSearch } from "react-icons/io5";
import { searchPosts } from "../api/postApi";
import { allPosts } from "../api/getApi";
import BlogCard from "../components/BlogCard";
import ReactLoadingSkeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Select from "react-select";
import { categoryOptions, options } from "../utility";

function Home() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [allPostData, setAllPostData] = useState([]);
  const [isSkeletonLoader, setIsSkeletonLoader] = useState(true);
  const [isDataLoader, setIsDataLoader] = useState(true);

  const [selectedCategory, setSelectedCategory] = useState(null);
  const [enteredValue, setEnteredValue] = useState("");

  const handleCategoryChange = (selectedOption) => {
    setSelectedCategory(selectedOption);
  };

  const handleTextChange = (e) => {
    setEnteredValue(e.target.value);
  };

  useEffect(() => {
    const searchData = async () => {
      try {
        setIsSkeletonLoader(true);

        const response = await searchPosts({
          selectedCategory: selectedCategory?.value,
          enteredValue: enteredValue,
        });
        setAllPostData(response);
      } catch (error) {
        console.error(error);
      } finally {
        setIsSkeletonLoader(false);
      }
    };
    console.log("SSSSSSSSSSS", selectedCategory, enteredValue);
    const getAllPosts = async () => {
      try {
        setIsSkeletonLoader(true);
        const response = await allPosts();
        setAllPostData(response);
      } catch (error) {
        console.error(error);
      } finally {
        setIsSkeletonLoader(false);
      }
    };

    if (enteredValue === "" && !selectedCategory) {
      getAllPosts();
    } else {
      searchData();
    }
  }, [selectedCategory, enteredValue]);

  useEffect(() => {
    setTimeout(() => {
      setIsDataLoader(false);
    }, 1000);
  }, []);

  return (
    <div className="home_container">
      <section className="banner_section fade-in-down">
        <div>
          {isDataLoader ? (
            <ReactLoadingSkeleton
              height={100}
              width={600}
              style={{ zIndex: "-2" }}
            />
          ) : (
            <>
              <h1 className="heading heading_h2" style={{ fontWeight: "500" }}>
                A catchy and relevant headline that captures the essence of your
                blog.
              </h1>
            </>
          )}

          {isDataLoader ? (
            <ReactLoadingSkeleton
              height={60}
              width={400}
              style={{ margin: "20px 0px", zIndex: "-2" }}
            />
          ) : (
            <p>
              A brief, engaging description or tagline that adds context to the
              heading.
            </p>
          )}

          <button className="readMore">
            Read More <TiArrowRightThick className="readmoreIcon" />
          </button>
        </div>

        <div>
          {isDataLoader ? (
            <ReactLoadingSkeleton
              height={400}
              width={700}
              style={{ zIndex: "-2" }}
            />
          ) : (
            <img
              className="banner_image"
              src={bannerImage}
              alt="Banner"
              onLoad={() => setImageLoaded(true)}
              style={{ display: imageLoaded ? "block" : "none" }}
              onError={(e) => (e.target.style.display = "none")}
            />
          )}
        </div>
      </section>

      <section className="blog_section">
        <div>
          <div className="search_container">
            <div className="input_container">
              <label htmlFor="select">Search By</label>
              <br />
              <Select
                options={options}
                value={selectedCategory}
                onChange={handleCategoryChange}
                className="select_category"
                placeholder="Select a category"
                styles={{
                  control: (baseStyles, state) => ({
                    ...baseStyles,
                    minWidth: "160px",
                  }),
                }}
              />
            </div>

            {selectedCategory?.value === "category" ? (
              <div className="">
                <label htmlFor="category-select">Select Category</label>
                <br />
                <Select
                  options={categoryOptions}
                  value={categoryOptions.find(
                    (option) => option.value === enteredValue
                  )}
                  onChange={(option) => setEnteredValue(option?.value || "")}
                  className=""
                  placeholder="Select a category"
                  isClearable
                />
              </div>
            ) : (
              selectedCategory?.value == "title" && (
                <div className="input_container">
                  <label htmlFor="search-input">
                    Enter {selectedCategory?.value}
                  </label>
                  <input
                    type="text"
                    className="input_field"
                    name="enteredValue"
                    placeholder="Type here..."
                    value={enteredValue}
                    onChange={handleTextChange}
                    style={{ marginTop: "1px", padding: "10px" }}
                  />
                </div>
              )
            )}

            <div className="btn_group">
              <button
                style={{
                  marginBottom: "2px",
                  padding: "13px",
                  marginTop: "18px",
                }}
                className="search-btn"
                onClick={() => {
                  if (selectedCategory?.value === "category" && !enteredValue) {
                    alert("Please select a category or enter a search term.");
                  }
                }}
              >
                <IoSearch />
                Search
              </button>
            </div>
          </div>
        </div>

        <div className="card_container fade-in-down">
          <BlogCard
            isSkeletonLoader={isSkeletonLoader}
            allPostData={allPostData}
          />
        </div>
      </section>
    </div>
  );
}

export default Home;
