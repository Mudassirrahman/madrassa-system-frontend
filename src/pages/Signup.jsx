import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, fetchTeachers } from "../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("student");
  const [teacherId, setTeacherId] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { teachers, error, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    if (role === "student") {
      dispatch(fetchTeachers());
    }
  }, [role, dispatch]);

  const handleSignup = async (e) => {
    e.preventDefault();

    const userData = {
      name,
      email,
      password,
      role,
      ...(role === "student" && { teacher: teacherId }),
    };

    try {
      await dispatch(registerUser(userData)).unwrap();
      alert("User registered successfully");
      navigate(
        role === "teacher" ? "/teacher-dashboard" : "/student-dashboard"
      );
    } catch (err) {
      console.error("Signup Failed", err);
      alert(err || "Registration failed. Please try again.");
    }
  };

  return (
    <div className="container">
      <h2 className="my-4">Signup</h2>
      <form onSubmit={handleSignup}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Email address</label>
          <input
            type="email"
            className="form-control"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-control"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Role</label>
          <select
            className="form-control"
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="student">Student</option>
            <option value="teacher">Teacher</option>
          </select>
        </div>

        {role === "student" && (
          <div className="mb-3">
            <label className="form-label">Assign Teacher</label>
            <select
              className="form-control"
              value={teacherId}
              onChange={(e) => setTeacherId(e.target.value)}
              required
            >
              <option value="">Select Teacher</option>
              {Array.isArray(teachers) &&
                teachers.map((teacher) => (
                  <option key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </option>
                ))}
            </select>
          </div>
        )}

        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Signing up..." : "Signup"}
        </button>

        {error && <p className="text-danger mt-2">{error}</p>}
      </form>
    </div>
  );
};

export default Signup;
