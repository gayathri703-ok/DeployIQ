import React, {
  useEffect,
  useState,
} from "react";

import axios from "axios";

const CICDDashboard = () => {

  const [data, setData] =
    useState(null);

  useEffect(() => {

    fetchStats();

  }, []);

  const fetchStats =
    async () => {

      try {

        const token =
          localStorage.getItem(
            "diq_token"
          );

        const res =
          await axios.get(
            "http://localhost:5000/api/cicd/stats",
            {
              headers: {
                Authorization:
                  `Bearer ${token}`,
              },
            }
          );

        setData(res.data);

      } catch (error) {

        console.log(error);

      }
    };

  if (!data)
    return <h2>Loading...</h2>;

  const {
    totalDeployments,
    successfulDeployments,
    failedDeployments,
    rollbackDeployments,
  } = data.stats;

  const successRate =
    totalDeployments > 0
      ? (
          (successfulDeployments /
            totalDeployments) *
          100
        ).toFixed(2)
      : 0;

  return (
    <div
      style={{
        padding: "30px",
      }}
    >
      <h1>
        🚀 CI/CD Dashboard
      </h1>

      <br />

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(4,1fr)",
          gap: "20px",
        }}
      >

        <div
          style={{
            padding: "20px",
            border:
              "1px solid #ddd",
            borderRadius: "10px",
          }}
        >
          <h3>Total</h3>
          <h1>
            {totalDeployments}
          </h1>
        </div>

        <div
          style={{
            padding: "20px",
            border:
              "1px solid #ddd",
            borderRadius: "10px",
          }}
        >
          <h3>Success</h3>
          <h1>
            {
              successfulDeployments
            }
          </h1>
        </div>

        <div
          style={{
            padding: "20px",
            border:
              "1px solid #ddd",
            borderRadius: "10px",
          }}
        >
          <h3>Failed</h3>
          <h1>
            {failedDeployments}
          </h1>
        </div>

        <div
          style={{
            padding: "20px",
            border:
              "1px solid #ddd",
            borderRadius: "10px",
          }}
        >
          <h3>Rollbacks</h3>
          <h1>
            {
              rollbackDeployments
            }
          </h1>
        </div>

      </div>

      <br />

      <div
        style={{
          padding: "20px",
          border:
            "1px solid #ddd",
          borderRadius: "10px",
        }}
      >
        <h2>
          Success Rate
        </h2>

        <h1>
          {successRate}%
        </h1>
      </div>

      <br />

      <h2>
        Recent Deployments
      </h2>

      {data.recentDeployments.map(
        (deployment) => (

          <div
            key={
              deployment._id
            }
            style={{
              padding: "15px",
              border:
                "1px solid #ddd",
              marginBottom:
                "10px",
              borderRadius:
                "8px",
            }}
          >
            <p>
              <strong>
                Project:
              </strong>{" "}
              {
                deployment.projectId
              }
            </p>

            <p>
              <strong>
                Status:
              </strong>{" "}
              {
                deployment.status
              }
            </p>

            <p>
  <strong>Date:</strong>{" "}
  {deployment.createdAt &&
  !isNaN(
    new Date(
      deployment.createdAt
    ).getTime()
  )
    ? new Date(
        deployment.createdAt
      ).toLocaleString()
    : "Unknown Date"}
</p>
          </div>

        )
      )}
    </div>
  );
};

export default CICDDashboard;