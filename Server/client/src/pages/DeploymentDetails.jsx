import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { getDeploymentById } from "../api/deploymentApi";
import { rollbackDeployment } from "../api/rollbackApi";

function DeploymentDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [deployment, setDeployment] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDeployment = async () => {
    try {
      const data = await getDeploymentById(id);
      setDeployment(data.deployment);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeployment();
  }, [id]);

  const handleRollback = async () => {
    try {
      const data = await rollbackDeployment(id);

      alert(data.message);

      fetchDeployment();
    } catch (error) {
      console.error(error);
      alert("Rollback failed");
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!deployment) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>Deployment Not Found</h2>

        <button
          onClick={() =>
            navigate("/dashboard/deployments")
          }
        >
          Back
        </button>
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
      <h1>🚀 Deployment Details</h1>

      <p>
        <strong>ID:</strong> {deployment._id}
      </p>

      <p>
        <strong>Project ID:</strong>{" "}
        {deployment.projectId}
      </p>

      <p>
        <strong>Status:</strong>{" "}
        <span
          style={{
            fontWeight: "bold",
            color:
              deployment.status === "success"
                ? "green"
                : deployment.status === "rolled_back"
                ? "red"
                : "orange",
          }}
        >
          {deployment.status}
        </span>
      </p>

      <button
  onClick={handleRollback}
  disabled={
    deployment.status ===
    "rolled_back"
  }
  style={{
    background:
      deployment.status ===
      "rolled_back"
        ? "#9ca3af"
        : "#dc2626",
    color: "white",
    border: "none",
    padding: "10px 16px",
    borderRadius: "6px",
    cursor:
      deployment.status ===
      "rolled_back"
        ? "not-allowed"
        : "pointer",
    marginBottom: "20px",
  }}
>
  {deployment.status ===
  "rolled_back"
    ? "✅ Already Rolled Back"
    : "🔄 Rollback Deployment"}
</button>

      <h3>Deployment Logs</h3>

      <div
        style={{
          background: "#111827",
          color: "#22c55e",
          padding: "15px",
          borderRadius: "10px",
          fontFamily: "monospace",
          maxHeight: "350px",
          overflowY: "auto",
        }}
      >
        {(deployment.logs || []).length > 0 ? (
          deployment.logs.map((log, index) => (
            <div key={index}>{log}</div>
          ))
        ) : (
          <div>No logs available</div>
        )}
      </div>

      <button
        onClick={() =>
          navigate("/dashboard/deployments")
        }
        style={{
          marginTop: "20px",
          padding: "10px 16px",
        }}
      >
        Back
      </button>
    </div>
  );
}

export default DeploymentDetails;