import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import { type Job } from "@/types/job";

const dataFile = path.join(process.cwd(), "data", "jobs.json");

export async function getJobs(): Promise<Job[]> {
  try {
    const data = await fs.readFile(dataFile, "utf-8");
    if (!data.trim()) {
      await fs.writeFile(dataFile, JSON.stringify([], null, 2));
      return [];
    }
    const jobs = JSON.parse(data);
    if (!Array.isArray(jobs)) {
      throw new Error("Invalid data format in jobs.json: expected an array");
    }
    return jobs;
  } catch (error) {
    // If file doesn't exist, return empty array
    if ((error as NodeJS.ErrnoException).code === "ENOENT") {
      await fs.mkdir(path.dirname(dataFile), { recursive: true });
      await fs.writeFile(dataFile, JSON.stringify([], null, 2));
      return [];
    }
    //else throw an error
    throw error
  }
}

export async function createJob(jobData: Omit<Job, "id" | "createdAt" | "updatedAt">): Promise<Job> {
  const { title, company, link, status } = jobData;
  if (!title || !company || !link || !status) {
    throw new Error("Missing required fields");
  }
  const newJob: Job = {
    id: uuidv4(),
    title,
    company,
    link,
    status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  const jobs = await getJobs();
  jobs.push(newJob);
  await fs.mkdir(path.dirname(dataFile), { recursive: true });
  await fs.writeFile(dataFile, JSON.stringify(jobs, null, 2));
  return newJob;
}

export async function updateJob(id: string, jobData: Omit<Job, "id" | "createdAt">): Promise<Job> {
  const { title, company, link, status } = jobData;
  if (!title || !company || !link || !status) {
    throw new Error("Missing required fields");
  }
  const jobs = await getJobs();
  const jobIndex = jobs.findIndex(job => job.id === id);
  if (jobIndex === -1) {
    throw new Error("Job not found");
  }
  jobs[jobIndex] = { ...jobs[jobIndex], title, company, link, status, updatedAt: new Date().toISOString() };
  await fs.writeFile(dataFile, JSON.stringify(jobs, null, 2));
  return jobs[jobIndex];
}

export async function deleteJob(id: string): Promise<void> {
  const jobs = await getJobs();
  const jobIndex = jobs.findIndex(job => job.id === id);
  if (jobIndex === -1) {
    throw new Error("Job not found");
  }
  jobs.splice(jobIndex, 1);
  await fs.writeFile(dataFile, JSON.stringify(jobs, null, 2));
}