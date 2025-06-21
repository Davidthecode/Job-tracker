import type { NextApiRequest, NextApiResponse } from "next";
import { updateJob, deleteJob } from "@/controllers/jobController";
import { getErrorMessage } from "@/lib/errors";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { method, query: { id } } = req;

  if (typeof id !== "string") {
    return res.status(400).json({ error: "Invalid job ID" });
  }

  switch (method) {
    case "PUT":
      try {
        const updatedJob = await updateJob(id, req.body);
        res.status(200).json(updatedJob);
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        res.status(errorMessage === "Missing required fields" || errorMessage === "Job not found" ? 404 : 500).json({
          error: errorMessage
        });
      }
      break;

    case "DELETE":
      try {
        await deleteJob(id);
        res.status(204).end();
      } catch (error) {
        const errorMessage = getErrorMessage(error);
        res.status(errorMessage === "Job not found" ? 404 : 500).json({
          error: errorMessage
        });
      }
      break;

    default:
      res.setHeader("Allow", ["PUT", "DELETE"]);
      res.status(405).json({ error: `Method ${method} not allowed` });
  }
}