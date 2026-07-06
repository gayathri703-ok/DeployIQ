import axios from "./axios";

export const projectsAPI = {

  list: () =>
    axios.get("/projects"),

  create: (data) =>
    axios.post("/projects", data),

  delete: (id) =>
    axios.delete(`/projects/${id}`)

};