const { GoogleGenAI } = require("@google/genai");
const Resume = require("../models/Resume");

const GEMINI_MODEL = process.env.GEMINI_MODEL || "gemini-2.5-flash-lite";

const getClient = () => {
  const apiKey = String(process.env.GEMINI_API_KEY || "").trim();

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not configured");
  }

  return new GoogleGenAI({ apiKey });
};

const cleanJson = (text) =>
  String(text || "")
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/```\s*$/i, "")
    .trim();

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

const safeAiMessage = (error) => {
  const message = String(error?.message || "");

  if (isQuotaError(error)) {
    return "Gemini API quota exceeded. Using manual editing mode.";
  }
  if (message.includes("API key not valid") || message.includes("API_KEY_INVALID")) {
    return "Gemini API key is invalid. Check GEMINI_API_KEY in backend/.env.";
  }
  if (message.includes("fetch failed")) {
    return "Could not reach Gemini API. Check your internet connection.";
  }

  return "Gemini API request failed.";
};

const fallbackParsedResume = (resumeText, title) => ({
  title: title || "سيرة ذاتية مستوردة",
  professionalSummary: resumeText.slice(0, 300),
  skills: [],
  personalInfo: {},
  experience: [],
  projects: [],
  education: [],
});

exports.enhanceProfessionalSummary = async (req, res) => {
  try {
    const { profession, summary, userContent } = req.body;
    const content = userContent || summary;

    if (!content && !profession) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await getClient().models.generateContent({
      model: GEMINI_MODEL,
      contents: `Improve this resume professional summary in 1-2 ATS-friendly sentences. Return only the improved text.
Profession: ${profession || ""}
Current summary:
${content || ""}`,
    });

    const enhancedContent = String(response.text || "").trim();
    res.json({ enhancedContent, summary: enhancedContent });
  } catch (error) {
    if (isAiUnavailableError(error)) {
      const enhancedContent =
        "اكتب ملخصًا مهنيًا مختصرًا يوضح خبرتك، أهم مهاراتك، ونوع الفرصة التي تستهدفها.";

      return res.json({
        enhancedContent,
        summary: enhancedContent,
        fallback: true,
        warning: safeAiMessage(error),
      });
    }

    res.status(400).json({ message: safeAiMessage(error) });
  }
};

exports.enhanceJobDescription = async (req, res) => {
  try {
    const { company, description, position, userContent } = req.body;
    const content = userContent || description;

    if (!content && !position) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await getClient().models.generateContent({
      model: GEMINI_MODEL,
      contents: `Rewrite this resume job description in 1-2 strong ATS-friendly sentences using action verbs. Return only the improved text.
Position: ${position || ""}
Company: ${company || ""}
Current description:
${content || ""}`,
    });

    const enhancedContent = String(response.text || "").trim();
    res.json({ enhancedContent, description: enhancedContent });
  } catch (error) {
    if (isAiUnavailableError(error)) {
      const enhancedContent =
        "صف مسؤولياتك وإنجازاتك بأفعال قوية، واذكر النتائج أو الأثر عندما يمكن قياسه.";

      return res.json({
        enhancedContent,
        description: enhancedContent,
        fallback: true,
        warning: safeAiMessage(error),
      });
    }

    res.status(400).json({ message: safeAiMessage(error) });
  }
};

exports.uploadResume = async (req, res) => {
  try {
    const { resumeText, title } = req.body;

    if (!resumeText) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const response = await getClient().models.generateContent({
      model: GEMINI_MODEL,
      contents: `
Extract structured resume data from this text.
Return only valid JSON using this shape:
{
  "professionalSummary": "",
  "skills": [],
  "personalInfo": {
    "image": "",
    "fullName": "",
    "profession": "",
    "email": "",
    "phone": "",
    "location": "",
    "linkedin": "",
    "website": ""
  },
  "experience": [
    {
      "company": "",
      "position": "",
      "startDate": "",
      "endDate": "",
      "description": "",
      "isCurrent": false
    }
  ],
  "projects": [
    {
      "name": "",
      "type": "",
      "description": ""
    }
  ],
  "education": [
    {
      "institution": "",
      "degree": "",
      "field": "",
      "graduationDate": "",
      "gpa": ""
    }
  ]
}

Resume text:
${resumeText}
`,
    });

    const parsedData = JSON.parse(cleanJson(response.text));
    const resume = await Resume.create({
      user: req.user._id,
      title: title || "سيرة ذاتية مستوردة",
      ...parsedData,
    });

    res.json({ resumeId: resume._id, resume });
  } catch (error) {
    if (isAiUnavailableError(error)) {
      const resume = await Resume.create({
        user: req.user._id,
        ...fallbackParsedResume(req.body.resumeText || "", req.body.title),
      });

      return res.json({
        resumeId: resume._id,
        resume,
        fallback: true,
        warning: safeAiMessage(error),
      });
    }

    res.status(400).json({ message: safeAiMessage(error) });
  }
};
