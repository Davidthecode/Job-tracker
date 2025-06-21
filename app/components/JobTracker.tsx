"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { Briefcase, TrendingUp } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import JobForm from "./JobForm";
import JobTable from "./JobTable";
import JobAnalyzer from "./JobAnalyzer";
import Modal from "./Modal";
import { Job } from "@/types/job";

export default function JobTracker() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [editingJob, setEditingJob] = useState<Job | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAnalyzerModal, setShowAnalyzerModal] = useState(false);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await axios.get<Job[]>("/api/jobs");
      setJobs(response.data);
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      toast.error("Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleEdit = (job: Job) => {
    setEditingJob(job);
    setShowEditModal(true);
  };

  const handleDelete = (id: string) => {
    setJobs(jobs.filter((job) => job.id !== id));
    toast.success("Job deleted successfully");
  };

  const handleFormSubmit = () => {
    fetchJobs();
    setEditingJob(undefined);
    setShowEditModal(false);
    toast.success(editingJob ? "Job updated successfully" : "Job added successfully");
  };

  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditingJob(undefined);
  };

  return (
    <>
      <Toaster
        toastOptions={{
          style: {
            padding: '8px 12px',
            fontSize: '14px',
            maxWidth: '320px',
            lineHeight: '1.5',
          },
        }}
      />

      <div className="space-y-8">
        {/* Header Section */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-gray-900">Job Applications</h1>
            <p className="text-gray-600 mt-1">Track and manage your job applications</p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowAnalyzerModal(true)}
              className="inline-flex cursor-pointer items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
            >
              <TrendingUp className="h-4 w-4 mr-2" />
              Analyze Job
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-blue-50 rounded-lg">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Applications</p>
                <p className="text-2xl font-semibold text-gray-900">{jobs.length}</p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-yellow-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-yellow-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Interviewing</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {jobs.filter(job => job.status === "Interviewing").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-green-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Offers</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {jobs.filter(job => job.status === "Offer").length}
                </p>
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="p-2 bg-red-50 rounded-lg">
                <TrendingUp className="h-5 w-5 text-red-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Rejected</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {jobs.filter(job => job.status === "Rejected").length}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Add Job Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Add New Application</h2>
          </div>
          <div className="p-6">
            <JobForm onSubmit={handleFormSubmit} />
          </div>
        </div>

        {/* Job Table */}
        {loading ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">Loading applications...</span>
            </div>
          </div>
        ) : (
          <JobTable jobs={jobs} onEdit={handleEdit} onDelete={handleDelete} />
        )}

        {/* Edit Modal */}
        <Modal
          isOpen={showEditModal}
          onClose={handleCloseEditModal}
          title="Edit Application"
        >
          <JobForm job={editingJob} onSubmit={handleFormSubmit} />
        </Modal>

        {/* Analyzer Modal */}
        <Modal
          isOpen={showAnalyzerModal}
          onClose={() => setShowAnalyzerModal(false)}
          title="Analyze Job Description"
          size="lg"
        >
          <JobAnalyzer />
        </Modal>
      </div>
    </>
  );
}