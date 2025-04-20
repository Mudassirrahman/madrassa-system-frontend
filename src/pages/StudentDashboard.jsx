import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchStudentReports,
  fetchComments,
  submitComment,
} from "../../features/student/studentSlice";

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { reports, comments, loading } = useSelector((state) => state.student);

  const [newComment, setNewComment] = useState({});

  useEffect(() => {
    dispatch(fetchStudentReports());
  }, [dispatch]);

  const handleCommentSubmit = (reportId) => {
    if (!newComment[reportId]) return;
    dispatch(submitComment({ reportId, text: newComment[reportId] }));
    setNewComment((prev) => ({ ...prev, [reportId]: "" }));
  };

  return (
    <div className="container">
      <h2 className="my-4">Student Dashboard</h2>
      <p>Welcome, {user?.userName}</p>
      <h4 className="mb-4">Your Reports</h4>

      {loading && <p>Loading your reports...</p>}

      <div className="row">
        {Array.isArray(reports) &&
          reports.map((report) => (
            <div key={report._id} className="col-12 col-lg-6 mb-4">
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">Report Summary</h5>
                  <p>
                    <strong>Date:</strong>{" "}
                    {new Date(report.createdAt).toLocaleDateString()}
                  </p>
                  <p>
                    <strong>Teacher:</strong> {report.teacher?.userName || "N/A"}
                  </p>

                  <hr />
                  <h6>Sabaq</h6>
                  <p>Para: {report.sabaq?.paraName}</p>
                  <p>Surat: {report.sabaq?.suratName}</p>
                  <p>Ayat: {report.sabaq?.ayatFrom} - {report.sabaq?.ayatTo}</p>
                  <p>Mistakes: {report.sabaq?.mistakes}</p>
                  <p>Mistake Ayat Numbers: {report.sabaq?.mistakeAyatNumbers?.join(", ")}</p>

                  <hr />
                  <h6>Sabqi</h6>
                  <p>Para: {report.sabqi?.paraName}</p>
                  <p>Surat: {report.sabqi?.suratName}</p>
                  <p>Ruku: {report.sabqi?.rukuFrom} - {report.sabqi?.rukuTo}</p>
                  <p>Mistakes: {report.sabqi?.mistakes}</p>
                  <p>Mistake Ayat Numbers: {report.sabqi?.mistakeAyatNumbers?.join(", ")}</p>

                  <hr />
                  <h6>Manzil</h6>
                  <p>Para: {report.manzil?.paraName}</p>
                  <p>Surat: {report.manzil?.suratName}</p>
                  <p>Total Ruku: {report.manzil?.totalRuku}</p>
                  <p>Mistakes: {report.manzil?.mistakes}</p>
                  <p>Mistake Ruku Numbers: {report.manzil?.mistakeRukuNumbers?.join(", ")}</p>

                  <hr />
                  <h6>Aage Ka Sabaq</h6>
                  <p>Para: {report.aageKaSabaq?.paraName}</p>
                  <p>Surat: {report.aageKaSabaq?.suratName}</p>
                  <p>Ayat: {report.aageKaSabaq?.ayatFrom} - {report.aageKaSabaq?.ayatTo}</p>
                  <p>Total Ayat: {report.aageKaSabaq?.totalAyat}</p>

                  <hr />
                  <p><strong>Tareeqa Sunane Ka:</strong> {report.tareeqaSunaneKa}</p>
                  <p><strong>Overall Performance:</strong> {report.overallPerformance}</p>

                  <hr />
                  <h6>Comments:</h6>
                  <button
                    className="btn btn-sm btn-secondary mb-2"
                    onClick={() => dispatch(fetchComments(report._id))}
                  >
                    Load Comments
                  </button>

                  <ul className="ps-3">
                    {(comments[report._id] || []).map((c, i) => (
                      <li key={i}>
                        <strong>{c.user?.userName || "Anonymous"}:</strong> {c.text}
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
