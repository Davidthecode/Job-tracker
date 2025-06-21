"use client";

import React, { useState, FormEvent } from "react";
import axios from "axios";
import { Brain, Lightbulb, FileText, Loader2 } from "lucide-react";
import { getErrorMessage } from "@/lib/errors";

interface AnalysisResponse {
  summary: string;
  skills: string[];
}

export default function JobAnalyzer() {
  const [jobDescription, setJobDescription] = useState("");
  const [analysis, setAnalysis] = useState<AnalysisResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setAnalysis(null);
    setLoading(true);

    try {
      const response = await axios.post<AnalysisResponse>("/api/analyze-job", { jobDescription });
      setAnalysis(response.data);
    } catch (error) {
      const errorMessage = getErrorMessage(error);
      setError(errorMessage || "Failed to analyze job description");
    } finally {
      setLoading(false);
    }
  };

  const handleClear = () => {
    setJobDescription("");
    setAnalysis(null);
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
          <Brain className="h-6 w-6 text-blue-600" />
        </div>
        <h3 className="mt-3 text-lg font-medium text-gray-900">AI Job Analysis</h3>
        <p className="mt-2 text-sm text-gray-500">
          Paste a job description below to get AI-powered insights and skill recommendations
        </p>
      </div>

      <form onSubmit={handleAnalyze} className="space-y-4">
        <div>
          <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-900 mb-2">
            Job Description
          </label>
          <textarea
            id="jobDescription"
            value={jobDescription}
            onChange={(e) => setJobDescription(e.target.value)}
            className="block w-full rounded-md border border-gray-300 px-3 py-3 text-gray-900 placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:text-sm resize-none"
            rows={8}
            placeholder="Paste the complete job description here..."
            required
          />
          <p className="mt-1 text-xs text-gray-500">
            Include the full job posting for the most accurate analysis
          </p>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={handleClear}
            className="text-sm cursor-pointer text-gray-500 hover:text-gray-700 transition-colors"
            disabled={loading}
          >
            Clear
          </button>
          <button
            type="submit"
            disabled={loading || !jobDescription.trim()}
            className="inline-flex cursor-pointer items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Brain className="h-4 w-4 mr-2" />
                Analyze Job
              </>
            )}
          </button>
        </div>
      </form>

      {error && (
        <div className="rounded-md bg-red-50 p-4 border border-red-200">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Analysis Failed</h3>
              <div className="mt-1 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {analysis && (
        <div className="space-y-6">
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Analysis Results</h3>

            {/* Summary Section */}
            <div className="bg-blue-50 rounded-lg p-4 mb-6">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <FileText className="h-5 w-5 text-blue-600 mt-0.5" />
                </div>
                <div className="ml-3">
                  <h4 className="text-sm font-medium text-blue-800 mb-2">Job Summary</h4>
                  <p className="text-sm text-blue-700 leading-relaxed">{analysis.summary}</p>
                </div>
              </div>
            </div>

            {/* Skills Section */}
            <div className="bg-green-50 rounded-lg p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <Lightbulb className="h-5 w-5 text-green-600 mt-0.5" />
                </div>
                <div className="ml-3 w-full">
                  <h4 className="text-sm font-medium text-green-800 mb-3">Skills to Highlight</h4>
                  <div className="grid grid-cols-1 gap-2">
                    {analysis.skills.map((skill, index) => (
                      <div
                        key={index}
                        className="flex items-center p-2 bg-white rounded border border-green-200"
                      >
                        <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3">
                          <span className="text-xs font-medium text-green-600">{index + 1}</span>
                        </div>
                        <span className="text-sm text-gray-900">{skill}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 p-3 bg-gray-50 rounded-md">
              <p className="text-xs text-gray-600">
                💡 <strong>Pro tip:</strong> Use these insights to tailor your resume and cover letter for this specific role.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}