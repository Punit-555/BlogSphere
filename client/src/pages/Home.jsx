import React, { useEffect, useState } from "react";
import bannerImage from "../assets/banner-img.jpg";
import { TiArrowRightThick } from "react-icons/ti";
import { IoSearch } from "react-icons/io5";
import { searchPosts } from "../api/postApi";
import { convertDate } from "../utility";
import dummyCard from "../assets/dummy_card.jpg";
import CardContent from "../components/CardContent";
import { allPosts } from "../api/getApi";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function Home() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [allPostData, setAllPostData] = useState([]);
  const [isSkeletonLoader, setIsSkeletonLoader] = useState(true);
  const [isDataLoader, setIsDataLoader] = useState(true);
  // const { setIsLoading: setGlobalLoading } = useContext(LoaderContext);

  const [selectedOption, setSelectedOption] = useState({
    name: "",
    enteredValue: "",
    selectedCategory: "title",
  });

  const handleSelectChange = (e) => {
    setSelectedOption({
      ...selectedOption,
      selectedCategory: e.target.value,
    });
  };

  useEffect(() => {
    const searchData = async () => {
      try {
        setIsSkeletonLoader(true);
        const response = await searchPosts(selectedOption);
        setAllPostData(response);
        setTimeout(() => {
          setIsSkeletonLoader(false);
        }, 1500);
      } catch (error) {
        setTimeout(() => {
          setIsSkeletonLoader(false);
        }, 1500);
      }
    };
    const getAllPosts = async () => {
      try {
        setIsSkeletonLoader(true);
        const response = await allPosts();
        setAllPostData(response);
        setTimeout(() => {
          setIsSkeletonLoader(false);
        }, 1500);
      } catch (error) {
        console.log(error);
        setTimeout(() => {
          setIsSkeletonLoader(false);
        }, 1500);
      }
    };

    if (selectedOption.enteredValue === "") {
      getAllPosts();
    } else {
      searchData();
    }
  }, [selectedOption]);

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
            <Skeleton height={100} width={600} />
          ) : (
            <>
              <h1 className="heading heading_h2" style={{ fontWeight: "500" }}>
                A catchy and relevant headline that captures the essence of your
                blog.
              </h1>
            </>
          )}

          {isDataLoader ? (
            <Skeleton height={60} width={400} style={{ margin: "20px 0px" }} />
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
            <Skeleton height={400} width={700} />
          ) : (
            <img
              className="banner_image"
              src={bannerImage}
              alt="Banner"
              onLoad={() => setImageLoaded(true)}
              style={{ display: imageLoaded ? "block" : "none" }}
              onError={bannerImage}
            />
          )}
        </div>
      </section>

      <section className="blog_section">
        <div>
          <div className="search_container">
            <div className="input_container">
              <label htmlFor="Select">Search By</label>
              <br />
              <select
                defaultValue={""}
                className="form_select"
                onChange={(e) => handleSelectChange(e, "CAT")}
              >
                <option value="title">Title</option>
                <option value="category">Category</option>
                <option value="createdAt">Created At</option>
              </select>
            </div>

            {selectedOption.selectedCategory === "category" ? (
              <div className="input_container">
                <label htmlFor="select">Select Category</label>
                <br />
                <select
                  defaultValue={""}
                  className="cat_select"
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
                  placeholder="type here.."
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

        <div className="card_container fade-in-down">
          {isSkeletonLoader ? (
            <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
              {[...Array(10)].map((_, index) => (
                <div className="card fade-in-down " key={index}>
                  <Skeleton height={200} />
                  <Skeleton height={30} width="50%" />
                  <Skeleton height={20} width="70%" />
                  <Skeleton count={3} />
                </div>
              ))}
            </div>
          ) : allPostData?.data?.length > 0 ? (
            allPostData?.data?.map((val, index) => (
              <div className="card fade-in-down" key={index}>
                <div>
                  <img src={dummyCard} alt="" />
                </div>
                <h3>{val?.title}</h3>
                <p style={{ fontSize: "1rem", color: "grey" }}>
                  Created By: {val?.name}, <br />
                  <span>{convertDate(val?.created_at)} </span>
                </p>
                <CardContent text={val?.content} val={val} />
                <br />
              </div>
            ))
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
