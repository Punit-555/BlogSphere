import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { blogDetails } from "../api/postApi";
import { convertDate } from "../utility";
import blogImage from "../assets/dummy_card.jpg";
import likeIcon from "../assets/like.png";
import { LoaderContext } from "../context/LoaderContext";
import { BiUser } from "react-icons/bi";
import CommentComponent from "../components/CommentComponent";
import { Button } from "@mui/material";
function BlogDetails() {
  const { id } = useParams();
  const [postDetails, setPostDetails] = useState();
  const { setIsLoading } = useContext(LoaderContext);
  const [addComment, setAddComment] = useState(false);

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
        Created By : {postDetails?.name},{" "}
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
        <p className="blog_para">{postDetails?.content}</p>
        <div style={{ display: "flex", gap: "20px", alignItems: "center" }}>
          <h2 className="heading_h3" style={{ color: "black" }}>
            Comments:
          </h2>
          <Button
            varient={"outlined"}
            className="btn btn_login"
            onClick={() => {
              setAddComment(!addComment);
            }}
          >
            Add Comments{" "}
          </Button>
        </div>
        {addComment && (
          <div
            className="input_container"
            style={{ display: "flex", alignItems: "center", gap: "20px" , marginBottom:"20px" }}
          >
            <input
              type="text"
              className="input_field"
              style={{ maxWidth: "400px" }}
            />
            <button
              className="btn btn_login"
              style={{
                position: "relative",
              }}
            >
              Submit
            </button>
          </div>
        )}
        <div className="comment_container">
          {postDetails?.comments?.map((comments) => {
            return <CommentComponent comments={comments} />;
          })}
        </div>
      </div>
    </div>
  );
}

export default BlogDetails;
