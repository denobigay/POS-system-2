import React, {
  useState,
  type ChangeEvent,
  type FormEvent,
  useEffect,
} from "react";
import UserServices from "../../services/UserServices";
import RoleServices from "../../services/RoleServices";
import ErrorHandler from "../../handler/ErrorHandler";
import type { UserFieldErrors } from "../../interfaces/User";
import type { Roles } from "../../interfaces/Roles";
import { useRef } from "react";
import { toast } from "react-toastify";

interface AddUserModalProps {
  onUserAdded: (message: string) => void;
}

const AddUserModal: React.FC<AddUserModalProps> = ({ onUserAdded }) => {
  const [state, setState] = useState({
    loadingStore: false,
    firstName: "",
    middleName: "",
    lastName: "",
    suffixName: "",
    age: "",
    gender: "male",
    contact: "",
    address: "",
    roleId: "",
    email: "",
    password: "",
    profileImage: null as File | null,
    previewImage: "",
    errors: {} as UserFieldErrors,
    roles: [] as Roles[],
  });

  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load roles when component mounts
    RoleServices.loadRoles()
      .then((res) => {
        if (res.status === 200) {
          setState((prev) => ({
            ...prev,
            roles: res.data.roles,
          }));
        }
      })
      .catch((error) => {
        ErrorHandler(error, null);
      });
  }, []);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setState((prev) => ({
        ...prev,
        profileImage: file,
        previewImage: URL.createObjectURL(file),
      }));
    }
  };

  const handleStoreUser = (e: FormEvent) => {
    e.preventDefault();

    setState((prevState) => ({
      ...prevState,
      loadingStore: true,
    }));

    const formData = new FormData();
    formData.append("firstName", state.firstName);
    formData.append("middleName", state.middleName);
    formData.append("lastName", state.lastName);
    formData.append("suffixName", state.suffixName);
    formData.append("age", state.age);
    formData.append("gender", state.gender);
    formData.append("contact", state.contact);
    formData.append("address", state.address);
    formData.append("roleId", state.roleId);
    formData.append("email", state.email);
    formData.append("password", state.password);
    if (state.profileImage) {
      formData.append("profileImage", state.profileImage);
    }

    UserServices.storeUser(formData)
      .then((res) => {
        if (res.status === 200) {
          setState((prevState) => ({
            ...prevState,
            firstName: "",
            middleName: "",
            lastName: "",
            suffixName: "",
            age: "",
            gender: "male",
            contact: "",
            address: "",
            roleId: "",
            email: "",
            password: "",
            errors: {} as UserFieldErrors,
          }));

          if (modalRef.current) {
            // @ts-ignore
            const modal = window.bootstrap.Modal.getOrCreateInstance(
              modalRef.current
            );
            modal.hide();
            modal.dispose();
            const backdrop = document.querySelector(".modal-backdrop");
            if (backdrop) {
              backdrop.remove();
            }
            document.body.classList.remove("modal-open");
            document.body.style.overflow = "";
            document.body.style.paddingRight = "";
          }

          toast.success(res.data.message);
          onUserAdded(res.data.message);
        }
      })
      .catch((error: any) => {
        if (error.response?.status === 422) {
          setState((prevState) => ({
            ...prevState,
            errors: error.response.data.errors,
          }));
        } else {
          toast.error(error.response?.data?.message || "Error adding user");
          ErrorHandler(error, null);
        }
      })
      .finally(() => {
        setState((prevState) => ({
          ...prevState,
          loadingStore: false,
        }));
      });
  };

  return (
    <>
      <div
        className="modal fade"
        id="addUserModal"
        tabIndex={-1}
        aria-labelledby="addUserModalLabel"
        aria-hidden="true"
        ref={modalRef}
      >
        <div className="modal-dialog modal-lg">
          <div className="modal-content bg-dark text-white">
            <form onSubmit={handleStoreUser}>
              <div className="modal-header">
                <h5 className="modal-title" id="addUserModalLabel">
                  Add New User
                </h5>
                <button
                  type="button"
                  className="btn-close btn-close-white"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="firstName" className="form-label">
                      First Name
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        state.errors.firstName ? "is-invalid" : ""
                      }`}
                      id="firstName"
                      name="firstName"
                      value={state.firstName}
                      onChange={handleInputChange}
                      required
                    />
                    {state.errors.firstName && (
                      <div className="invalid-feedback">
                        {state.errors.firstName[0]}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="middleName" className="form-label">
                      Middle Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="middleName"
                      name="middleName"
                      value={state.middleName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="lastName" className="form-label">
                      Last Name
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        state.errors.lastName ? "is-invalid" : ""
                      }`}
                      id="lastName"
                      name="lastName"
                      value={state.lastName}
                      onChange={handleInputChange}
                      required
                    />
                    {state.errors.lastName && (
                      <div className="invalid-feedback">
                        {state.errors.lastName[0]}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="suffixName" className="form-label">
                      Suffix Name
                    </label>
                    <input
                      type="text"
                      className="form-control"
                      id="suffixName"
                      name="suffixName"
                      value={state.suffixName}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="age" className="form-label">
                      Age
                    </label>
                    <input
                      type="number"
                      className={`form-control ${
                        state.errors.age ? "is-invalid" : ""
                      }`}
                      id="age"
                      name="age"
                      value={state.age}
                      onChange={handleInputChange}
                      required
                    />
                    {state.errors.age && (
                      <div className="invalid-feedback">
                        {state.errors.age[0]}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="gender" className="form-label">
                      Gender
                    </label>
                    <select
                      className={`form-control ${
                        state.errors.gender ? "is-invalid" : ""
                      }`}
                      id="gender"
                      name="gender"
                      value={state.gender}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="others">Others</option>
                    </select>
                    {state.errors.gender && (
                      <div className="invalid-feedback">
                        {state.errors.gender[0]}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="contact" className="form-label">
                      Contact
                    </label>
                    <input
                      type="text"
                      className={`form-control ${
                        state.errors.contact ? "is-invalid" : ""
                      }`}
                      id="contact"
                      name="contact"
                      value={state.contact}
                      onChange={handleInputChange}
                      required
                    />
                    {state.errors.contact && (
                      <div className="invalid-feedback">
                        {state.errors.contact[0]}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="roleId" className="form-label">
                      Role
                    </label>
                    <select
                      className={`form-control ${
                        state.errors.roleId ? "is-invalid" : ""
                      }`}
                      id="roleId"
                      name="roleId"
                      value={state.roleId}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select Role</option>
                      {state.roles.map((role) => (
                        <option key={role.role_id} value={role.role_id}>
                          {role.role_name}
                        </option>
                      ))}
                    </select>
                    {state.errors.roleId && (
                      <div className="invalid-feedback">
                        {state.errors.roleId[0]}
                      </div>
                    )}
                  </div>
                </div>
                <div className="mb-3">
                  <label htmlFor="address" className="form-label">
                    Address
                  </label>
                  <textarea
                    className={`form-control ${
                      state.errors.address ? "is-invalid" : ""
                    }`}
                    id="address"
                    name="address"
                    value={state.address}
                    onChange={handleInputChange}
                    required
                  />
                  {state.errors.address && (
                    <div className="invalid-feedback">
                      {state.errors.address[0]}
                    </div>
                  )}
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="email" className="form-label">
                      Email
                    </label>
                    <input
                      type="email"
                      className={`form-control ${
                        state.errors.email ? "is-invalid" : ""
                      }`}
                      id="email"
                      name="email"
                      value={state.email}
                      onChange={handleInputChange}
                      required
                    />
                    {state.errors.email && (
                      <div className="invalid-feedback">
                        {state.errors.email[0]}
                      </div>
                    )}
                  </div>
                  <div className="col-md-6 mb-3">
                    <label htmlFor="password" className="form-label">
                      Password
                    </label>
                    <input
                      type="password"
                      className={`form-control ${
                        state.errors.password ? "is-invalid" : ""
                      }`}
                      id="password"
                      name="password"
                      value={state.password}
                      onChange={handleInputChange}
                      required
                    />
                    {state.errors.password && (
                      <div className="invalid-feedback">
                        {state.errors.password[0]}
                      </div>
                    )}
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label htmlFor="profileImage" className="form-label">
                      Profile Image
                    </label>
                    <input
                      type="file"
                      className="form-control"
                      id="profileImage"
                      name="profileImage"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    {state.previewImage && (
                      <div className="mt-2">
                        <img
                          src={state.previewImage}
                          alt="Profile Preview"
                          className="img-thumbnail"
                          style={{ maxWidth: "200px" }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </button>
                {state.loadingStore ? (
                  <button className="btn btn-primary" type="button" disabled>
                    <span
                      className="spinner-border spinner-border-sm"
                      role="status"
                      aria-hidden="true"
                    ></span>
                    Loading...
                  </button>
                ) : (
                  <button type="submit" className="btn btn-danger">
                    Save User
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddUserModal;
