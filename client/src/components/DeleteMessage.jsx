import React from "react";

function DeleteMessage({
  setIsDeleteModal,
  setIsDelete,
  handleDelete,
  selectedPostData,
}) {
  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div
          className=""
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <h3
            className="heading_h2"
            style={{
              fontSize: "1.4rem",
              position: "absolute",
              top: "-4px",
              left: "15px",
            }}
          >
            Delete Confirmation
          </h3>
          <button
            className="modal-close"
            onClick={() => {
              setIsDeleteModal(false);
            }}
          >
            X
          </button>
        </div>
        <div className="form" style={{ marginTop: "20px" }}>
          <h3
            style={{
              color: "red",
              textAlign: "center",
              fontSize: "1.2rem",
              margin: "40px 0px",
            }}
            className="heading_h3"
          >
            Are You Sure You Want to Delete
          </h3>

          <div className="btn_group">
            <button className="btn btn_cancel" style={{ color: "white" }}>
              Cancel
            </button>
            <button
              className="btn "
              style={{ border: "1px solid #eee" }}
              onClick={() => {
                handleDelete(selectedPostData?.id);
              }}
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DeleteMessage;
