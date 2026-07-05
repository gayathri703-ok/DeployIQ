import React, { useEffect, useState } from "react";

import {
  getEnvVars,
  createEnvVar,
  deleteEnvVar,
} from "../api/envVarApi";

const PROJECT_ID = "6a1bd69b495a852d708b9494";

function EnvVarsPage() {
  const [envVars, setEnvVars] = useState([]);
  const [keyName, setKeyName] = useState("");
  const [value, setValue] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchEnvVars = async () => {
    try {
      const data = await getEnvVars(PROJECT_ID);

      setEnvVars(data.envVars || []);
    } catch (error) {
      console.error("GET ENV VARS ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnvVars();
  }, []);

  const handleCreate = async () => {
    if (!keyName || !value) {
      alert("Please fill all fields");
      return;
    }

    try {
      await createEnvVar(
        PROJECT_ID,
        keyName,
        value
      );

      setKeyName("");
      setValue("");

      fetchEnvVars();
    } catch (error) {
      console.error(
        "CREATE ENV VAR ERROR:",
        error
      );
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEnvVar(id);

      fetchEnvVars();
    } catch (error) {
      console.error(
        "DELETE ENV VAR ERROR:",
        error
      );
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "20px" }}>
        Loading...
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "900px",
        margin: "0 auto",
        padding: "20px",
      }}
    >
      <h1>🔐 Environment Variables</h1>

      <div
        style={{
          marginTop: "20px",
          marginBottom: "20px",
        }}
      >
        <input
          type="text"
          placeholder="KEY"
          value={keyName}
          onChange={(e) =>
            setKeyName(e.target.value)
          }
          style={{
            padding: "10px",
            marginRight: "10px",
          }}
        />

        <input
          type="text"
          placeholder="VALUE"
          value={value}
          onChange={(e) =>
            setValue(e.target.value)
          }
          style={{
            padding: "10px",
            marginRight: "10px",
          }}
        />

        <button onClick={handleCreate}>
          Add Variable
        </button>
      </div>

      {envVars.length === 0 ? (
        <p>No environment variables found.</p>
      ) : (
        envVars.map((env) => (
          <div
            key={env._id}
            style={{
              border: "1px solid #ddd",
              padding: "15px",
              marginBottom: "10px",
              borderRadius: "8px",
            }}
          >
            <p>
              <strong>Key:</strong>{" "}
              {env.key}
            </p>

            <p>
              <strong>Value:</strong>{" "}
              {env.value}
            </p>

            <button
              onClick={() =>
                handleDelete(env._id)
              }
            >
              Delete
            </button>
          </div>
        ))
      )}
    </div>
  );
}

export default EnvVarsPage;