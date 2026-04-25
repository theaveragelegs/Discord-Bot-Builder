import { create } from 'zustand';

const STORAGE_KEY = 'dbb_projects';
const SETTINGS_KEY = 'dbb_settings';

// ─── HELPERS ─────────────────────────────────────
function loadProjectsFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveProjectsToStorage(projects) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(projects));
}

function loadSettingsFromStorage() {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw ? JSON.parse(raw) : getDefaultSettings();
  } catch {
    return getDefaultSettings();
  }
}

function saveSettingsToStorage(settings) {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}

function getDefaultSettings() {
  return {
    bot_token: '',
    bot_prefix: '!',
    intents: ['Guilds', 'GuildMessages', 'MessageContent', 'GuildMembers', 'GuildMessageReactions', 'GuildVoiceStates'],
    activity_type: 'Playing',
    activity_text: '',
  };
}

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

// ─── STORE ───────────────────────────────────────
const useProjectStore = create((set, get) => ({
  projects: loadProjectsFromStorage(),
  currentProject: null,
  settings: loadSettingsFromStorage(),
  loading: false,
  error: null,
  lastSaved: null,

  // Load projects from localStorage
  fetchProjects: () => {
    const projects = loadProjectsFromStorage();
    set({ projects });
    return projects;
  },

  // Load a single project by ID
  loadProject: (id) => {
    const projects = loadProjectsFromStorage();
    const project = projects.find((p) => p.id === id);
    if (!project) return null;
    set({ currentProject: project });
    return project;
  },

  // Create a new project
  createProject: (name = 'Untitled Bot') => {
    const now = new Date().toISOString();
    const project = {
      id: generateId(),
      name,
      description: '',
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
      created_at: now,
      updated_at: now,
    };
    const projects = [project, ...loadProjectsFromStorage()];
    saveProjectsToStorage(projects);
    set({ projects, currentProject: project });
    return project;
  },

  // Save flow data to the current project
  saveProject: (flowData) => {
    const { currentProject } = get();
    if (!currentProject) return null;

    const now = new Date().toISOString();
    const updated = {
      ...currentProject,
      ...flowData,
      updated_at: now,
    };

    const projects = loadProjectsFromStorage().map((p) =>
      p.id === updated.id ? updated : p
    );
    saveProjectsToStorage(projects);
    set({
      currentProject: updated,
      lastSaved: now,
      projects,
    });
    return updated;
  },

  // Rename project
  updateProjectName: (name) => {
    const { currentProject } = get();
    if (!currentProject) return;

    const updated = { ...currentProject, name, updated_at: new Date().toISOString() };
    const projects = loadProjectsFromStorage().map((p) =>
      p.id === currentProject.id ? updated : p
    );
    saveProjectsToStorage(projects);
    set({ currentProject: updated, projects });
  },

  // Delete project
  deleteProject: (id) => {
    const projects = loadProjectsFromStorage().filter((p) => p.id !== id);
    saveProjectsToStorage(projects);
    set((state) => ({
      projects,
      currentProject: state.currentProject?.id === id ? null : state.currentProject,
    }));
  },

  // Duplicate project
  duplicateProject: (id) => {
    const projects = loadProjectsFromStorage();
    const original = projects.find((p) => p.id === id);
    if (!original) return null;

    const now = new Date().toISOString();
    const duplicate = {
      ...JSON.parse(JSON.stringify(original)),
      id: generateId(),
      name: original.name + ' (Copy)',
      created_at: now,
      updated_at: now,
    };

    const updated = [duplicate, ...projects];
    saveProjectsToStorage(updated);
    set({ projects: updated });
    return duplicate;
  },

  // Import project from JSON
  importProject: (projectData) => {
    const data = typeof projectData === 'string' ? JSON.parse(projectData) : projectData;
    const now = new Date().toISOString();
    const project = {
      id: generateId(),
      name: data.name || 'Imported Bot',
      description: data.description || '',
      nodes: data.nodes || [],
      edges: data.edges || [],
      viewport: data.viewport || { x: 0, y: 0, zoom: 1 },
      created_at: now,
      updated_at: now,
    };

    const projects = [project, ...loadProjectsFromStorage()];
    saveProjectsToStorage(projects);
    set({ projects });
    return project;
  },

  // Export project as JSON
  exportProjectJSON: (id) => {
    const projects = loadProjectsFromStorage();
    const project = projects.find((p) => p.id === id);
    if (!project) return null;
    return {
      name: project.name,
      description: project.description,
      nodes: project.nodes,
      edges: project.edges,
      viewport: project.viewport,
      exportedAt: new Date().toISOString(),
      version: '1.0.0',
    };
  },

  // Settings management
  getSettings: () => get().settings,

  updateSettings: (newSettings) => {
    const current = get().settings;
    const updated = { ...current, ...newSettings };
    saveSettingsToStorage(updated);
    set({ settings: updated });
    return updated;
  },

  setCurrentProject: (project) => set({ currentProject: project }),
  clearError: () => set({ error: null }),
}));

export default useProjectStore;
