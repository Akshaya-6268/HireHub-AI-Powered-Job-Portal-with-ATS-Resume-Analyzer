import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../services/api";

function JobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [applicationStatus, setApplicationStatus] = useState("");
  const [applicationError, setApplicationError] = useState("");
  const [hasApplied, setHasApplied] = useState(false);

  const user = JSON.parse(sessionStorage.getItem("user"));

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const res = await API.get(`/jobs/${id}`);
        setJob(res.data);
        setIsOwner(user && res.data.postedBy._id === user._id);
      } catch (err) {
        setError(err.response?.data?.message || "Could not load job");
      } finally {
        setLoading(false);
      }
    };

    fetchJob();
  }, [id, user]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;

    try {
      const token = sessionStorage.getItem("token");
      await API.delete(`/jobs/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("Job deleted successfully");
      navigate("/recruiter-dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Could not delete job");
    }
  };

  const handleApply = async () => {
    if (!user) {
      setApplicationError("Please log in to apply for this job.");
      return;
    }

    setApplicationError("");
    setApplicationStatus("");

    try {
      const token = sessionStorage.getItem("token");
      await API.post(
        `/applications/${id}`,
        { message: "I am interested in this position." },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setApplicationStatus("Application submitted successfully.");
      setHasApplied(true);
    } catch (err) {
      setApplicationError(
        err.response?.data?.message || "Unable to submit application."
      );
    }
  };

  if (loading) return <div className="container mt-5"><p>Loading job details...</p></div>;
  if (error) return <div className="container mt-5"><div className="alert alert-danger">{error}</div></div>;
  if (!job) return <div className="container mt-5"><p>Job not found</p></div>;

  const postedBy = job.postedBy || {};

  return (
    <div className="container mt-5 mb-5">
      <div className="row">
        <div className="col-md-8">
          <div className="card shadow">
            <div className="card-body">
              <h1 className="card-title mb-3">{job.title}</h1>
              <h5 className="text-muted mb-4">
                {job.company} • {job.location}
              </h5>

              {job.salary && (
                <p className="mb-3">
                  <strong>Salary:</strong> {job.salary}
                </p>
              )}

              <hr />

              <h5>Job Description</h5>
              <p className="mb-4" style={{ whiteSpace: "pre-wrap" }}>
                {job.description}
              </p>

              <hr />

              <p className="text-muted mb-0">
                Posted by: <strong>{postedBy.name || "Unknown"}</strong>
              </p>
              <p className="text-muted">
                {new Date(job.createdAt).toLocaleDateString()}
              </p>
            </div>
          </div>
        </div>

        <div className="col-md-4">
          <div className="card shadow">
            <div className="card-body">
              {isOwner ? (
                <div>
                  <h5 className="card-title mb-3">Job Actions</h5>
                  <button
                    className="btn btn-warning w-100 mb-2"
                    onClick={() => navigate(`/edit-job/${id}`)}
                  >
                    Edit Job
                  </button>
                  <button
                    className="btn btn-danger w-100"
                    onClick={handleDelete}
                  >
                    Delete Job
                  </button>
                </div>
              ) : user?.role === "jobseeker" ? (
                <div>
                  <h5 className="card-title mb-3">Apply Now</h5>
                  <button
                    className="btn btn-primary w-100"
                    onClick={handleApply}
                    disabled={hasApplied}
                  >
                    {hasApplied ? "Application Submitted" : "Apply for this Job"}
                  </button>

                  {applicationStatus && (
                    <div className="alert alert-success mt-3 mb-0">
                      {applicationStatus}
                    </div>
                  )}
                  {applicationError && (
                    <div className="alert alert-danger mt-3 mb-0">
                      {applicationError}
                    </div>
                  )}
                </div>
              ) : (
                <p className="text-muted">Log in as a job seeker to apply</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JobDetails;
