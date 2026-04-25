import React, { useEffect, useCallback } from 'react';
import { ReactFlowProvider } from '@xyflow/react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import PropertiesPanel from './components/layout/PropertiesPanel';
import FlowEditor from './components/editor/FlowEditor';
import ProjectManager from './components/panels/ProjectManager';
import SettingsPanel from './components/panels/SettingsPanel';
import BotConsole from './components/panels/BotConsole';
import useProjectStore from './store/projectStore';
import useFlowStore from './store/flowStore';
import useUIStore from './store/uiStore';

function Notification() {
  const notification = useUIStore((s) => s.notification);
  if (!notification) return null;

  const colors = {
    success: '#57f287',
    error: '#ed4245',
    info: '#5865f2',
  };

  return (
    <div
      className="animate-fade-in"
      style={{
        position: 'fixed',
        bottom: 20,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--discord-bg-floating)',
        color: 'var(--discord-text-normal)',
        padding: '10px 20px',
        borderRadius: 8,
        fontSize: 13,
        fontWeight: 500,
        boxShadow: '0 8px 32px rgba(0,0,0,0.5)',
        zIndex: 9999,
        borderLeft: `4px solid ${colors[notification.type] || colors.info}`,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
      }}
    >
      <div
        style={{
          width: 8, height: 8, borderRadius: '50%',
          background: colors[notification.type] || colors.info,
        }}
      />
      {notification.message}
    </div>
  );
}

export default function App() {
  const fetchProjects = useProjectStore((s) => s.fetchProjects);
  const loadProject = useProjectStore((s) => s.loadProject);
  const createProject = useProjectStore((s) => s.createProject);
  const currentProject = useProjectStore((s) => s.currentProject);
  const saveProject = useProjectStore((s) => s.saveProject);
  const projects = useProjectStore((s) => s.projects);

  const loadFlow = useFlowStore((s) => s.loadFlow);
  const getFlowData = useFlowStore((s) => s.getFlowData);
  const undo = useFlowStore((s) => s.undo);
  const redo = useFlowStore((s) => s.redo);

  const showProjectManager = useUIStore((s) => s.showProjectManager);
  const showSettings = useUIStore((s) => s.showSettings);
  const showConsole = useUIStore((s) => s.showConsole);
  const showNotification = useUIStore((s) => s.showNotification);

  // Initial load — from localStorage, no API calls
  useEffect(() => {
    const allProjects = fetchProjects();
    if (allProjects && allProjects.length > 0) {
      const project = loadProject(allProjects[0].id);
      if (project) loadFlow(project.nodes || [], project.edges || []);
    } else {
      const project = createProject('My First Bot');
      if (project) loadFlow([], []);
    }
  }, []);

  // Auto-save every 30 seconds
  useEffect(() => {
    if (!currentProject) return;
    const interval = setInterval(() => {
      const flowData = getFlowData();
      saveProject(flowData);
    }, 30000);
    return () => clearInterval(interval);
  }, [currentProject]);

  // Keyboard shortcuts
  const handleKeyDown = useCallback((e) => {
    // Ctrl+S — Save
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      const flowData = getFlowData();
      saveProject(flowData);
      showNotification('Project saved!', 'success');
    }
    // Ctrl+Z — Undo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
      e.preventDefault();
      undo();
    }
    // Ctrl+Shift+Z — Redo
    if ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) {
      e.preventDefault();
      redo();
    }
  }, [getFlowData, saveProject, undo, redo, showNotification]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <ReactFlowProvider>
      <div
        style={{
          height: '100vh',
          width: '100vw',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        <Header />

        <div style={{ flex: 1, display: 'flex', overflow: 'hidden' }}>
          <Sidebar />

          {/* Main editor area */}
          <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
            <FlowEditor />
          </div>

          <PropertiesPanel />
        </div>

        {/* Modals */}
        {showProjectManager && <ProjectManager />}
        {showSettings && <SettingsPanel />}
        {showConsole && <BotConsole />}

        {/* Notification toast */}
        <Notification />
      </div>
    </ReactFlowProvider>
  );
}
