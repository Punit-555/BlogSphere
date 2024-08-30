import React, { useContext, useEffect, useState } from "react";
import bannerImage from "../assets/banner-img.jpg";
import { TiArrowRightThick } from "react-icons/ti";
import axios from "axios";
import { LoaderContext } from "../context/LoaderContext";
import { AuthContext } from "../context/userAuth";

const truncateText = (text, limit) => {
  const words = text.split(" ");
  if (words.length <= limit) return text;
  return words.slice(0, limit).join(" ") + "...";
};

const CardContent = ({ text, val }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const limit = 25;
  const truncatedText = truncateText(text, limit);

  return (
    <div>
      <p>{isExpanded ? text : truncatedText}</p>
      {text.split(" ").length > limit && (
        <p onClick={() => setIsExpanded(!isExpanded)}>
          {isExpanded ? "Show Less" : "Continue reading..."}
        </p>
      )}
    </div>
  );
};

function Home() {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [allPostData, setAllPostData] = useState();
  const { setIsLoading } = useContext(LoaderContext);

  useEffect(() => {
    const getAllPost = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(
          `${process.env.REACT_APP_BASE_URL}/posts/all-posts`
        );
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
        setAllPostData(response?.data);
        return response.data;
      } catch (error) {
        console.error(error);
        return error;
      }
    };
    getAllPost();
  }, []);

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

      <h1>All Posts</h1>
      <section className="blog_section">
        <div className="card_container">
          {allPostData?.map((val, index) => {
            return (
              <div className="card" key={index}>
                <h3>
                  {val?.title} ,
                  <span
                    style={{
                      color: "grey",
                      fontWeight: "100",
                      fontSize: "0.9em",
                    }}
                  >
                    {/* {convertDate(val?.created_at)} */}
                    &nbsp; 2 min ago
                  </span>
                </h3>
                <CardContent text={val?.content} val={val} />
                <br />
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}

export default Home;
