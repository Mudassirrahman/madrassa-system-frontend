import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchStudents,
  fetchReports,
  createReport,
} from "../../features/teacher/teacherSlice";

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { students, reports } = useSelector((state) => state.teacher);

  const [formData, setFormData] = useState({
    student: "",
    sabaq: "",
    sabqi: "",
    manzil: "",
    aageKaSabaq: "",
    tareeqaSunaneKa: "",
    totalAyat: "",
  });

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchReports());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(createReport(formData));
    setFormData({
      student: "",
      sabaq: "",
      sabqi: "",
      manzil: "",
      aageKaSabaq: "",
      tareeqaSunaneKa: "",
      totalAyat: "",
    });
    dispatch(fetchReports());
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      <h2 className="my-4">Teacher Dashboard</h2>
      <p>Welcome, {user?.userName}</p>

      <h4>Create New Report</h4>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Student</label>
            <select
              className="form-select"
              name="student"
              value={formData.student}
              onChange={handleChange}
              required
            >
              <option value="">Select Student</option>
              {Array.isArray(students) &&
                students.map((stu) => (
                  <option key={stu._id} value={stu._id}>
                    {stu.name}
                  </option>
                ))}
            </select>
          </div>

          {[
            "sabaq",
            "sabqi",
            "manzil",
            "aageKaSabaq",
            "tareeqaSunaneKa",
            "totalAyat",
          ].map((field, idx) => (
            <div className="col-md-6 mb-3" key={idx}>
              <label className="form-label">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              <input
                type={field === "totalAyat" ? "number" : "text"}
                className="form-control"
                name={field}
                value={formData[field]}
                onChange={handleChange}
                required
              />
            </div>
          ))}
        </div>

        <button className="btn btn-primary" type="submit">
          Submit Report
        </button>
      </form>

      <hr />

      <h4>My Reports</h4>
      {!Array.isArray(reports) ? (
        <p>Loading reports...</p>
      ) : reports.length === 0 ? (
        <p>No reports found.</p>
      ) : (
        reports.map((report) => (
          <div key={report._id || Math.random()} className="card my-3 p-3">
            <strong>Student:</strong> {report.student?.name || "N/A"} <br />
            <strong>Sabaq:</strong> {report.sabaq} <br />
            <strong>Sabqi:</strong> {report.sabqi} <br />
            <strong>Manzil:</strong> {report.manzil} <br />
            <strong>Aage ka Sabaq:</strong> {report.aageKaSabaq} <br />
            <strong>Tarika Sunane Ka:</strong> {report.tareeqaSunaneKa} <br />
            <strong>Total Ayat:</strong> {report.totalAyat} <br />
            {/* 👇 Comment Section */}
            {report.comments && report.comments.length > 0 ? (
              report.comments.map((comment) => (
                <div
                  key={comment._id}
                  className="mt-2 p-2 border rounded bg-light"
                >
                  <strong>{comment.user?.name || "Unknown"}:</strong>
                  <p className="mb-0">{comment.text}</p>
                </div>
              ))
            ) : (
              <div className="mt-2 text-muted">No comment from student.</div>
            )}
          </div>
        ))
      )}
    </div>
  );
};

export default TeacherDashboard;
