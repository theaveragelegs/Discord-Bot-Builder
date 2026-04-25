import React from 'react';
import { Plus, Trash2, Copy, Download, Upload, X, Clock } from 'lucide-react';
import useProjectStore from '../../store/projectStore';
import useFlowStore from '../../store/flowStore';
import useUIStore from '../../store/uiStore';

export default function ProjectManager() {
  const projects = useProjectStore((s) => s.projects);
  const currentProject = useProjectStore((s) => s.currentProject);
  const fetchProjects = useProjectStore((s) => s.fetchProjects);
  const createProject = useProjectStore((s) => s.createProject);
  const loadProject = useProjectStore((s) => s.loadProject);
  const deleteProject = useProjectStore((s) => s.deleteProject);
  const duplicateProject = useProjectStore((s) => s.duplicateProject);
  const importProject = useProjectStore((s) => s.importProject);
  const exportProjectJSON = useProjectStore((s) => s.exportProjectJSON);

  const loadFlow = useFlowStore((s) => s.loadFlow);
  const setShowProjectManager = useUIStore((s) => s.setShowProjectManager);
  const showNotification = useUIStore((s) => s.showNotification);

  const handleNew = () => {
    const project = createProject();
    if (project) {
      loadFlow(project.nodes || [], project.edges || []);
      showNotification('New project created!', 'success');
    }
  };

  const handleLoad = (id) => {
    const project = loadProject(id);
    if (project) {
      loadFlow(project.nodes || [], project.edges || []);
      setShowProjectManager(false);
      showNotification(`Loaded "${project.name}"`, 'success');
    }
  };

  const handleDelete = (id, name) => {
    if (confirm(`Delete "${name}"? This cannot be undone.`)) {
      deleteProject(id);
      showNotification('Project deleted', 'info');
    }
  };

  const handleDuplicate = (id) => {
    const project = duplicateProject(id);
    if (project) showNotification('Project duplicated!', 'success');
  };

  const handleExport = (id) => {
    const data = exportProjectJSON(id);
    if (!data) return;
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${(data.name || 'bot').replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    showNotification('Project exported!', 'success');
  };

  const handleImport = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json,.bot';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const text = await file.text();
        importProject(text);
        showNotification('Project imported!', 'success');
      } catch {
        showNotification('Failed to import project', 'error');
      }
    };
    input.click();
  };

  return (
    <div className="modal-overlay" onClick={() => setShowProjectManager(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ width: 520 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 className="modal-title" style={{ margin: 0 }}>Projects</h2>
          <button className="btn btn-ghost btn-icon" onClick={() => setShowProjectManager(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Action buttons */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          <button className="btn btn-primary btn-sm" onClick={handleNew}>
            <Plus size={14} /> New Bot
          </button>
          <button className="btn btn-secondary btn-sm" onClick={handleImport}>
            <Upload size={14} /> Import
          </button>
        </div>

        {/* Project list */}
        <div style={{ maxHeight: 400, overflowY: 'auto' }}>
          {projects.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 40, color: 'var(--discord-text-muted)' }}>
              No projects yet. Create one to get started!
            </div>
          ) : (
            projects.map((project) => (
              <div
                key={project.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 12px',
                  borderRadius: 8,
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                  background: currentProject?.id === project.id ? 'var(--discord-bg-modifier-selected)' : 'transparent',
                }}
                onClick={() => handleLoad(project.id)}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--discord-bg-modifier-hover)'}
                onMouseLeave={(e) => e.currentTarget.style.background = currentProject?.id === project.id ? 'var(--discord-bg-modifier-selected)' : 'transparent'}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--discord-header-primary)' }}>
                    {project.name}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--discord-text-muted)', display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <Clock size={10} />
                    {new Date(project.updated_at).toLocaleDateString()}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: 4 }} onClick={(e) => e.stopPropagation()}>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleDuplicate(project.id)} title="Duplicate">
                    <Copy size={13} />
                  </button>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleExport(project.id)} title="Export .json">
                    <Download size={13} />
                  </button>
                  <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleDelete(project.id, project.name)} title="Delete" style={{ color: 'var(--discord-red)' }}>
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
