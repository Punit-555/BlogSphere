import React from "react";
import { useParams } from "react-router-dom";

function BlogDetails() {
  const { id } = useParams();
  console.log("ID", id);

  return <div></div>;
}

export default BlogDetails;
