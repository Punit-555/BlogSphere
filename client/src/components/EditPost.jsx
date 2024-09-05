import React, { useContext, useState } from "react";
import { updatePost } from "../api/postApi";
import { toast } from "react-toastify";
import { LoaderContext } from "../context/LoaderContext";

function EditPost({ setEditModal, editModal, selectedPostData, fetchData }) {
  const [formData, setFormData] = useState({
    title: selectedPostData?.title,
    category: selectedPostData?.category,
    content: selectedPostData?.content,
  });
  const { setIsLoading } = useContext(LoaderContext);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await updatePost(selectedPostData?.id, formData);
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
      toast.success(response?.data?.message);
      setEditModal(false);
      fetchData();
    } catch (error) {
      setIsLoading(false);
      toast.error(error);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="modal-close" onClick={() => setEditModal(false)}>
          X
        </button>

        <form className="form" onSubmit={handleSubmit}>
          <h2 className="heading_h3">Edit Post</h2>

          <div className="input_container">
            <label htmlFor="title">Title</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="input_field"
              placeholder="Title"
            />
          </div>

          <div className="input_container">
            <label htmlFor="category">Category</label>
            <input
              type="text"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="input_field"
              placeholder="Category"
            />
          </div>

          <div className="input_container">
            <label htmlFor="content">Description</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="input_field"
              placeholder="Description"
            />
          </div>

          <div className="button_group">
            <button type="submit" className="create-btn">
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditPost;
