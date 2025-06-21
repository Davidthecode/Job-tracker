"use client";

import React, { useState, useEffect, FormEvent } from "react";
import axios from "axios";
import { Plus, Edit3, Loader2 } from "lucide-react";
import { Job } from "@/types/job";
import { getErrorMessage } from "@/lib/errors";

interface JobFormProps {
  job?: Job;
  onSubmit: () => void;
}

export default function JobForm({ job, onSubmit }: JobFormProps) {
  const [formData, setFormData] = useState({
    title: job?.title || "",
    company: job?.company || "",
    link: job?.link || "",
    status: job?.status || "Applied",
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      title: job?.title || "",
      company: job?.company || "",
      link: job?.link || "",
      status: job?.status || "Applied",
    });
  }, [job]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (job) {
        await axios.put(`/api/jobs/${job.id}`, formData);
      } else {
        await axios.post("/api/jobs", formData);
      }
      onSubmit();
      if (!job) {
        setFormData({ title: "", company: "", link: "", status: "Applied" });
      }
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage || "Failed to save job");
    } finally {
      setLoading(false);
    }
  };

  const statusOptions = [
    { value: "Applied", label: "Applied", color: "bg-blue-50 text-blue-700" },
    { value: "Interviewing", label: "Interviewing", color: "bg-yellow-50 text-yellow-700" },
    { value: "Rejected", label: "Rejected", color: "bg-red-50 text-red-700" },
    { value: "Offer", label: "Offer", color: "bg-green-50 text-green-700" },
  ];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <div className="text-sm text-red-700">{error}</div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-900 mb-2">
            Job Title
          </label>
          <input
            id="title"
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            placeholder="e.g., Senior Software Engineer"
            required
          />
        </div>

        <div>
          <label htmlFor="company" className="block text-sm font-medium text-gray-900 mb-2">
            Company
          </label>
          <input
            id="company"
            type="text"
            value={formData.company}
            onChange={(e) => setFormData({ ...formData, company: e.target.value })}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            placeholder="e.g., Google"
            required
          />
        </div>

        <div>
          <label htmlFor="link" className="block text-sm font-medium text-gray-900 mb-2">
            Application Link
          </label>
          <input
            id="link"
            type="url"
            value={formData.link}
            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            placeholder="https://..."
            required
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium text-gray-900 mb-2">
            Status
          </label>
          <select
            id="status"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value as Job["status"] })}
            className="block w-full rounded-md border border-gray-300 px-3 py-2 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm"
            required
          >
            {statusOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex cursor-pointer items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              {job ? (
                <>
                  <Edit3 className="h-4 w-4 mr-2" />
                  Update Application
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Application
                </>
              )}
            </>
          )}
        </button>
      </div>
    </form>
  );
}