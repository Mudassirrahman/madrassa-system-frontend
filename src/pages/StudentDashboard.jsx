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
    const res = await axios.get(
      `https://madrassa-system-backend.vercel.app/comments/${reportId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );
    setComments((prev) => ({ ...prev, [reportId]: res.data }));
  };

  const handleCommentSubmit = async (reportId) => {
    const token = user?.token;
    await axios.post(
      `https://madrassa-system-backend.vercel.app/comments/${reportId}`,
      { text: newComment[reportId] },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setNewComment((prev) => ({ ...prev, [reportId]: "" }));
    fetchComments(reportId);
  };

  return (
    <div className="container">
      <h2 className="my-4">Student Dashboard</h2>
      <p>Welcome, {user?.userName}</p>
      <h4 className="mb-4">Your Reports</h4>

      <div className="row">
        {Array.isArray(reports) &&
          reports.map((report) => (
            <div key={report._id} className="col-12 col-lg-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">Report Summary</h5>
                  <p className="mb-1">
                    <strong>Date:</strong>{" "}
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                  <p className="mb-1">
                    <strong>Teacher:</strong> {report.teacher?.name}
                  </p>
                  <p className="mb-1">
                    <strong>Sabaq:</strong> {report.sabaq}
                  </p>
                  <p className="mb-1">
                    <strong>Sabqi:</strong> {report.sabqi}
                  </p>
                  <p className="mb-3">
                    <strong>Manzil:</strong> {report.manzil}
                  </p>

                  <hr />

                  <h6>Comments:</h6>
                  <button
                    className="btn btn-sm btn-secondary mb-2"
                    onClick={() => fetchComments(report._id)}
                  >
                    Load Comments
                  </button>

                  <ul className="ps-3">
                    {(comments[report._id] || []).map((c, i) => (
                      <li key={i}>
                        <strong>{c.user?.name}:</strong> {c.text}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-3">
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
                      className="btn btn-primary mt-2"
                      onClick={() => handleCommentSubmit(report._id)}
                    >
                      Submit Comment
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
};

export default StudentDashboard;
