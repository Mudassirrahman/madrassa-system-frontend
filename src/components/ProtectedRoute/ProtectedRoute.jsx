import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRole }) => {
  const { user } = useSelector((state) => state.auth);

  // Check if user ya token missing hai
  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }

  // Check agar user ka role allowedRole se match nahi karta
  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

