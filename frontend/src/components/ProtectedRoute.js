import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, roleAutorise }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  if (roleAutorise && role !== roleAutorise) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;