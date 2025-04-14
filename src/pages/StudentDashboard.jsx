import { useSelector } from "react-redux";

const StudentDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="container">
      <h2 className="my-4">Student Dashboard</h2>
      <p>Welcome, {user?.name}</p>
      <div>
        <h4>Your Reports</h4>
        {/* Display reports or any student-specific content here */}
      </div>
    </div>
  );
};

export default StudentDashboard;
