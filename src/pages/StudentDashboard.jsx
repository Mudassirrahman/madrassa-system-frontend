import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchStudentReports } from "../../features/student/studentSlice";
import axios from "axios";

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { reports } = useSelector((state) => state.student);

  const [comments, setComments] = useState({}); // reportId -> comments
  const [newComment, setNewComment] = useState({}); // reportId -> text

  useEffect(() => {
    dispatch(fetchStudentReports());
  }, [dispatch]);

  const fetchComments = async (reportId) => {
    const token = user?.token;
    const res = await axios.get(`madrassa-system-backend.vercel.app/${reportId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setComments((prev) => ({ ...prev, [reportId]: res.data }));
  };

  const handleCommentSubmit = async (reportId) => {
    const token = user?.token;
    await axios.post(
      `madrassa-system-backend.vercel.app/${reportId}`,
      { text: newComment[reportId] },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNewComment((prev) => ({ ...prev, [reportId]: "" }));
    fetchComments(reportId);
  };

  return (
    <div className="container">
      <h2 className="my-4">Student Dashboard</h2>
      <p>Welcome, {user?.name}</p>
      <h4>Your Reports</h4>

      {Array.isArray(reports) &&
        reports.map((report) => (
          <div key={report._id} className="card my-3 p-3">
            <strong>Date:</strong> {new Date(report.createdAt).toLocaleDateString()} <br />
            <strong>Teacher:</strong> {report.teacher?.name} <br />
            <strong>Sabaq:</strong> {report.sabaq} <br />
            <strong>Sabqi:</strong> {report.sabqi} <br />
            <strong>Manzil:</strong> {report.manzil} <br />

            <hr />
            <h6>Comments:</h6>
            <button className="btn btn-sm btn-secondary mb-2" onClick={() => fetchComments(report._id)}>
              Load Comments
            </button>
            <ul>
              {(comments[report._id] || []).map((c, i) => (
                <li key={i}>
                  <strong>{c.user?.name}:</strong> {c.text}
                </li>
              ))}
            </ul>

            <div className="mt-2">
              <input
                className="form-control"
                placeholder="Add a comment"
                value={newComment[report._id] || ""}
                onChange={(e) =>
                  setNewComment((prev) => ({
                    ...prev,
                    [report._id]: e.target.value,
                  }))
                }
              />
              <button
                className="btn btn-primary mt-1"
                onClick={() => handleCommentSubmit(report._id)}
              >
                Submit Comment
              </button>
            </div>
          </div>
        ))}
    </div>
  );
};

export default StudentDashboard;

