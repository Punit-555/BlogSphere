import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { blogDetails } from "../api/postApi";
import { convertDate } from "../utility";
import blogImage from "../assets/dummy_card.jpg";
import likeIcon from "../assets/like.png";
import { LoaderContext } from "../context/LoaderContext";
function BlogDetails() {
  const { id } = useParams();
  const [postDetails, setPostDetails] = useState();
  const { setIsLoading } = useContext(LoaderContext);

  const fetchPostDetails = async () => {
    setIsLoading(true);
    try {
      const response = await blogDetails(id);
      setPostDetails(response?.data);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      setIsLoading(false);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchPostDetails();
  }, []);

  return (
    <div className="blog_detail_container">
      <div className="blog_detail_container_data">
        <img src={blogImage} alt="" className="detail_img" />
        <h1 className="heading_h1">{postDetails?.title}</h1>

        <h2
          className="heading_h2"
          style={{
            color: "gray",
            fontSize: "1rem",
            lineHeight: "0.4  rem",
            display: "flex",
            alignItems: "center",
            gap: "20px",
          }}
        >
          {convertDate(postDetails?.created_at)},{" "}
          <span
            style={{
              color: "black",
              display: "flex",
              alignItems: "center",
              gap: "20px",
            }}
          >
            <img
              className={`like_icon`}
              src={likeIcon}
              alt=""
              width={32}
              height={30}
            />
            {postDetails?.total_likes} likes{" "}
          </span>
        </h2>
        <h2
          className="heading_h2"
          style={{ color: "gray", fontSize: "1rem", lineHeight: "1.5rem" }}
        >
          Created By : {postDetails?.name},{" "}
          {convertDate(postDetails?.created_at)}
        </h2>
        <p className="blog_para">{postDetails?.content}</p>
      </div>
    </div>
  );
}

export default BlogDetails;
