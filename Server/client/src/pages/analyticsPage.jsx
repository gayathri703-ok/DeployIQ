import React, { useEffect, useState } from "react";
import { getAnalytics } from "../api/analyticsApi";

const AnalyticsPage = () => {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    try {
      const data = await getAnalytics();

      setAnalytics(data.analytics);
    } catch (error) {
      console.error(
        "FETCH ANALYTICS ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Loading Analytics...</h2>
      </div>
    );
  }

  if (!analytics) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>No Analytics Found</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        maxWidth: "900px",
        margin: "0 auto",
      }}
    >
      <h1>📊 Deployment Analytics</h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
          }}
        >
          <h3>Total Deployments</h3>
          <h2>
            {analytics.totalDeployments}
          </h2>
        </div>

        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
          }}
        >
          <h3>Successful Deployments</h3>
          <h2>
            {analytics.successfulDeployments}
          </h2>
        </div>

        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
          }}
        >
          <h3>Rolled Back</h3>
          <h2>
            {analytics.rolledBackDeployments}
          </h2>
        </div>

        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
          }}
        >
          <h3>Pending Deployments</h3>
          <h2>
            {analytics.pendingDeployments}
          </h2>
        </div>

        <div
          style={{
            padding: "20px",
            border: "1px solid #ddd",
            borderRadius: "10px",
          }}
        >
          <h3>Success Rate</h3>
          <h2>
            {analytics.successRate}%
          </h2>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;