const questionAnswerPrompt = (
  role,
  experience,
  topicsToFocus,
  numberOfQuestions,
) => `
Generate exactly ${numberOfQuestions} unique technical interview questions.

Role: ${role}
Experience: ${experience} years
Topics: ${topicsToFocus}

Requirements:
- Exactly ${numberOfQuestions} questions
- Short answers, max 80 words each
- No long code examples
- Focus on key concepts only
- Unique and different questions

Return only a valid JSON array:
[
  {
    "question": "Question text?",
    "answer": "Short concise answer"
  }
]
`;

const conceptExplainPrompt = (question) => `
You are an AI trained to explain interview questions.

Task:
- Explain this interview question and its core concept in depth as if teaching a beginner developer.
- Question: ${question}
- Include a short clear title.
- If code helps, include a small code block.
- Keep formatting clean and clear.

Return only a valid JSON object:
{
  "title": "Short title here",
  "explanation": "Explanation here"
}
`;

module.exports = { questionAnswerPrompt, conceptExplainPrompt };
