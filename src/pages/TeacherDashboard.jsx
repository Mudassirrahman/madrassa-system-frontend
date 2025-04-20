import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchStudents,
  fetchReports,
  createReport,
} from "../../features/teacher/teacherSlice";
import paras from "../../data/paras";
import surahs from "../../data/surahs";

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { students, reports } = useSelector((state) => state.teacher);

  const initialFormState = {
    student: "",
    sabaq: {
      paraName: "",
      suratName: "",
      ayatFrom: "",
      ayatTo: "",
      mistakes: "",
      mistakeAyatNumbers: "",
    },
    sabqi: {
      paraName: "",
      suratName: "",
      rukuFrom: "",
      rukuTo: "",
      mistakes: "",
      mistakeAyatNumbers: "",
    },
    manzil: {
      paraName: "",
      suratName: "",
      totalRuku: "",
      mistakes: "",
      mistakeRukuNumbers: "",
    },
    aageKaSabaq: {
      paraName: "",
      suratName: "",
      ayatFrom: "",
      ayatTo: "",
      totalAyat: "",
    },
    tareeqaSunaneKa: "",
    overallPerformance: "",
  };

  const [formData, setFormData] = useState(initialFormState);
  const [selectedStudentId, setSelectedStudentId] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(fetchStudents());
    dispatch(fetchReports());
  }, [dispatch]);

  const handleChange = (e, section, field) => {
    if (section) {
      setFormData((prev) => ({
        ...prev,
        [section]: {
          ...prev[section],
          [field]: e.target.value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [e.target.name]: e.target.value,
      }));
    }
  };

  const isFormValid = () => {
    if (!formData.student) return false;

    for (const section of ["sabaq", "sabqi", "manzil", "aageKaSabaq"]) {
      for (const field in formData[section]) {
        if (
          formData[section][field] === "" &&
          !(
            (field.toLowerCase().includes("mistake") ||
              field.toLowerCase().includes("mistakeayatnumbers") ||
              field.toLowerCase().includes("mistakerukunumbers")) &&
            Number(formData[section]["mistakes"]) === 0
          )
        ) {
          return false;
        }
      }
    }

    return (
      formData.tareeqaSunaneKa.trim() !== "" &&
      formData.overallPerformance.trim() !== ""
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      setError("Please fill all required fields properly.");
      return;
    }

    setError("");

    const preparedData = {
      ...formData,
      sabaq: {
        ...formData.sabaq,
        mistakes: Number(formData.sabaq.mistakes),
        ayatFrom: Number(formData.sabaq.ayatFrom),
        ayatTo: Number(formData.sabaq.ayatTo),
        mistakeAyatNumbers:
          Number(formData.sabaq.mistakes) === 0
            ? []
            : formData.sabaq.mistakeAyatNumbers
                .split(",")
                .map((n) => Number(n.trim())),
      },
      sabqi: {
        ...formData.sabqi,
        mistakes: Number(formData.sabqi.mistakes),
        rukuFrom: Number(formData.sabqi.rukuFrom),
        rukuTo: Number(formData.sabqi.rukuTo),
        mistakeAyatNumbers:
          Number(formData.sabqi.mistakes) === 0
            ? []
            : formData.sabqi.mistakeAyatNumbers
                .split(",")
                .map((n) => Number(n.trim())),
      },
      manzil: {
        ...formData.manzil,
        mistakes: Number(formData.manzil.mistakes),
        totalRuku: Number(formData.manzil.totalRuku),
        mistakeRukuNumbers:
          Number(formData.manzil.mistakes) === 0
            ? []
            : formData.manzil.mistakeRukuNumbers
                .split(",")
                .map((n) => Number(n.trim())),
      },
      aageKaSabaq: {
        ...formData.aageKaSabaq,
        ayatFrom: Number(formData.aageKaSabaq.ayatFrom),
        ayatTo: Number(formData.aageKaSabaq.ayatTo),
        totalAyat: Number(formData.aageKaSabaq.totalAyat),
      },
    };

    await dispatch(createReport(preparedData));
    dispatch(fetchReports());

    setFormData(initialFormState);
  };

  const filteredReports = selectedStudentId
    ? reports.filter((report) => report.student?._id === selectedStudentId)
    : reports;

  return (
    <div className="container">
      <h2 className="my-4">Teacher Dashboard</h2>
      <p>Welcome, {user?.userName}</p>

      <h4>Create New Report</h4>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Student</label>
          <select
            className="form-select"
            name="student"
            value={formData.student}
            onChange={handleChange}
            required
          >
            <option value="">Select Student</option>
            {students.map((stu) => (
              <option key={stu._id} value={stu._id}>
                {stu.name}
              </option>
            ))}
          </select>
        </div>

        <div className="row">
          {["sabaq", "sabqi", "manzil", "aageKaSabaq"].map((section) => (
            <div className="col-12 col-md-6 col-lg-3 mb-3" key={section}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title text-capitalize">
                    {section} Section
                  </h5>

                  {/* Para Name Dropdown */}
                  <div className="mb-2">
                    <label className="form-label">Para Name</label>
                    <select
                      className="form-select"
                      value={formData[section].paraName}
                      onChange={(e) => handleChange(e, section, "paraName")}
                    >
                      <option value="">Select Para</option>
                      {paras.map((para, idx) => (
                        <option key={idx} value={para.name}>
                          {para.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Surat Name Dropdown */}
                  <div className="mb-2">
                    <label className="form-label">Surat Name</label>
                    <select
                      className="form-select"
                      value={formData[section].suratName}
                      onChange={(e) => handleChange(e, section, "suratName")}
                    >
                      <option value="">Select Surat</option>
                      {surahs.map((surah, idx) => (
                        <option key={idx} value={surah.name}>
                          {surah.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {Object.keys(formData[section]).map((field) => {
                    if (field === "paraName" || field === "suratName")
                      return null;
                    const isMistakeField =
                      field.toLowerCase().includes("mistakeayatnumbers") ||
                      field.toLowerCase().includes("mistakerukunumbers");
                    const mistakeCount = Number(formData[section]["mistakes"]);
                    if (isMistakeField && mistakeCount === 0) return null;

                    return (
                      <div className="mb-2" key={field}>
                        <label className="form-label">
                          {field.charAt(0).toUpperCase() + field.slice(1)}
                        </label>
                        <input
                          type={
                            field.includes("mistake") ||
                            field.includes("From") ||
                            field.includes("To") ||
                            field.includes("total")
                              ? "number"
                              : "text"
                          }
                          className="form-control"
                          value={formData[section][field]}
                          onChange={(e) => handleChange(e, section, field)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-3">
          <label className="form-label">Tareeqa Sunane Ka</label>
          <input
            type="text"
            name="tareeqaSunaneKa"
            className="form-control"
            value={formData.tareeqaSunaneKa}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Overall Performance</label>
          <input
            type="text"
            name="overallPerformance"
            className="form-control"
            value={formData.overallPerformance}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="btn btn-primary">
          Submit Report
        </button>
      </form>

      <hr />

      <h4>Reports</h4>
      <div className="mb-3">
        <label className="form-label">Filter by Student</label>
        <select
          className="form-select"
          value={selectedStudentId}
          onChange={(e) => setSelectedStudentId(e.target.value)}
        >
          <option value="">All Students</option>
          {students.map((stu) => (
            <option key={stu._id} value={stu._id}>
              {stu.name}
            </option>
          ))}
        </select>
      </div>

      {filteredReports.map((report) => (
        <div key={report._id || Math.random()}>
          <div className="border rounded p-4 mb-4 shadow-sm bg-light">
            <h5 className="text-primary mb-3">
  Report ID: {`${report._id.slice(0, 4)}...${report._id.slice(-5)}`}
</h5>
              <strong>Student:</strong> {report.student?.name}
            </p>

            {/* === Internal Section Cards (Sabaq, Sabqi, etc) === */}
            <div className="row ">
              <div className="mt-4 col-12 col-md-6 col-lg-4">
                <div className="card shadow-sm mb-3">
                  <div className="card-header bg-primary text-white">
                    <h6>📖 Sabaq</h6>
                  </div>
                  <div className="card-body">
                    <p>
                      <strong>Para:</strong> {report.sabaq?.paraName}
                    </p>
                    <p>
                      <strong>Surat:</strong> {report.sabaq?.suratName}
                    </p>
                    <p>
                      <strong>Ayat From:</strong> {report.sabaq?.ayatFrom}
                    </p>
                    <p>
                      <strong>Ayat To:</strong> {report.sabaq?.ayatTo}
                    </p>
                    <p>
                      <strong>Mistakes:</strong> {report.sabaq?.mistakes}
                    </p>
                    {report.sabaq?.mistakes > 0 && (
                      <p>
                        <strong>Mistake Ayat Numbers:</strong>{" "}
                        {report.sabaq?.mistakeAyatNumbers?.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Sabqi Section */}
              <div className="mt-4 col-12 col-md-6 col-lg-4">
                <div className="card shadow-sm mb-3">
                  <div className="card-header bg-info text-white">
                    <h6>🔁 Sabqi</h6>
                  </div>
                  <div className="card-body">
                    <p>
                      <strong>Para:</strong> {report.sabqi?.paraName}
                    </p>
                    <p>
                      <strong>Surat:</strong> {report.sabqi?.suratName}
                    </p>
                    <p>
                      <strong>Ruku From:</strong> {report.sabqi?.rukuFrom}
                    </p>
                    <p>
                      <strong>Ruku To:</strong> {report.sabqi?.rukuTo}
                    </p>
                    <p>
                      <strong>Mistakes:</strong> {report.sabqi?.mistakes}
                    </p>
                    {report.sabqi?.mistakes > 0 && (
                      <p>
                        <strong>Mistake Ayat Numbers:</strong>{" "}
                        {report.sabqi?.mistakeAyatNumbers?.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Manzil Section */}
              <div className="mt-4 col-12 col-md-6 col-lg-4">
                <div className="card shadow-sm mb-3">
                  <div className="card-header bg-warning text-dark">
                    <h6>🏛️ Manzil</h6>
                  </div>
                  <div className="card-body">
                    <p>
                      <strong>Para:</strong> {report.manzil?.paraName}
                    </p>
                    <p>
                      <strong>Surat:</strong> {report.manzil?.suratName}
                    </p>
                    <p>
                      <strong>Total Ruku:</strong> {report.manzil?.totalRuku}
                    </p>
                    <p>
                      <strong>Mistakes:</strong> {report.manzil?.mistakes}
                    </p>
                    {report.manzil?.mistakes > 0 && (
                      <p>
                        <strong>Mistake Ruku Numbers:</strong>{" "}
                        {report.manzil?.mistakeRukuNumbers?.join(", ")}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Aage Ka Sabaq */}
              <div className="mt-4 col-12 col-md-6 col-lg-4">
                <div className="card shadow-sm mb-3">
                  <div className="card-header bg-success text-white">
                    <h6>📘 Aage Ka Sabaq</h6>
                  </div>
                  <div className="card-body">
                    <p>
                      <strong>Para:</strong> {report.aageKaSabaq?.paraName}
                    </p>
                    <p>
                      <strong>Surat:</strong> {report.aageKaSabaq?.suratName}
                    </p>
                    <p>
                      <strong>Ayat From:</strong> {report.aageKaSabaq?.ayatFrom}
                    </p>
                    <p>
                      <strong>Ayat To:</strong> {report.aageKaSabaq?.ayatTo}
                    </p>
                    <p>
                      <strong>Total Ayat:</strong>{" "}
                      {report.aageKaSabaq?.totalAyat}
                    </p>
                  </div>
                </div>
              </div>

              {/* Feedback Section */}
              <div className="mt-4 col-12 col-md-6 col-lg-4">
                <div className="card shadow-sm mb-3">
                  <div className="card-header bg-secondary text-white">
                    <h6>🗣️ General Feedback</h6>
                  </div>
                  <div className="card-body">
                    <p>
                      <strong>Tareeqa Sunane Ka:</strong>{" "}
                      {report.tareeqaSunaneKa}
                    </p>
                    <p>
                      <strong>Overall Performance:</strong>{" "}
                      {report.overallPerformance}
                    </p>
                  </div>
                </div>
              </div>
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default TeacherDashboard;
