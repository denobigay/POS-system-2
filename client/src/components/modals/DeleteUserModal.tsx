import React from "react";

interface DeleteUserModalProps {
  show: boolean;
  onClose: () => void;
  onDelete: () => void;
  userName: string;
}

const DeleteUserModal: React.FC<DeleteUserModalProps> = ({
  show,
  onClose,
  onDelete,
  userName,
}) => {
  if (!show) return null;

  return (
    <div
      className="modal show d-block"
      tabIndex={-1}
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content bg-dark text-white">
          <div className="modal-header">
            <h5 className="modal-title">Delete User</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <p>
              Are you sure you want to delete the user{" "}
              <strong>{userName}</strong>?
            </p>
          </div>
          <div className="modal-footer">
            <button className="btn btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-danger" onClick={onDelete}>
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteUserModal;
