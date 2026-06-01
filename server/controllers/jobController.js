const Job = require("../models/Job");

const getJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .sort({ createdAt: -1 })
      .populate("postedBy", "name email role");

    res.json(jobs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createJob = async (req, res) => {
  try {
    const { title, company, location, description, salary } = req.body;

    if (!title || !company || !location || !description) {
      return res.status(400).json({
        message: "Title, company, location, and description are required",
      });
    }

    const job = await Job.create({
      title,
      company,
      location,
      description,
      salary,
      postedBy: req.user._id,
    });

    res.status(201).json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getJobs, createJob };
