const Application = require("../models/Application");
const Job = require("../models/Job");
const Resume = require("../models/Resume");
const {
  sendApplicationStatusEmail,
  sendNewApplicationEmailToEmployer,
} = require("../utils/emailService");
const { createNotification } = require("../utils/notificationService");
// @Desc Apply to a job
exports.applyToJob = async (req, res) => {
  try {
    if (req.user.role !== "jobseeker") {
      return res.status(403).json({ message: "Only job seekers can apply " });
    }
    const existing = await Application.findOne({
      job: req.params.jobId,
      applicant: req.user._id,
    });
    if (existing) {
      return res.status(400).json({ message: "Already applied to this job" });
    }
    const { resumeId } = req.body;

    if (!resumeId) {
      return res.status(400).json({ message: "Please select a resume before applying" });
    }

    const resume = await Resume.findOne({
      _id: resumeId,
      user: req.user._id,
    });

    if (!resume) {
      return res.status(404).json({ message: "Selected resume was not found" });
    }

    if (!resume.public) {
      resume.public = true;
      await resume.save();
    }

    const resumeUrl = `${req.protocol}://${req.get("host")}/api/resumes/public/${resume._id}`;

    const application = await Application.create({
      job: req.params.jobId,
      applicant: req.user._id,
      resume: resumeUrl,
      resumeId: resume._id,
    });
    res.status(201).json(application);
    Job.findById(req.params.jobId)
      .select("title company")
      .populate("company", "name companyName email")
      .then((job) => {
        if (!job) return null;
        createNotification({
          user: job.company,
          type: "new_application",
          title: "متقدم جديد",
          message: `${req.user.name} تقدم على وظيفة ${job.title}`,
          link: `/applicants?jobId=${job._id}`,
          metadata: { jobId: job._id, applicationId: application._id },
        });
        return sendNewApplicationEmailToEmployer({
          job,
          applicant: req.user,
        });
      })
      .catch((error) => {
        console.error("[notification] Failed to create employer application notification:", error.message);
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @Desc Get logged-in user's applications
exports.getMyApplications = async (req, res) => {
  try {
    const apps = await Application.find({ applicant: req.user._id })
      .populate({
        path: "job",
        select: "title company location type category isClosed salaryMin salaryMax",
        populate: {
          path: "company",
          select: "name companyName companyLogo",
        },
      })
      .populate("resumeId", "title public template updatedAt")
      .sort({ createdAt: -1 });
    res.json(apps);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @Desc Get all applicants for a job (Employer)
exports.getApplicatntsForJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job || job.company.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to view applicants" });
    }
    const applications = await Application.find({ job: req.params.jobId })
      .populate("job", "title location category type")
      .populate("applicant", "name email avatar resume")
      .populate("resumeId", "title public template updatedAt");
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @Desc Get applicants by ID (Jobseeker or Employer)
exports.getApplicationById = async (req, res) => {
  try {
    const app = await Application.findById(req.params.id)
      .populate("job", "title company")
      .populate("applicant", "name email avatar resume")
      .populate("resumeId", "title public template updatedAt");
    if (!app)
      return res
        .status(404)
        .json({ message: "Application not found", id: req.params.id });
    const isOwner =
      app.applicant._id.toString() === req.user._id.toString() ||
      app.job.company.toString() === req.user._id.toString();
    if (!isOwner) {
      return res
        .status(403)
        .json({ message: "Not authorized to view this applications " });
    }
    res.json(app);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
// @Desc Update applicant status (Employer)
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const allowedStatuses = ["Applied", "In Review", "Rejected", "Accepted"];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid application status" });
    }

    const app = await Application.findById(req.params.id).populate("job");
    if (!app || app.job.company.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this application" });
    }
    const previousStatus = app.status;
    app.status = status;
    await app.save();
    const updatedApplication = await Application.findById(app._id)
      .populate("job", "title location category type")
      .populate("applicant", "name email avatar resume")
      .populate("resumeId", "title public template updatedAt");
    res.json(updatedApplication);
    if (previousStatus !== status && ["Accepted", "Rejected"].includes(status)) {
      createNotification({
        user: app.applicant,
        type: status === "Accepted" ? "application_accepted" : "application_rejected",
        title: status === "Accepted" ? "تم قبول طلبك" : "لم يتم قبول طلبك",
        message: `تم تحديث حالة طلبك على وظيفة ${app.job.title}`,
        link: `/job/${app.job._id}`,
        metadata: { jobId: app.job._id, applicationId: app._id, status },
      });
      Application.findById(app._id)
        .populate({
          path: "job",
          select: "title location category type company",
          populate: {
            path: "company",
            select: "name companyName companyLogo",
          },
        })
        .populate("applicant", "name email avatar resume")
        .then(sendApplicationStatusEmail)
        .catch((error) => {
          console.error("[email] Failed to prepare application status email:", error.message);
        });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
