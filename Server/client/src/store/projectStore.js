import { create } from 'zustand';
import { projectAPI, deploymentAPI } from '../api/axios';

const useProjectStore = create((set) => ({
  projects: [],
  deployments: [],
  loading: false,
  error: null,

  fetchProjects: async () => {
    set({ loading: true, error: null });
    try {
      const { data } = await projectsAPI.list();
      set({ projects: data.projects || [], loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  createProject: async (payload) => {
    const { data } = await projectsAPI.create(payload);
    set((state) => ({
      projects: [data.project, ...state.projects]
    }));
    return data.project;
  },

  deleteProject: async (id) => {
    await projectsAPI.delete(id);
    set((state) => ({
      projects: state.projects.filter((p) => p._id !== id)
    }));
  },

  fetchDeployments: async (params = {}) => {
    set({ loading: true });
    try {
      const { data } = await deploymentsAPI.list(params);
      set({ deployments: data.deployments || [], loading: false });
    } catch (err) {
      set({ error: err.message, loading: false });
    }
  },

  triggerDeploy: async (projectId) => {
    const { data } = await deploymentsAPI.create({ projectId });
    set((state) => ({
      deployments: [data.deployment || data, ...state.deployments]
    }));
    return data;
  }
}));

export default useProjectStore;