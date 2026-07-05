import React, { useEffect, useState } from "react";
import axios from "axios";

const DockerDashboard = () => {
  const [info, setInfo] = useState(null);
  const [containers, setContainers] = useState([]);
  const [stats, setStats] = useState(null);

  const token = localStorage.getItem("diq_token");

  useEffect(() => {
    loadDockerData();
  }, []);

  const loadDockerData = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const infoRes = await axios.get(
        "http://localhost:5000/api/docker/info",
        config
      );

      const containersRes = await axios.get(
        "http://localhost:5000/api/docker/containers",
        config
      );

      const statsRes = await axios.get(
        "http://localhost:5000/api/docker/stats",
        config
      );

      setInfo(infoRes.data);
      setContainers(containersRes.data.containers || []);
      setStats(statsRes.data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h1>🐳 Docker Dashboard</h1>

      <hr />

      <h2>Docker Information</h2>

      {info && (
        <div>
          <p>
            <strong>Docker Version:</strong>{" "}
            {info.dockerVersion}
          </p>

          <p>
            <strong>Total Containers:</strong>{" "}
            {info.containers}
          </p>
        </div>
      )}

      <hr />

      <h2>Container Statistics</h2>

      {stats && (
        <div>
          <p>
            <strong>Total Containers:</strong>{" "}
            {stats.totalContainers}
          </p>

          <p>
            <strong>Running Containers:</strong>{" "}
            {stats.runningContainers}
          </p>

          <p>
            <strong>Stopped Containers:</strong>{" "}
            {stats.stoppedContainers}
          </p>
        </div>
      )}

      <hr />

      <h2>Running Containers</h2>

      {containers.length === 0 ? (
        <p>No containers found.</p>
      ) : (
        containers.map((container) => (
          <div
            key={container.Id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              marginBottom: "10px",
              borderRadius: "6px",
            }}
          >
            <p>
              <strong>ID:</strong> {container.Id}
            </p>

            <p>
              <strong>Image:</strong> {container.Image}
            </p>

            <p>
              <strong>Status:</strong> {container.Status}
            </p>
          </div>
        ))
      )}
    </div>
  );
};

export default DockerDashboard;