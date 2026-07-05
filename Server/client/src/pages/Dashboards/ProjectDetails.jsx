import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProjectById } from "../../api/projectApi";

export default function ProjectDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadProject();
    }
  }, [id]);

  const loadProject = async () => {
    try {
      console.log("Project ID =", id);

      const data = await getProjectById(id);

      console.log("Project Details:", data);

      setProject(data.project);
    } catch (error) {
      console.error("Load Project Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-white">
        Loading Project...
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6 text-red-500">
        Project Not Found
      </div>
    );
  }

  return (
    <div className="p-6 text-white min-h-screen bg-[#0f172a]">
      <button
        onClick={() => navigate("/dashboard/projects")}
        className="mb-6 px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
      >
        ← Back
      </button>

      <h1 className="text-3xl font-bold mb-6">
        {project.name}
      </h1>

      <div className="bg-[#1e293b] rounded-xl p-6 space-y-4">
        <p>
          <strong>Project ID:</strong> {project._id}
        </p>

        <p>
          <strong>Repository:</strong> {project.repoName}
        </p>

        <p>
          <strong>Repository URL:</strong> {project.repoUrl}
        </p>

        <p>
          <strong>Framework:</strong> {project.framework}
        </p>

        <p>
          <strong>Branch:</strong> {project.branch}
        </p>

        <p>
          <strong>Status:</strong> {project.status}
        </p>

        <p>
          <strong>Created At:</strong>{" "}
          {new Date(project.createdAt).toLocaleString()}
        </p>

        <p>
          <strong>Updated At:</strong>{" "}
          {new Date(project.updatedAt).toLocaleString()}
        </p>
      </div>
    </div>
  );
}