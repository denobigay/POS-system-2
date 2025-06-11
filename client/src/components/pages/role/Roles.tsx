import { useState } from "react";
import AddRoleModal from "../../modals/AddRoleModal";
import RolesTable from "../../tables/RolesTable";

const Roles = () => {
  const [refreshRoles, setRefreshRoles] = useState(false);

  return (
    <div className="container mt-4">
     
      <AddRoleModal
        onRoleAdded={() => {
          setRefreshRoles(!refreshRoles);
        }}
      />
      <RolesTable refreshRoles={refreshRoles} />
    </div>
  );
};

export default Roles;
