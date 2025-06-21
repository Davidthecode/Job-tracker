import React from "react";
import Layout from "./components/Layout";
import JobTracker from "./components/JobTracker";

export default function Home() {
  return (
    <Layout>
      <JobTracker />
    </Layout>
  );
}