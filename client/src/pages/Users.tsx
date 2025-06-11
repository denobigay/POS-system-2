import { useState } from "react";
import UsersTable from "../components/tables/UsersTable";

const Users = () => {
  const [refreshUsers] = useState(false);

  return (
    <div className="container mx-auto px-4 sm:px-8">
      <div className="py-8">
        <UsersTable refreshUsers={refreshUsers} />
      </div>
    </div>
  );
};

export default Users;
