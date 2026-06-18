const InterviewQuestion = require("../models/InterviewQuestion");
const InterviewSession = require("../models/InterviewSession");
const getTopics = (body) => body.topicsToFocus || body.topicsToFoucs;

exports.createSession = async (req, res) => {
  try {
    const { role, experience, description, questions } = req.body;
    const topicsToFocus = getTopics(req.body);

    if (!role || !experience || !topicsToFocus) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (!Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Questions are required" });
    }

    const session = await InterviewSession.create({
      user: req.user._id,
      role,
      experience,
      topicsToFocus,
      description,
    });

    const questionDocs = await InterviewQuestion.insertMany(
      questions.map((item) => ({
        session: session._id,
        question: item.question,
        answer: item.answer,
      })),
    );

    session.questions = questionDocs.map((question) => question._id);
    await session.save();

    res.status(201).json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getMySessions = async (req, res) => {
  try {
    const sessions = await InterviewSession.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .populate("questions")
      .lean();

    res.status(200).json({ sessions });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getSessionById = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.id,
      user: req.user._id,
    }).populate({
      path: "questions",
      options: { sort: { isPinned: -1, createdAt: 1 } },
    });

    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    res.status(200).json({ success: true, session });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteSession = async (req, res) => {
  try {
    const session = await InterviewSession.findOne({
      _id: req.params.id,
      user: req.user._id,
    });

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    await InterviewQuestion.deleteMany({ session: session._id });
    await session.deleteOne();

    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
