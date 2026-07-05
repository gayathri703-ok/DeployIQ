import React,
{
  useEffect,
  useState,
} from "react";

import {
  getDomains,
  createDomain,
  deleteDomain,
} from "../api/domainApi";

function DomainPage() {
  const [domains,
    setDomains] =
    useState([]);

  const [domain,
    setDomain] =
    useState("");

  const [projectId,
    setProjectId] =
    useState("");

  const fetchDomains =
    async () => {
      try {
        const data =
          await getDomains();

        setDomains(
          data.domains
        );
      } catch (error) {
        console.error(error);
      }
    };

  useEffect(() => {
    fetchDomains();
  }, []);

  const handleAdd =
    async () => {
      try {
        await createDomain({
          projectId,
          domain,
        });

        setDomain("");
        setProjectId("");

        fetchDomains();
      } catch (error) {
        console.error(error);
      }
    };

  const handleDelete =
    async (id) => {
      try {
        await deleteDomain(id);

        fetchDomains();
      } catch (error) {
        console.error(error);
      }
    };

  return (
    <div
      style={{
        padding: "20px",
      }}
    >
      <h1>
        🌐 Domain Management
      </h1>

      <input
        type="text"
        placeholder="Project ID"
        value={projectId}
        onChange={(e) =>
          setProjectId(
            e.target.value
          )
        }
      />

      <br />
      <br />

      <input
        type="text"
        placeholder="Domain Name"
        value={domain}
        onChange={(e) =>
          setDomain(
            e.target.value
          )
        }
      />

      <button
        onClick={handleAdd}
      >
        Add Domain
      </button>

      <hr />

      {domains.map(
        (item) => (
          <div
            key={item._id}
            style={{
              border:
                "1px solid #ccc",
              padding:
                "10px",
              marginBottom:
                "10px",
            }}
          >
            <h3>
              {item.domain}
            </h3>

            <p>
              Project:
              {" "}
              {
                item.projectId
              }
            </p>

            <button
              onClick={() =>
                handleDelete(
                  item._id
                )
              }
            >
              Delete
            </button>
          </div>
        )
      )}
    </div>
  );
}

export default DomainPage;