const InterviewQuestion = require("../models/InterviewQuestion");
const InterviewSession = require("../models/InterviewSession");

const findOwnedSession = (sessionId, userId) =>
  InterviewSession.findOne({ _id: sessionId, user: userId });

exports.addQuestionToSession = async (req, res) => {
  try {
    const { sessionId, questions } = req.body;

    if (!sessionId || !Array.isArray(questions) || questions.length === 0) {
      return res.status(400).json({ message: "Invalid input data" });
    }

    const session = await findOwnedSession(sessionId, req.user._id);

    if (!session) {
      return res.status(404).json({ message: "Session not found" });
    }

    const createdQuestions = await InterviewQuestion.insertMany(
      questions.map((item) => ({
        session: sessionId,
        question: item.question,
        answer: item.answer,
      })),
    );

    session.questions.push(...createdQuestions.map((question) => question._id));
    await session.save();

    res.status(201).json(createdQuestions);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.togglePinQuestion = async (req, res) => {
  try {
    const question = await InterviewQuestion.findById(req.params.id);

    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    const session = await findOwnedSession(question.session, req.user._id);

    if (!session) {
      return res.status(403).json({ message: "Not authorized" });
    }

    question.isPinned = !question.isPinned;
    await question.save();

    res.status(200).json({ success: true, question });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateQuestionNote = async (req, res) => {
  try {
    const { note } = req.body;
    const question = await InterviewQuestion.findById(req.params.id);

    if (!question) {
      return res
        .status(404)
        .json({ success: false, message: "Question not found" });
    }

    const session = await findOwnedSession(question.session, req.user._id);

    if (!session) {
      return res.status(403).json({ message: "Not authorized" });
    }

    question.note = note || "";
    await question.save();

    res.status(200).json({ success: true, question });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
