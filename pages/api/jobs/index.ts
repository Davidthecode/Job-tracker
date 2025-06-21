import type { NextApiRequest, NextApiResponse } from "next";
import { getJobs, createJob } from "@/controllers/jobController";
import { getErrorMessage } from "@/lib/errors";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method } = req;

  switch (method) {
    case "GET":
      try {
        console.log("getting jobs");
        const jobs = await getJobs();
        res.status(200).json(jobs);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        res.status(errorMessage === "Missing required fields" || errorMessage === "Job not found" ? 404 : 500).json({
          error: errorMessage
        });
      }
      break;

    case "POST":
      try {
        const newJob = await createJob(req.body);
        res.status(201).json(newJob);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        res.status(errorMessage === "Missing required fields" ? 404 : 500).json({
          error: errorMessage
        });
      }
      break;

    default:
      res.setHeader("Allow", ["GET", "POST"]);
      res.status(405).json({ error: `Method ${method} not allowed` });
  }
}