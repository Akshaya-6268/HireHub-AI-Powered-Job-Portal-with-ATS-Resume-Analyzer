import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function JobCard({ job }) {
  const postedBy = job.postedBy || {};
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [disabled, setDisabled] = useState(false);
  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleApply = async () => {
    if (!user) {
      setError("Please log in to apply for this job.");
      return;
    }

    setError("");
    setStatus("");

    try {
      const token = sessionStorage.getItem("token");

      await API.post(
        `/applications/${job._id}`,
        { message: "I am interested in this position." },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setStatus("Application submitted successfully.");
      setDisabled(true);
    } catch (err) {
      setError(
        err.response?.data?.message || "Unable to submit application."
      );
    }
  };

  return (
    <div className="card mb-3 shadow-sm">
      <div className="card-body">
        <Link to={`/job/${job._id}`} className="text-decoration-none">
          <h4 className="card-title">{job.title}</h4>
        </Link>
        <h6 className="card-subtitle mb-2 text-muted">
          {job.company} • {job.location}
        </h6>
        <p className="card-text">{job.description.substring(0, 150)}...</p>
        {job.salary && (
          <p className="card-text">
            <strong>Salary:</strong> {job.salary}
          </p>
        )}
        <p className="card-text text-muted mb-0">
          Posted by: {postedBy.name || "Unknown"}
        </p>

        <div className="mt-3">
          <Link to={`/job/${job._id}`} className="btn btn-info btn-sm me-2">
            View Details
          </Link>

          {user?.role === "jobseeker" && (
            <button
              className="btn btn-primary btn-sm"
              type="button"
              onClick={handleApply}
              disabled={disabled}
            >
              {disabled ? "Applied" : "Quick Apply"}
            </button>
          )}
        </div>

        {status && (
          <div className="alert alert-success mt-3">{status}</div>
        )}
        {error && (
          <div className="alert alert-danger mt-3">{error}</div>
        )}
      </div>
    </div>
  );
}

export default JobCard;
