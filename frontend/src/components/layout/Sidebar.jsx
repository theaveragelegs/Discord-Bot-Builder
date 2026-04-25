import React from 'react';
import { Puzzle, Code } from 'lucide-react';
import NodePalette from '../editor/NodePalette';
import useUIStore from '../../store/uiStore';

export default function Sidebar() {
  const activePanel = useUIStore((s) => s.activePanel);
  const setActivePanel = useUIStore((s) => s.setActivePanel);
  const sidebarCollapsed = useUIStore((s) => s.sidebarCollapsed);

  if (sidebarCollapsed) return null;

  return (
    <aside
      className="glass-panel"
      style={{
        width: 'var(--sidebar-width)',
        borderRight: '1px solid rgba(255, 255, 255, 0.06)',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0,
        overflow: 'hidden',
      }}
    >
      {/* Tab bar */}
      <div
        style={{
          display: 'flex',
          borderBottom: '1px solid rgba(255, 255, 255, 0.06)',
          padding: '8px 8px 0',
        }}
      >
        <button
          className={`tab ${activePanel === 'palette' ? 'active' : ''}`}
          onClick={() => setActivePanel('palette')}
          style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
        >
          <Puzzle size={13} />
          Nodes
        </button>
      </div>

      {/* Panel content */}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        {activePanel === 'palette' && <NodePalette />}
      </div>
    </aside>
  );
}
