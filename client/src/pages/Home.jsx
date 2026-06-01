import { useNavigate } from "react-router-dom";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="container mt-5 text-center">
      <h1>Welcome to HireHub</h1>

      <p className="lead">
        AI Powered Job Portal with ATS Resume Analyzer
      </p>

      <button
        className="btn btn-primary me-3"
        onClick={() => navigate("/jobs")}
      >
        Find Jobs
      </button>

      <button
        className="btn btn-success"
        onClick={() => navigate("/recruiter-dashboard")}
      >
        Post Jobs
      </button>
    </div>
  );
}

export default Home;