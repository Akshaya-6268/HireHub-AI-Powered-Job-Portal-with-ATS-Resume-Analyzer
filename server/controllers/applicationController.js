const Application = require("../models/Application");
const Job = require("../models/Job");

const applyToJob = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({ message: "Only job seekers can apply." });
    }

    const { jobId } = req.params;
    const { message } = req.body;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    const existing = await Application.findOne({
      job: jobId,
      applicant: req.user._id,
    });

    if (existing) {
      return res.status(400).json({
        message: "You have already applied to this job.",
      });
    }

    const application = await Application.create({
      job: jobId,
      applicant: req.user._id,
      message,
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getMyApplications = async (req, res) => {
  try {
    const applications = await Application.find({
      applicant: req.user._id,
    })
      .populate("job", "title company location salary")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getRecruiterApplications = async (req, res) => {
  try {
    if (req.user.role !== "recruiter") {
      return res.status(403).json({
        message: "Only recruiters can view applications.",
      });
    }

    const jobs = await Job.find({ postedBy: req.user._id }).select("_id");
    const jobIds = jobs.map((job) => job._id);

    const applications = await Application.find({
      job: { $in: jobIds },
    })
      .populate("job", "title company location")
      .populate("applicant", "name email")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  applyToJob,
  getMyApplications,
  getRecruiterApplications,
};
