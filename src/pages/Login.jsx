import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const resultAction = await dispatch(loginUser({ email, password }));

      if (resultAction.type === "auth/loginUser/fulfilled") {
        const userRole = resultAction.payload.role;

        if (userRole === "student") {
          navigate("/student-dashboard");
        } else if (userRole === "teacher") {
          navigate("/teacher-dashboard");
        }
      } else {
        setError("Login failed. Please check your credentials.");
      }
    } catch (error) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role) {
      // Agar user already logged in ho aur correct route pe na ho toh navigate karen
      if (user.role === "student" && window.location.pathname !== "/student-dashboard") {
        navigate("/student-dashboard");
      } else if (user.role === "teacher" && window.location.pathname !== "/teacher-dashboard") {
        navigate("/teacher-dashboard");
      }
    }
  }, [user, navigate]);

  return (
    <div className="container">
      <h2 className="my-4">Login</h2>
      <form onSubmit={handleLogin}>
        <div className="mb-3">
          <label htmlFor="email" className="form-label">
            Email address
          </label>
          <input
            type="email"
            className="form-control"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            type="password"
            className="form-control"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
