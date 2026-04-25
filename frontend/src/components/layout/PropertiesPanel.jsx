import React, { useState, useEffect } from 'react';
import { X, Code, Settings2 } from 'lucide-react';
import useFlowStore from '../../store/flowStore';
import useUIStore from '../../store/uiStore';
import useProjectStore from '../../store/projectStore';
import NodeSettings from '../shared/NodeSettings';
import { NODE_DEFINITIONS } from '../../nodes/index';

export default function PropertiesPanel() {
  const selectedNodeId = useUIStore((s) => s.selectedNodeId);
  const rightPanel = useUIStore((s) => s.rightPanel);
  const setRightPanel = useUIStore((s) => s.setRightPanel);
  const propertiesCollapsed = useUIStore((s) => s.propertiesCollapsed);

  const node = useFlowStore((s) => s.nodes.find((n) => n.id === selectedNodeId));
  const nodes = useFlowStore((s) => s.nodes);
  const edges = useFlowStore((s) => s.edges);
  const currentProject = useProjectStore((s) => s.currentProject);
  const settings = useProjectStore((s) => s.settings);

  const [codePreview, setCodePreview] = useState('');

  // Fetch code preview from backend (still needs code generator)
  useEffect(() => {
    if (rightPanel !== 'code' || !currentProject) return;
    const fetchCode = async () => {
      try {
        const res = await fetch('/api/export/preview', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nodes,
            edges,
            settings,
          }),
        });
        const data = await res.json();
        setCodePreview(data.code?.indexJs || '// No code generated yet.\n// Add some event nodes and connect actions!');
      } catch {
        setCodePreview('// Error fetching code preview');
      }
    };
    fetchCode();
  }, [rightPanel, currentProject, nodes, edges]);

  if (propertiesCollapsed) return null;

  const categoryColors = {
    event: '#5865f2', action: '#57f287', logic: '#fee75c',
    variable: '#ed4245', discord: '#eb459e', utility: '#99aab5',
  };

  return (
    <aside
      className="glass-panel"
      style={{
        width: 'var(--properties-width)',
        borderLeft: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* Tab bar */}
      <div className="tab-bar-header">
        <button
          className={`tab ${rightPanel === 'properties' ? 'active' : ''}`}
          onClick={() => setRightPanel('properties')}
        >
          <Settings2 size={14} />
          Properties
        </button>
        <button
          className={`tab ${rightPanel === 'code' ? 'active' : ''}`}
          onClick={() => setRightPanel('code')}
        >
          <Code size={14} />
          Code
        </button>
      </div>

      {/* Properties panel */}
      {rightPanel === 'properties' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
          {node ? (
            <div className="animate-fade-in">
              {/* Node header info */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <div
                    style={{
                      width: 10, height: 10, borderRadius: '50%',
                      background: categoryColors[node.data?.category || NODE_DEFINITIONS[node.type]?.category] || '#99aab5',
                    }}
                  />
                  <span style={{ fontWeight: 600, fontSize: 14, color: 'var(--discord-header-primary)' }}>
                    {NODE_DEFINITIONS[node.type]?.label || node.type}
                  </span>
                </div>
                <span
                  className="badge"
                  style={{
                    background: `${categoryColors[NODE_DEFINITIONS[node.type]?.category] || '#99aab5'}22`,
                    color: categoryColors[NODE_DEFINITIONS[node.type]?.category] || '#99aab5',
                  }}
                >
                  {NODE_DEFINITIONS[node.type]?.category || 'unknown'}
                </span>
                {NODE_DEFINITIONS[node.type]?.tooltip && (
                  <p style={{ fontSize: 12, color: 'var(--discord-text-muted)', marginTop: 8, lineHeight: 1.5 }}>
                    {NODE_DEFINITIONS[node.type].tooltip}
                  </p>
                )}
              </div>

              {/* Settings */}
              <div className="panel-section-title">Settings</div>
              <NodeSettings nodeId={selectedNodeId} />

              {/* Node ID (debug) */}
              <div style={{ marginTop: 16, fontSize: 10, color: 'var(--discord-text-muted)' }}>
                ID: {node.id}
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: 'var(--discord-text-muted)' }}>
              <Settings2 size={32} style={{ opacity: 0.3, margin: '0 auto 12px' }} />
              <div style={{ fontSize: 13, fontWeight: 500 }}>No node selected</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Click a node to view its properties</div>
            </div>
          )}
        </div>
      )}

      {/* Code preview panel */}
      {rightPanel === 'code' && (
        <div style={{ flex: 1, overflowY: 'auto', padding: 12 }}>
          <div className="panel-section-title" style={{ marginBottom: 8 }}>Generated Code Preview</div>
          <pre className="code-preview" style={{ fontSize: 11, lineHeight: 1.5 }}>
            {codePreview || '// Save your project to see generated code.\n// Connect event nodes to action nodes to build your bot.'}
          </pre>
        </div>
      )}
    </aside>
  );
}
