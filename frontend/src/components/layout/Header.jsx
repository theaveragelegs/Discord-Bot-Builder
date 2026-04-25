import React, { useState } from 'react';
import {
  Save, Undo2, Redo2, Download, Play, Square, Settings, FolderOpen,
  Terminal, Bot, ChevronDown,
} from 'lucide-react';
import useFlowStore from '../../store/flowStore';
import useProjectStore from '../../store/projectStore';
import useUIStore from '../../store/uiStore';

export default function Header() {
  const undo = useFlowStore((s) => s.undo);
  const redo = useFlowStore((s) => s.redo);
  const history = useFlowStore((s) => s.history);
  const future = useFlowStore((s) => s.future);
  const getFlowData = useFlowStore((s) => s.getFlowData);

  const currentProject = useProjectStore((s) => s.currentProject);
  const saveProject = useProjectStore((s) => s.saveProject);
  const updateProjectName = useProjectStore((s) => s.updateProjectName);
  const lastSaved = useProjectStore((s) => s.lastSaved);
  const settings = useProjectStore((s) => s.settings);

  const setShowProjectManager = useUIStore((s) => s.setShowProjectManager);
  const setShowSettings = useUIStore((s) => s.setShowSettings);
  const setShowConsole = useUIStore((s) => s.setShowConsole);
  const showNotification = useUIStore((s) => s.showNotification);
  const botRunning = useUIStore((s) => s.botRunning);

  const [editingName, setEditingName] = useState(false);
  const [nameValue, setNameValue] = useState('');

  const handleSave = () => {
    const flowData = getFlowData();
    saveProject(flowData);
    showNotification('Project saved!', 'success');
  };

  const handleExport = async () => {
    if (!currentProject) return;
    try {
      // Send project data to backend for code generation + ZIP
      const flowData = getFlowData();
      const res = await fetch('/api/export/zip', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: currentProject.name,
          description: currentProject.description,
          nodes: flowData.nodes,
          edges: flowData.edges,
          settings: settings,
        }),
      });
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${(currentProject.name || 'my-bot').replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase()}.zip`;
      a.click();
      URL.revokeObjectURL(url);
      showNotification('Bot exported as ZIP!', 'success');
    } catch {
      showNotification('Failed to export bot', 'error');
    }
  };

  const handleNameEdit = () => {
    setNameValue(currentProject?.name || 'Untitled Bot');
    setEditingName(true);
  };

  const handleNameSave = () => {
    if (nameValue.trim()) {
      updateProjectName(nameValue.trim());
    }
    setEditingName(false);
  };

  return (
    <header
      className="glass-panel"
      style={{
        height: 'var(--header-height)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        alignItems: 'center',
        padding: '0 12px',
        gap: 8,
        zIndex: 100,
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8 }}>
        <Bot size={22} style={{ color: 'var(--discord-blurple)' }} />
        <span style={{ fontWeight: 700, fontSize: 14, color: 'var(--discord-header-primary)', letterSpacing: '-0.3px' }}>
          Bot Builder
        </span>
      </div>

      {/* Divider */}
      <div style={{ width: 1, height: 24, background: 'rgba(255,255,255,0.06)', margin: '0 4px' }} />

      {/* Project name */}
      <button
        className="btn-ghost"
        onClick={() => setShowProjectManager(true)}
        style={{ display: 'flex', alignItems: 'center', gap: 4 }}
      >
        <FolderOpen size={14} />
        Projects
      </button>

      {editingName ? (
        <input
          type="text"
          className="input-field"
          value={nameValue}
          onChange={(e) => setNameValue(e.target.value)}
          onBlur={handleNameSave}
          onKeyDown={(e) => e.key === 'Enter' && handleNameSave()}
          autoFocus
          style={{ width: 200, height: 28, fontSize: 13 }}
        />
      ) : (
        <span
          onClick={handleNameEdit}
          style={{
            fontSize: 13, fontWeight: 600, color: 'var(--discord-header-primary)',
            cursor: 'pointer', padding: '4px 8px', borderRadius: 4,
          }}
          title="Click to rename"
        >
          {currentProject?.name || 'No project loaded'}
        </span>
      )}

      {lastSaved && (
        <span style={{ fontSize: 10, color: 'var(--discord-text-muted)' }}>
          Saved {new Date(lastSaved).toLocaleTimeString()}
        </span>
      )}

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Actions */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button className="btn btn-ghost btn-icon" onClick={undo} disabled={history.length === 0} title="Undo (Ctrl+Z)">
          <Undo2 size={16} style={{ opacity: history.length ? 1 : 0.3 }} />
        </button>
        <button className="btn btn-ghost btn-icon" onClick={redo} disabled={future.length === 0} title="Redo (Ctrl+Shift+Z)">
          <Redo2 size={16} style={{ opacity: future.length ? 1 : 0.3 }} />
        </button>

        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.06)', margin: '0 4px' }} />

        <button className="btn btn-ghost btn-icon" onClick={handleSave} title="Save (Ctrl+S)">
          <Save size={16} />
        </button>
        <button className="btn btn-ghost btn-icon" onClick={handleExport} title="Export as ZIP">
          <Download size={16} />
        </button>

        <div style={{ width: 1, height: 20, background: 'rgba(255,255,255,0.06)', margin: '0 4px' }} />

        <button className="btn btn-ghost btn-icon" onClick={() => setShowConsole(true)} title="Bot Console">
          <Terminal size={16} />
          {botRunning && <div className="status-dot online" style={{ position: 'absolute', top: 2, right: 2, width: 6, height: 6 }} />}
        </button>
        <button className="btn btn-ghost btn-icon" onClick={() => setShowSettings(true)} title="Settings">
          <Settings size={16} />
        </button>
      </div>
    </header>
  );
}
