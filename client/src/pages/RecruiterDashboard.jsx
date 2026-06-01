import { useState } from "react";
import API from "../services/api";

function RecruiterDashboard() {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    description: "",
  });
  const [status, setStatus] = useState(null);

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
        <p>Access denied. Only recruiters can post jobs.</p>
      </div>
    );
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);

    try {
      const token = sessionStorage.getItem("token");
      await API.post("/jobs", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFormData({
        title: "",
        company: "",
        location: "",
        salary: "",
        description: "",
      });
      setStatus({ type: "success", message: "Job posted successfully." });
    } catch (error) {
      setStatus({
        type: "error",
        message: error.response?.data?.message || "Could not post job.",
      });
    }
  };

  return (
    <div className="container mt-5">
      <h2>Recruiter Dashboard</h2>
      <p>Post a new job listing for job seekers to view.</p>

      {status && (
        <div className={`alert alert-${status.type === "success" ? "success" : "danger"}`}>
          {status.message}
        </div>
      )}

      <form onSubmit={handleSubmit} className="card p-4">
        <div className="mb-3">
          <label className="form-label">Job Title</label>
          <input
            className="form-control"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Company</label>
          <input
            className="form-control"
            name="company"
            value={formData.company}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Location</label>
          <input
            className="form-control"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Salary</label>
          <input
            className="form-control"
            name="salary"
            value={formData.salary}
            onChange={handleChange}
          />
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <button className="btn btn-success" type="submit">
          Publish Job
        </button>
      </form>
    </div>
  );
}

export default RecruiterDashboard;
