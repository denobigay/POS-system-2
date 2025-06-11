import { useEffect, useState } from "react";
import type { Roles } from "../../interfaces/Roles";
import RoleServices from "../../services/RoleServices";
import ErrorHandler from "../../handler/ErrorHandler";
import Spinner from "./Spinner";
import EditRoleModal from "../modals/EditRoleModal";
import DeleteRoleModal from "../modals/DeleteRoleModal";
import { toast } from "react-toastify";

interface RolesTableProps {
  refreshRoles: boolean;
}

const RolesTable = ({ refreshRoles }: RolesTableProps) => {
  const [state, setState] = useState({
    loadingRoles: true,
    roles: [] as Roles[],
    showEditModal: false,
    selectedRole: null as Roles | null,
    showDeleteModal: false,
    roleToDelete: null as Roles | null,
    error: null as string | null,
  });

  const handleLoadRoles = async () => {
    try {
      setState((prev) => ({ ...prev, loadingRoles: true, error: null }));
      console.log("Loading roles..."); // Debug log

      const res = await RoleServices.loadRoles();
      console.log("Roles response:", res); // Debug log

      if (res.status === 200) {
        setState((prev) => ({
          ...prev,
          roles: res.data.roles,
          error: null,
        }));
      } else {
        console.error("Unexpected status error loading Roles:", res.status);
        setState((prev) => ({
          ...prev,
          error: `Unexpected status: ${res.status}`,
        }));
      }
    } catch (error: any) {
      console.error("Error loading roles:", error); // Debug log
      setState((prev) => ({
        ...prev,
        error: error.response?.data?.message || "Error loading roles",
      }));
      ErrorHandler(error, null);
    } finally {
      setState((prev) => ({
        ...prev,
        loadingRoles: false,
      }));
    }
  };

  useEffect(() => {
    handleLoadRoles();
  }, [refreshRoles]);

  const handleEditClick = (role: Roles) => {
    setState((prev) => ({
      ...prev,
      showEditModal: true,
      selectedRole: role,
    }));
  };

  const handleEditClose = () => {
    setState((prev) => ({
      ...prev,
      showEditModal: false,
      selectedRole: null,
    }));
  };

  const handleEditSave = () => {
    handleLoadRoles(); // Refresh the roles list
    handleEditClose();
  };

  const handleDeleteClick = (role: Roles) => {
    setState((prev) => ({
      ...prev,
      showDeleteModal: true,
      roleToDelete: role,
    }));
  };

  const handleDeleteClose = () => {
    setState((prev) => ({
      ...prev,
      showDeleteModal: false,
      roleToDelete: null,
    }));
  };

  const handleDeleteConfirm = async () => {
    if (!state.roleToDelete) return;

    try {
      const response = await RoleServices.deleteRole(
        state.roleToDelete.role_id
      );
      if (response.status === 200) {
        toast.success("Role deleted successfully");
        handleLoadRoles(); // Refresh the roles list
        handleDeleteClose();
      }
    } catch (error: any) {
      if (error.response?.status === 422) {
        // Show error message from backend
        toast.error(
          error.response.data.message ||
            "Cannot delete role because it is assigned to users"
        );
      } else {
        toast.error(error.response?.data?.message || "Error deleting role");
      }
    }
  };

  return (
    <div className="p-4">
      <div className="d-flex text-white justify-content-between align-items-center mb-3">
        <h2>Roles</h2>
        <button
          className="btn btn-danger"
          data-bs-toggle="modal"
          data-bs-target="#addRoleModal"
        >
          Add Role
        </button>
      </div>

      {state.error && (
        <div className="alert alert-danger" role="alert">
          {state.error}
        </div>
      )}

      <table className="table table-dark table-striped table-hover rounded" style={{ borderRadius: '12px', overflow: 'hidden' }}>
        <thead className="align-middle">
          <tr className="align-middle">
            <th>ID</th>
            <th>Role Name</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {state.loadingRoles ? (
            <tr className="align-middle">
              <td colSpan={4} className="text-center">
                <Spinner />
              </td>
            </tr>
          ) : state.roles.length === 0 ? (
            <tr className="align-middle">
              <td colSpan={4} className="text-center">
                No roles found.
              </td>
            </tr>
          ) : (
            state.roles.map((role, index) => (
              <tr className="" key={index}>
                <td>{index + 1}</td>
                <td>{role.role_name}</td>
                <td>{role.description}</td>
                <td>
                  <div className="btn-group">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => handleEditClick(role)}
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      className="btn btn-danger"
                      onClick={() => handleDeleteClick(role)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <EditRoleModal
        show={state.showEditModal}
        onClose={handleEditClose}
        onSave={handleEditSave}
        role={state.selectedRole}
      />

      <DeleteRoleModal
        show={state.showDeleteModal}
        onClose={handleDeleteClose}
        onDelete={handleDeleteConfirm}
        roleName={state.roleToDelete?.role_name || ""}
      />
    </div>
  );
};

export default RolesTable;
