const { GoogleGenAI } = require("@google/genai");
const {
  conceptExplainPrompt,
  questionAnswerPrompt,
} = require("../utils/interviewPrompts");

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";

const extractJson = (text) => {
  const cleaned = String(text || "")
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

  return JSON.parse(cleaned);
};

const getClient = () => {
  const apiKey = String(process.env.GEMINI_API_KEY || "").trim();

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  return new GoogleGenAI({ apiKey });
};

const getSafeAiError = (error) => {
  const message = String(error?.message || "");

  if (message.includes("CONSUMER_SUSPENDED")) {
    return "Gemini API key is suspended. Create a new key or enable the Google AI API project.";
  }

  if (message.includes("quota") || message.includes("429")) {
    return "Gemini API quota exceeded. Check your Google AI Studio usage, billing, or create a key from a project with available quota.";
  }

  if (message.includes("API key not valid") || message.includes("API_KEY_INVALID")) {
    return "Gemini API key is invalid. Check GEMINI_API_KEY in backend/.env.";
  }

  if (message.includes("PERMISSION_DENIED")) {
    return "Gemini API permission denied. Check the API key and project status.";
  }

  if (message.includes("fetch failed")) {
    return "Could not reach Gemini API. Check your internet connection.";
  }

  return "Gemini API request failed. Check the backend logs for details.";
};

const isQuotaError = (error) => {
  const message = String(error?.message || "");
  return message.includes("quota") || message.includes("429");
};

const isAiUnavailableError = (error) => {
  const message = String(error?.message || "");
  return (
    isQuotaError(error) ||
    message.includes("GEMINI_API_KEY") ||
    message.includes("API key not valid") ||
    message.includes("API_KEY_INVALID") ||
    message.includes("PERMISSION_DENIED") ||
    message.includes("CONSUMER_SUSPENDED") ||
    message.includes("fetch failed")
  );
};

const buildFallbackQuestions = (role, experience, topicsToFocus, count) => {
  const topics = String(topicsToFocus)
    .split(",")
    .map((topic) => topic.trim())
    .filter(Boolean);
  const primaryTopic = topics[0] || "the required skills";

  const templates = [
    {
      question: `Tell me about your experience with ${primaryTopic} for a ${role} role.`,
      answer: `Focus on real examples, the problem you solved, your responsibilities, and the result. For ${experience} years of experience, show growth and practical understanding.`,
    },
    {
      question: `What are the most important concepts in ${primaryTopic} that a ${role} should understand?`,
      answer: `Mention the core concepts, why they matter, common mistakes, and how you apply them in production or real projects.`,
    },
    {
      question: `Describe a challenging bug or technical issue you solved related to ${primaryTopic}.`,
      answer: `Explain the symptoms, how you investigated, the root cause, the fix, and what you changed to prevent similar issues.`,
    },
    {
      question: `How do you decide between different technical approaches as a ${role}?`,
      answer: `Compare tradeoffs such as maintainability, performance, user impact, team familiarity, delivery time, and long-term cost.`,
    },
    {
      question: `How would you explain ${primaryTopic} to a beginner developer?`,
      answer: `Use simple language, a small example, and connect the concept to a practical use case without overloading them with details.`,
    },
    {
      question: `What would you improve in an existing project that uses ${primaryTopic}?`,
      answer: `Start by auditing code quality, performance, accessibility, tests, and developer experience. Then prioritize changes by user impact and risk.`,
    },
    {
      question: `How do you test your work as a ${role}?`,
      answer: `Discuss unit tests, integration tests, manual checks, edge cases, and how you verify behavior before shipping.`,
    },
    {
      question: `How do you handle feedback during code review?`,
      answer: `Show openness, clarify intent when needed, make improvements, and separate personal preference from technical correctness.`,
    },
    {
      question: `What makes you confident that a feature is ready to release?`,
      answer: `Mention passing tests, reviewed code, verified requirements, handled edge cases, acceptable performance, and clear rollback options.`,
    },
    {
      question: `What are common mistakes developers make with ${primaryTopic}?`,
      answer: `Name practical mistakes, explain their impact, and describe how you avoid them through structure, testing, and clear code.`,
    },
  ];

  return templates.slice(0, count);
};

exports.generateInterviewQuestions = async (req, res) => {
  try {
    const {
      role,
      experience,
      topicsToFocus,
      topicsToFoucs,
      numberOfQuestions = 5,
    } = req.body;
    const focusTopics = topicsToFocus || topicsToFoucs;
    const count = Number(numberOfQuestions);

    if (!role || !experience || !focusTopics || !Number.isInteger(count)) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    if (count < 1 || count > 10) {
      return res
        .status(400)
        .json({ message: "numberOfQuestions must be between 1 and 10" });
    }

    const prompt = questionAnswerPrompt(role, experience, focusTopics, count);
    const response = await getClient().models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });
    const data = extractJson(response.text);

    if (!Array.isArray(data)) {
      return res.status(502).json({ message: "AI returned invalid data" });
    }

    res.status(200).json(data);
  } catch (error) {
    if (isAiUnavailableError(error)) {
      const {
        role,
        experience,
        topicsToFocus,
        topicsToFoucs,
        numberOfQuestions = 5,
      } = req.body;

      return res.status(200).json(
        buildFallbackQuestions(
          role,
          experience,
          topicsToFocus || topicsToFoucs,
          Math.min(Number(numberOfQuestions) || 5, 10),
        ),
      );
    }

    res.status(500).json({
      message: getSafeAiError(error),
    });
  }
};

exports.generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({ message: "Question is required" });
    }

    const response = await getClient().models.generateContent({
      model: GEMINI_MODEL,
      contents: conceptExplainPrompt(question),
    });
    const data = extractJson(response.text);

    if (!data || !data.title || !data.explanation) {
      return res.status(502).json({ message: "AI returned invalid data" });
    }

    res.status(200).json(data);
  } catch (error) {
    if (isAiUnavailableError(error)) {
      return res.status(200).json({
        title: "شرح تدريبي مؤقت",
        explanation:
          "تعذر الوصول إلى Gemini حاليًا. مؤقتًا، راجع السؤال بتقسيمه إلى: الفكرة الأساسية، مثال عملي، الأخطاء الشائعة، وكيف تطبق المفهوم في مشروع حقيقي.",
      });
    }

    res.status(500).json({
      message: getSafeAiError(error),
    });
  }
};
