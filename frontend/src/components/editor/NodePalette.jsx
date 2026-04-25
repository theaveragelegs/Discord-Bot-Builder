import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronRight } from 'lucide-react';
import { PALETTE_CATEGORIES, TOTAL_NODE_COUNT } from '../../nodes/index';
import useUIStore from '../../store/uiStore';

export default function NodePalette() {
  const searchQuery = useUIStore((s) => s.searchQuery);
  const setSearchQuery = useUIStore((s) => s.setSearchQuery);
  const [expandedCategories, setExpandedCategories] = useState(
    PALETTE_CATEGORIES.reduce((acc, cat) => ({ ...acc, [cat.name]: true }), {})
  );

  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return PALETTE_CATEGORIES;
    const q = searchQuery.toLowerCase();
    return PALETTE_CATEGORIES.map((cat) => ({
      ...cat,
      nodes: cat.nodes.filter(
        (n) =>
          n.label.toLowerCase().includes(q) ||
          n.description?.toLowerCase().includes(q) ||
          n.type.toLowerCase().includes(q)
      ),
    })).filter((cat) => cat.nodes.length > 0);
  }, [searchQuery]);

  const toggleCategory = (name) => {
    setExpandedCategories((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const onDragStart = (event, nodeType, label) => {
    event.dataTransfer.setData('application/reactflow/type', nodeType);
    event.dataTransfer.setData('application/reactflow/label', label);
    event.dataTransfer.effectAllowed = 'move';
  };

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Search */}
      <div style={{ padding: '12px 12px 8px' }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={14}
            style={{
              position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)',
              color: 'var(--discord-text-muted)',
            }}
          />
          <input
            type="text"
            className="input-field"
            placeholder={`Search ${TOTAL_NODE_COUNT} nodes...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: 32, fontSize: 12 }}
          />
        </div>
      </div>

      {/* Categories */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '0 4px 12px' }}>
        {filteredCategories.map((category) => (
          <div key={category.name} style={{ marginBottom: 4 }}>
            {/* Category header */}
            <button
              onClick={() => toggleCategory(category.name)}
              style={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '8px 10px',
                background: 'none',
                border: 'none',
                color: 'var(--discord-header-secondary)',
                fontSize: 11,
                fontWeight: 700,
                textTransform: 'uppercase',
                letterSpacing: '0.5px',
                cursor: 'pointer',
                fontFamily: 'inherit',
                borderRadius: 4,
              }}
            >
              {expandedCategories[category.name] ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              <span style={{ display: 'inline-block', width: 8, height: 8, borderRadius: '50%', background: category.color }} />
              {category.name}
              <span style={{ marginLeft: 'auto', fontSize: 10, opacity: 0.6 }}>
                {category.nodes.length}
              </span>
            </button>

            {/* Node list */}
            {expandedCategories[category.name] && (
              <div className="animate-fade-in" style={{ padding: '0 4px' }}>
                {category.nodes.map((node) => {
                  const Icon = node.icon;
                  return (
                    <div
                      key={node.type}
                      className="palette-item"
                      draggable
                      onDragStart={(e) => onDragStart(e, node.type, node.label)}
                      title={node.tooltip || node.description}
                    >
                      <div
                        className="dot"
                        style={{ background: category.color, width: 6, height: 6 }}
                      />
                      {Icon && (
                        <Icon size={14} style={{ color: category.color, flexShrink: 0 }} />
                      )}
                      <div style={{ minWidth: 0 }}>
                        <div className="name" style={{ fontSize: 12 }}>{node.label}</div>
                        <div style={{ fontSize: 10, color: 'var(--discord-text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {node.description}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
