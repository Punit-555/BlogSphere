import React, { useState } from "react";
import { convertDate } from "../utility";
import CardContent from "./CardContent";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useNavigate } from "react-router-dom";
import likeIcon from "../assets/like.png";
import likedIcon from "../assets/likedIcon.png";
import dummyCard from "../assets/dummy_card.jpg";
import { likedPost } from "../api/postApi";

function BlogCard({ allPostData, isSkeletonLoader }) {
  const navigate = useNavigate();
  const [liked, setLiked] = useState({});

  const toggleLike = (postId) => {
    setLiked((prevLiked) => ({
      ...prevLiked,
      [postId]: !prevLiked[postId],
    }));
  };

  return (
    <>
      {isSkeletonLoader ? (
        <div style={{ display: "flex", flexWrap: "wrap", gap: "10px" }}>
          {[...Array(10)].map((_, index) => (
            <div className="card fade-in-down " key={index}>
              <Skeleton height={200} style={{ zIndex: "-2" }} />
              <Skeleton height={30} width="50%" style={{ zIndex: "-2" }} />
              <Skeleton height={20} width="70%" style={{ zIndex: "-2" }} />
              <Skeleton count={3} />
            </div>
          ))}
        </div>
      ) : allPostData?.data?.length > 0 ? (
        allPostData?.data?.map((val, index) => (
          <div className="card fade-in-down" key={index}>
            <div>
              <img className="card_img" src={dummyCard} alt="" />
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
                gap: "5%",
              }}
            >
              <div style={{ width: "86%" }}>
                <h3>{val?.title}</h3> <br />
              </div>
              <div>
                <img
                  className={`like_icon ${liked[val?.id] ? "liked" : ""}`}
                  src={liked[val?.id] ? likedIcon : likeIcon}
                  alt=""
                  width={32}
                  height={30}
                  onClick={(e) => {
                    e.stopPropagation();
                    likedPost(val?.user_id, val?.id);
                    toggleLike(val?.id);
                  }}
                />
              </div>
            </div>
            <div>
              <button className="category_btn">{val?.category}</button>{" "}
            </div>
            <div>
              <br />
              <span style={{ fontSize: "1rem", color: "grey" }}>
                Created By: {val?.name ? val?.name : "--"},
                <span
                  style={{
                    position: "relative",
                    left: "165px",
                    fontSize: "0.875rem",
                  }}
                >
                  {convertDate(val?.created_at)}{" "}
                </span>
              </span>
            </div>
            <CardContent text={val?.content} val={val} />

            <div
              onClick={() => {
                navigate(`/blog-details/${val?.id}`);
              }}
              className="moreDetail"
            >
              <button className="moreDetail_btn">More Details</button>
            </div>
          </div>
        ))
      ) : (
        <h1 style={{ textAlign: "center", margin: "0 auto" }}>
          No Data Found!
        </h1>
      )}
    </>
  );
}

export default BlogCard;
