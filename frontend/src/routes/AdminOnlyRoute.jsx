import { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const AdminOnlyRoute = ({ children }) => {
  const { user } = useContext(AuthContext);

  if (user?.is_admin) {
    return children;
  }

  return <Navigate to="/admin/no-autorizado" replace />;
};

export default AdminOnlyRoute;
