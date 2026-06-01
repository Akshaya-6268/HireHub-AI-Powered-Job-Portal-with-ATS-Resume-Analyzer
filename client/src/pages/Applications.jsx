import { useEffect, useState } from "react";
import API from "../services/api";

function Applications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const res = await API.get("/applications/me");
        setApplications(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Unable to load applications"
        );
      } finally {
        setLoading(false);
      }
    };

    loadApplications();
  }, []);

  return (
    <div className="container mt-5">
      <h2>My Applications</h2>

      {loading ? (
        <p>Loading your applications...</p>
      ) : error ? (
        <div className="alert alert-danger">{error}</div>
      ) : applications.length === 0 ? (
        <p>You have not applied to any jobs yet.</p>
      ) : (
        <div className="row">
          {applications.map((application) => (
            <div className="col-12 mb-3" key={application._id}>
              <div className="card p-3">
                <h5>{application.job.title}</h5>
                <p className="mb-1">
                  {application.job.company} • {application.job.location}
                </p>
                {application.job.salary && (
                  <p className="mb-1">
                    <strong>Salary:</strong> {application.job.salary}
                  </p>
                )}
                <p className="mb-1">
                  <strong>Status:</strong> {application.status}
                </p>
                {application.message && (
                  <p className="mb-1">
                    <strong>Message:</strong> {application.message}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Applications;
