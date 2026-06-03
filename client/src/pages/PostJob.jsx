import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function PostJob() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    description: "",
    salary: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const user = JSON.parse(sessionStorage.getItem("user"));

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setIsSubmitting(true);

    if (!formData.title || !formData.company || !formData.location || !formData.description) {
      setError("Please fill in all required fields");
      setIsSubmitting(false);
      return;
    }

    try {
      const token = sessionStorage.getItem("token");
      const res = await API.post("/jobs", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setSuccess("Job posted successfully");
      setTimeout(() => navigate(`/job/${res.data._id}`), 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Could not post job");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (user?.role !== "recruiter") {
    return (
      <div className="container mt-5">
        <div className="alert alert-warning">
          Only recruiters can post jobs
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5 mb-5">
      <div className="row justify-content-center">
        <div className="col-md-6">
          <div className="card shadow">
            <div className="card-body">
              <h2 className="card-title mb-4">Post a New Job</h2>

              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">{success}</div>}

              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="title" className="form-label">
                    Job Title <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    placeholder="e.g., Senior React Developer"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="company" className="form-label">
                    Company <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="company"
                    name="company"
                    value={formData.company}
                    onChange={handleChange}
                    placeholder="e.g., Tech Company Inc"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="location" className="form-label">
                    Location <span className="text-danger">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleChange}
                    placeholder="e.g., New York, NY"
                    required
                  />
                </div>

                <div className="mb-3">
                  <label htmlFor="description" className="form-label">
                    Job Description <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    rows="5"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter detailed job description, requirements, responsibilities..."
                    required
                  ></textarea>
                </div>

                <div className="mb-3">
                  <label htmlFor="salary" className="form-label">
                    Salary (Optional)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="salary"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="e.g., $50,000 - $70,000"
                  />
                </div>

                <button
                  type="submit"
                  className="btn btn-primary w-100"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Posting..." : "Post Job"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostJob;
