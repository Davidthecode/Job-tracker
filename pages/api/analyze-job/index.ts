import type { NextApiRequest, NextApiResponse } from "next";
import { analyzeJobDescription } from "@/services/jobAnalysisService";
import { getErrorMessage } from "@/lib/errors";

interface AnalysisResponse {
  summary: string;
  skills: string[];
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AnalysisResponse | { error: string }>,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: `Method ${req.method} not allowed` });
  }

  const { jobDescription } = req.body;

  try {
    const analysis = await analyzeJobDescription(jobDescription);
    res.status(200).json(analysis);
  } catch (error) {
    const errorMessage = getErrorMessage(error);
    res.status(500).json({ error: errorMessage });
  }
}