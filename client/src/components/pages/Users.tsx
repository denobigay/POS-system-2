import { useState } from "react";
import UsersTable from "../tables/UsersTable";
import AddUserModal from "../modals/AddUserModal";

const Users = () => {
  const [refreshUsers, setRefreshUsers] = useState(false);

  return (
    <div className="container mt-4">
      <AddUserModal
        onUserAdded={() => {
          setRefreshUsers(!refreshUsers);
        }}
      />
      <UsersTable refreshUsers={refreshUsers} />
    </div>
  );
};

export default Users;
