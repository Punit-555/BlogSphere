import React, { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { allPostsByUser, createPost, deletePost } from "../api/postApi";
import { LoaderContext } from "../context/LoaderContext";
import { AuthContext } from "../context/userAuth";
import { convertDate } from "../utility";

function BlogsPage() {
  const { setIsLoading } = useContext(LoaderContext);
  const { userDetails } = useContext(AuthContext);
  const [createdPosts, setCreatedPosts] = useState();
  const token = localStorage.getItem("access_token");

  const [formData, setFormData] = useState({
    title: "",
    content: "",
    category: "",
  });

  const [errors, setErrors] = useState({
    title: "",
    content: "",
    category: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = "Title is required";
      isValid = false;
    }

    if (!formData.content.trim()) {
      newErrors.content = "Description is required";
      isValid = false;
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      setIsLoading(true);
      try {
        const response = await createPost(formData);
        setTimeout(() => {
          setIsLoading(false);
          toast.success("Post created successfully!");
          fetchData();
        }, 1000);
        setFormData({
          title: "",
          content: "",
          category: "",
        });
      } catch (error) {
        setIsLoading(false);
        toast.error("Something went wrong!.");
      }
    } else {
      setIsLoading(false);
      toast.error("Please fill out all fields correctly.");
      return;
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await allPostsByUser(userDetails?.id);
      setCreatedPosts(response);
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    } catch (error) {}
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (postId) => {
    if (token) {
      setIsLoading(true);
      try {
        const response = await deletePost(postId);
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);

        toast.success(response?.message);
        fetchData();
      } catch (error) {}
    } else {
      toast.error("Login to delete the Posts!");
      return;
    }
  };

  return (
    <div className="blog_container">
      <div>
        <h1>Create Posts</h1>
        <div className="form">
          <div className="input_container">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              className="input_field"
              value={formData.title}
              onChange={handleChange}
            />
            {errors.title && <p className="error">{errors.title}</p>}
          </div>
          <div className="input_container">
            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              className="select_field"
              value={formData.category}
              onChange={handleChange}
            >
              <option value="">Select a category</option>
              <option value="Technology">Technology</option>
              <option value="Health & Wellness">Health & Wellness</option>
              <option value="Finance">Finance</option>
              <option value="Food & Recipes">Food & Recipes</option>
              <option value="Lifestyle">Lifestyle</option>
              <option value="Education">Education</option>
              <option value="Entertainment">Entertainment</option>
            </select>
            {errors.category && <p className="error">{errors.category}</p>}
          </div>
          <div className="input_container">
            <label htmlFor="content">Description</label>
            <textarea
              id="content"
              name="content"
              className="textarea_field"
              value={formData.content}
              onChange={handleChange}
              rows="10"
            />
            {errors.content && <p className="error">{errors.content}</p>}
          </div>

          <div className="button_group">
            <button className="create-btn" onClick={handleSubmit}>
              Submit
            </button>
          </div>
        </div>
      </div>

      <div>
        <h1>Posts Created By You .</h1>

        <div className="card_container">
          {createdPosts?.length > 0 &&
            createdPosts?.map((val, index) => {
              return (
                <div
                  key={index}
                  className="blogCard"
                  style={{ position: "relative", width: "100%" }}
                >
                  <button
                    className="deleteButton"
                    onClick={() => handleDelete(val.id)}
                  >
                    &#x2716;
                  </button>
                  <h3>{val?.title}</h3>
                  <h4>{val?.category}</h4>
                  <p>{val?.content}</p>
                  <span style={{ color: "grey", fontWeight: "100" }}>
                    {convertDate(val?.created_at)}
                  </span>
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default BlogsPage;
