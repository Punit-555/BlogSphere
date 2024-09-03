import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { blogDetails } from "../api/postApi";
import { convertDate } from "../utility";
import blogImage from "../assets/dummy_card.jpg";
function BlogDetails() {
  const { id } = useParams();
  const [postDetails, setPostDetails] = useState();

  const fetchPostDetails = async () => {
    try {
      const response = await blogDetails(id);
      setPostDetails(response?.data);
    } catch (error) {
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
          style={{ color: "gray", fontSize: "1rem", lineHeight: "0.4  rem" }}
        >
          {convertDate(postDetails?.created_at)}
        </h2>
        <h2
          className="heading_h2"
          style={{ color: "gray", fontSize: "1rem", lineHeight: "1.5rem" }}
        >
          Created By : {postDetails?.name},{" "}
          {convertDate(postDetails?.created_at)}
        </h2>
        <p className="blog_para">{postDetails?.content}</p>
        <h2 className="heading_h2"></h2>
      </div>
    </div>
  );
}

export default BlogDetails;
