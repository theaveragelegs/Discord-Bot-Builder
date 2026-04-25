import { create } from 'zustand';

const useUIStore = create((set) => ({
  selectedNodeId: null,
  activePanel: 'palette', // 'palette' | 'properties' | 'code' | 'projects' | 'settings' | 'console'
  rightPanel: 'properties', // 'properties' | 'code'
  searchQuery: '',
  sidebarCollapsed: false,
  propertiesCollapsed: false,
  contextMenu: null, // { x, y, nodeId? }
  showProjectManager: false,
  showSettings: false,
  showConsole: false,
  notification: null, // { message, type: 'success'|'error'|'info' }
  botRunning: false,
  botLogs: [],

  setSelectedNode: (nodeId) => set({ selectedNodeId: nodeId }),
  setActivePanel: (panel) => set({ activePanel: panel }),
  setRightPanel: (panel) => set({ rightPanel: panel }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  toggleSidebar: () => set((s) => ({ sidebarCollapsed: !s.sidebarCollapsed })),
  toggleProperties: () => set((s) => ({ propertiesCollapsed: !s.propertiesCollapsed })),
  setContextMenu: (menu) => set({ contextMenu: menu }),
  setShowProjectManager: (show) => set({ showProjectManager: show }),
  setShowSettings: (show) => set({ showSettings: show }),
  setShowConsole: (show) => set({ showConsole: show }),
  setBotRunning: (running) => set({ botRunning: running }),
  addBotLog: (log) => set((s) => ({ botLogs: [...s.botLogs, { ...log, timestamp: Date.now() }].slice(-500) })),
  clearBotLogs: () => set({ botLogs: [] }),

  showNotification: (message, type = 'info') => {
    set({ notification: { message, type } });
    setTimeout(() => set({ notification: null }), 3000);
  },
}));

export default useUIStore;
