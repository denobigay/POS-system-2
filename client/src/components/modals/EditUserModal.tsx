import React, { useState, useEffect } from "react";
import UserServices from "../../services/UserServices";
import RoleServices from "../../services/RoleServices";
import ErrorHandler from "../../handler/ErrorHandler";
import type { User } from "../../interfaces/User";
import type { Roles } from "../../interfaces/Roles";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface Props {
  show: boolean;
  onClose: () => void;
  onSave: () => void;
  user: User | null;
}

interface FormData {
  firstName: string;
  middleName?: string;
  lastName: string;
  suffixName?: string;
  age: string;
  gender: string;
  contact: string;
  address: string;
  roleId: string;
  email: string;
}

const EditUserModal: React.FC<Props> = ({ show, onClose, onSave, user }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    defaultValues: {
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
    },
  });

  const [roles, setRoles] = useState<Roles[]>([]);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  useEffect(() => {
    // Load roles when component mounts
    RoleServices.loadRoles()
      .then((res) => {
        if (res.status === 200) {
          setRoles(res.data.roles);
          toast.success(res.data.message);
        }
      })
      .catch((error) => {
        toast.error(error.response?.data?.message || "Error loading roles");
      });
  }, []);

  // Reset form when modal opens/closes or user changes
  useEffect(() => {
    if (user) {
      reset({
        firstName: user.first_name,
        middleName: user.middle_name || "",
        lastName: user.last_name,
        suffixName: user.suffix_name || "",
        age: user.age,
        gender: user.gender,
        contact: user.contact,
        address: user.address,
        roleId: user.role_id.toString(),
        email: user.email,
      });

      if (user.profile_image) {
        setPreviewImage(`http://localhost:8000/${user.profile_image}`);
      }
    }
  }, [user, show, reset]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = async (data: FormData) => {
    if (!user) return;

    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("firstName", data.firstName);
      formData.append("middleName", data.middleName || "");
      formData.append("lastName", data.lastName);
      formData.append("suffixName", data.suffixName || "");
      formData.append("age", data.age);
      formData.append("gender", data.gender);
      formData.append("contact", data.contact);
      formData.append("address", data.address);
      formData.append("roleId", data.roleId);
      formData.append("email", data.email);
      if (profileImage) {
        formData.append("profileImage", profileImage);
      }

      for (let pair of formData.entries()) {
        console.log(pair[0] + ", " + pair[1]);
      }

      const response = await UserServices.updateUser(user.user_id, formData);

      if (response.status === 200) {
        toast.success("User updated successfully");
        onSave();
        onClose();
      }
    } catch (error: any) {
      if (error.response?.data?.errors) {
        // Handle validation errors
        const errors = error.response.data.errors;
        Object.keys(errors).forEach((key) => {
          toast.error(errors[key][0]);
        });
      } else {
        toast.error(error.response?.data?.message || "Error updating user");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog">
      <div className="modal-dialog modal-lg" role="document">
        <div className="modal-content bg-dark text-white">
          <div className="modal-header">
            <h5 className="modal-title">Edit User</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="modal-body">
              <div className="row">
                <div className="col-md-6 mb-3">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.firstName ? "is-invalid" : ""
                    }`}
                    {...register("firstName", {
                      required: "First name is required",
                    })}
                  />
                  {errors.firstName && (
                    <div className="invalid-feedback">
                      {errors.firstName.message}
                    </div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Middle Name</label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("middleName")}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.lastName ? "is-invalid" : ""
                    }`}
                    {...register("lastName", {
                      required: "Last name is required",
                    })}
                  />
                  {errors.lastName && (
                    <div className="invalid-feedback">
                      {errors.lastName.message}
                    </div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Suffix Name</label>
                  <input
                    type="text"
                    className="form-control"
                    {...register("suffixName")}
                  />
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Age</label>
                  <input
                    type="number"
                    className={`form-control ${errors.age ? "is-invalid" : ""}`}
                    {...register("age", { required: "Age is required" })}
                  />
                  {errors.age && (
                    <div className="invalid-feedback">{errors.age.message}</div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Gender</label>
                  <select
                    className={`form-control ${
                      errors.gender ? "is-invalid" : ""
                    }`}
                    {...register("gender", { required: "Gender is required" })}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="others">Others</option>
                  </select>
                  {errors.gender && (
                    <div className="invalid-feedback">
                      {errors.gender.message}
                    </div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Contact</label>
                  <input
                    type="text"
                    className={`form-control ${
                      errors.contact ? "is-invalid" : ""
                    }`}
                    {...register("contact", {
                      required: "Contact is required",
                    })}
                  />
                  {errors.contact && (
                    <div className="invalid-feedback">
                      {errors.contact.message}
                    </div>
                  )}
                </div>

                <div className="col-md-6 mb-3">
                  <label className="form-label">Role</label>
                  <select
                    className={`form-control ${
                      errors.roleId ? "is-invalid" : ""
                    }`}
                    {...register("roleId", { required: "Role is required" })}
                  >
                    <option value="">Select Role</option>
                    {roles.map((role) => (
                      <option key={role.role_id} value={role.role_id}>
                        {role.role_name}
                      </option>
                    ))}
                  </select>
                  {errors.roleId && (
                    <div className="invalid-feedback">
                      {errors.roleId.message}
                    </div>
                  )}
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label">Email</label>
                  <input
                    type="email"
                    className={`form-control ${
                      errors.email ? "is-invalid" : ""
                    }`}
                    {...register("email", { required: "Email is required" })}
                  />
                  {errors.email && (
                    <div className="invalid-feedback">
                      {errors.email.message}
                    </div>
                  )}
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label">Address</label>
                  <textarea
                    className={`form-control ${
                      errors.address ? "is-invalid" : ""
                    }`}
                    {...register("address", {
                      required: "Address is required",
                    })}
                    rows={3}
                  />
                  {errors.address && (
                    <div className="invalid-feedback">
                      {errors.address.message}
                    </div>
                  )}
                </div>

                <div className="col-12 mb-3">
                  <label className="form-label">Profile Image</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="form-control"
                  />
                  {previewImage && (
                    <div className="mt-2">
                      <img
                        src={previewImage}
                        alt="Profile Preview"
                        className="img-thumbnail"
                        style={{
                          width: "100px",
                          height: "100px",
                          objectFit: "cover",
                        }}
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
                onClick={onClose}
                disabled={loading}
              >
                Cancel
              </button>
              {loading ? (
                <button className="btn btn-success" type="button" disabled>
                  <span
                    className="spinner-border spinner-border-sm"
                    role="status"
                    aria-hidden="true"
                  ></span>
                  Loading...
                </button>
              ) : (
                <button type="submit" className="btn btn-success">
                  Save Changes
                </button>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditUserModal;
