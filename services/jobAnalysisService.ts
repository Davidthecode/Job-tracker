import { GoogleGenerativeAI } from "@google/generative-ai";

interface AnalysisResponse {
  summary: string;
  skills: string[];
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

export async function analyzeJobDescription(jobDescription: string): Promise<AnalysisResponse> {
  if (!jobDescription || typeof jobDescription !== "string") {
    throw new Error("Job description is required and must be a string");
  }

  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
    You are a career assistant. Given a job description, provide:
    1. A concise summary of the job (2-3 sentences).
    2. Three specific skills the candidate should highlight in their resume for this role.
    Return the response as a valid JSON object, ensuring no extra text or code blocks (e.g., \`\`\`json). The format must be:
    {
      "summary": "Summary text here",
      "skills": ["Skill 1", "Skill 2", "Skill 3"]
    }

    Job Description:
    ${jobDescription}
  `;

  try {
    const result = await model.generateContent(prompt);
    const rawText = result.response.text();

    // Remove potential code blocks or extra whitespace
    const cleanedText = rawText.replace(/```json\n?|\n?```/g, "").trim();

    const analysis = JSON.parse(cleanedText) as AnalysisResponse;

    if (!analysis.summary || !analysis.skills || !Array.isArray(analysis.skills) || analysis.skills.length !== 3) {
      throw new Error("Invalid response format from Gemini");
    }

    return analysis;
  } catch (error) {
    console.error("Error in analyzeJobDescription:", error);
    throw new Error(`Failed to analyze job description: ${error instanceof Error ? error.message : String(error)}`);
  }
}