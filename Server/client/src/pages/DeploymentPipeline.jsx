import React, {
  useState,
} from "react";

import axios from "axios";

const DeploymentPipeline = () => {

  const [projectId,
    setProjectId] =
    useState("");

  const [result,
    setResult] =
    useState(null);

  const deploy =
    async () => {

      const token =
        localStorage.getItem(
          "diq_token"
        );

      const res =
        await axios.post(

          `http://localhost:5000/api/pipeline/deploy/${projectId}`,

          {},

          {
            headers: {
              Authorization:
                `Bearer ${token}`
            }
          }
        );

      setResult(
        res.data
      );
    };

  return (
    <div
      style={{
        padding: "20px"
      }}
    >
      <h2>
        🚀 Deployment Pipeline
      </h2>

      <input
        placeholder="Project ID"
        value={projectId}
        onChange={(e) =>
          setProjectId(
            e.target.value
          )
        }
      />

      <button
        onClick={deploy}
      >
        Deploy
      </button>

      {result && (

        <pre>
          {JSON.stringify(
            result,
            null,
            2
          )}
        </pre>

      )}

    </div>
  );
};

export default
DeploymentPipeline;