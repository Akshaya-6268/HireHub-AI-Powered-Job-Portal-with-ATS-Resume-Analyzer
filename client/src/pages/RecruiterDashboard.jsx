import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import API from "../services/api";

function RecruiterDashboard() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/jobs");
        // Filter jobs posted by the current recruiter
        const recruiterJobs = res.data.filter(
          (job) => job.postedBy._id === user._id
        );
        setJobs(recruiterJobs);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load jobs");
      } finally {
        setLoading(false);
      }
    };

    if (user?.role === "recruiter") {
      fetchJobs();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container mt-5">
        <h2>Recruiter Dashboard</h2>
        <p>Please log in to access this page.</p>
      </div>
    );
  }

  if (user.role !== "recruiter") {
    return (
      <div className="container mt-5">
        <h2>Recruiter Dashboard</h2>
        <p>Access denied. Only recruiters can access this page.</p>
      </div>
    );
  }

  const handleDelete = async (jobId) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const token = sessionStorage.getItem("token");
      await API.delete(`/jobs/${jobId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setJobs(jobs.filter((job) => job._id !== jobId));
      alert("Job deleted successfully");
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete job");
    }
  };

  return (
    <div className="container mt-5 mb-5">
      <div className="row mb-4">
        <div className="col">
          <h2>Recruiter Dashboard</h2>
          <p className="text-muted">Manage your job postings</p>
        </div>
        <div className="col-auto">
          <Link to="/post-job" className="btn btn-success">
            + Post New Job
          </Link>
        </div>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length > 0 ? (
        <div className="row">
          {jobs.map((job) => (
            <div className="col-md-6 mb-3" key={job._id}>
              <div className="card shadow-sm">
                <div className="card-body">
                  <h5 className="card-title">{job.title}</h5>
                  <h6 className="card-subtitle mb-2 text-muted">
                    {job.company} • {job.location}
                  </h6>
                  <p className="card-text text-truncate">
                    {job.description.substring(0, 100)}...
                  </p>
                  {job.salary && (
                    <p className="card-text mb-2">
                      <strong>Salary:</strong> {job.salary}
                    </p>
                  )}
                  <p className="card-text text-muted small">
                    Posted: {new Date(job.createdAt).toLocaleDateString()}
                  </p>

                  <div className="d-flex gap-2">
                    <Link
                      to={`/job/${job._id}`}
                      className="btn btn-info btn-sm"
                    >
                      View
                    </Link>
                    <Link
                      to={`/edit-job/${job._id}`}
                      className="btn btn-warning btn-sm"
                    >
                      Edit
                    </Link>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(job._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="alert alert-info">
          <p>You haven't posted any jobs yet.</p>
          <Link to="/post-job" className="btn btn-success">
            Post Your First Job
          </Link>
        </div>
      )}
    </div>
  );
}

export default RecruiterDashboard;
