import React, {
  useState,
} from "react";

import axios from "axios";

function NginxPage() {

  const [domain, setDomain] =
    useState("");

  const [port, setPort] =
    useState("");

  const [config, setConfig] =
    useState("");

  const generate = async () => {

    const res =
      await axios.post(
        "http://localhost:5000/api/nginx/generate",
        {
          domain,
          port,
        }
      );

    setConfig(
      res.data.config
    );
  };

  return (
    <div>

      <h2>
        Nginx Config Generator
      </h2>

      <input
        placeholder="Domain"
        value={domain}
        onChange={(e) =>
          setDomain(
            e.target.value
          )
        }
      />

      <input
        placeholder="Port"
        value={port}
        onChange={(e) =>
          setPort(
            e.target.value
          )
        }
      />

      <button onClick={generate}>
        Generate
      </button>

      <pre>
        {config}
      </pre>

    </div>
  );
}

export default NginxPage;