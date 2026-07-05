import React, {
  useEffect,
  useState,
} from "react";

import {
  getAnalytics,
} from "../api/analyticsApi";

function DeploymentAnalytics() {
  const [data, setData] =
    useState(null);

  const fetchAnalytics =
    async () => {
      try {
        const result =
          await getAnalytics();

        setData(
          result.analytics
        );
      } catch (error) {
        console.log(error);
      }
    };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  if (!data) {
    return (
      <h2>
        Loading Analytics...
      </h2>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <h1>
        📊 Deployment Analytics
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(2,1fr)",
          gap: "20px",
          marginTop: "20px",
        }}
      >
        <div>
          <h3>
            Total Projects
          </h3>
          <h2>
            {
              data.totalProjects
            }
          </h2>
        </div>

        <div>
          <h3>
            Total Deployments
          </h3>
          <h2>
            {
              data.totalDeployments
            }
          </h2>
        </div>

        <div>
          <h3>
            Successful
          </h3>
          <h2>
            {
              data.successfulDeployments
            }
          </h2>
        </div>

        <div>
          <h3>
            Rolled Back
          </h3>
          <h2>
            {
              data.rolledBackDeployments
            }
          </h2>
        </div>

        <div>
          <h3>
            Pending
          </h3>
          <h2>
            {
              data.pendingDeployments
            }
          </h2>
        </div>
      </div>
    </div>
  );
}

export default DeploymentAnalytics;