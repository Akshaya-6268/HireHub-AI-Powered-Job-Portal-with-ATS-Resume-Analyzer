import { useEffect, useState } from "react";
import API from "../services/api";
import JobCard from "../components/JobCard";

function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await API.get("/jobs");
        setJobs(res.data);
      } catch (err) {
        setError(
          err.response?.data?.message || "Could not load jobs"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="container mt-5">
      <h2>Jobs</h2>

      {error && (
        <div className="alert alert-danger">{error}</div>
      )}

      {loading ? (
        <p>Loading jobs...</p>
      ) : jobs.length > 0 ? (
        jobs.map((job) => (
          <JobCard key={job._id} job={job} />
        ))
      ) : (
        <p>No jobs found yet. Check back later.</p>
      )}
    </div>
  );
}

export default Jobs;
