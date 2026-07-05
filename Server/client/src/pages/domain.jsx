import React, {
  useEffect,
  useState,
} from "react";

import {
  getDomains,
  createDomain,
  deleteDomain,
} from "../api/domainApi";

function Domains() {
  const [domains, setDomains] =
    useState([]);

  const [domainName, setDomainName] =
    useState("");

  const fetchDomains = async () => {
    try {
      const data =
        await getDomains();

      setDomains(
        data.domains || []
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchDomains();
  }, []);

  const handleCreate = async () => {
    try {
      await createDomain({
        domain: domainName,
      });

      setDomainName("");

      fetchDomains();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (
    id
  ) => {
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
        placeholder="Enter Domain"
        value={domainName}
        onChange={(e) =>
          setDomainName(
            e.target.value
          )
        }
      />

      <button
        onClick={handleCreate}
      >
        Add Domain
      </button>

      <hr />

      {domains.map((domain) => (
        <div
          key={domain._id}
          style={{
            border:
              "1px solid #ccc",
            padding: "10px",
            marginBottom:
              "10px",
          }}
        >
          <h3>
            {domain.domain}
          </h3>

          <p>
            Status:
            {" "}
            {domain.status}
          </p>

          <button
            onClick={() =>
              handleDelete(
                domain._id
              )
            }
          >
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}

export default Domains;