import { useContext } from "react";
import { AuthContext } from "./AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({ children }) {
  const { isAdmin } = useContext(AuthContext);

  if (!isAdmin) {
    return <Navigate to="/" />;
  }

  return children;
}
