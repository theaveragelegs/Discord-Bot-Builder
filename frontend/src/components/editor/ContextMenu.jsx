import React, { useEffect, useRef } from 'react';
import { Copy, Trash2, Files, Clipboard } from 'lucide-react';
import useFlowStore from '../../store/flowStore';
import useUIStore from '../../store/uiStore';

export default function ContextMenu({ x, y, nodeId, onClose }) {
  const ref = useRef(null);
  const removeNode = useFlowStore((s) => s.removeNode);
  const nodes = useFlowStore((s) => s.nodes);
  const addNode = useFlowStore((s) => s.addNode);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [onClose]);

  const handleDelete = () => {
    if (nodeId) removeNode(nodeId);
    onClose();
  };

  const handleDuplicate = () => {
    if (!nodeId) return;
    const sourceNode = nodes.find((n) => n.id === nodeId);
    if (!sourceNode) return;
    const newNode = {
      id: `${sourceNode.type}_${Date.now()}`,
      type: sourceNode.type,
      position: { x: sourceNode.position.x + 30, y: sourceNode.position.y + 30 },
      data: { ...sourceNode.data },
    };
    addNode(newNode);
    onClose();
  };

  return (
    <div ref={ref} className="context-menu" style={{ left: x, top: y }}>
      {nodeId && (
        <>
          <div className="context-menu-item" onClick={handleDuplicate}>
            <Copy size={14} />
            Duplicate
          </div>
          <div className="context-menu-item" onClick={handleDelete} style={{ color: '#ed4245' }}>
            <Trash2 size={14} />
            Delete
          </div>
        </>
      )}
      {!nodeId && (
        <>
          <div className="context-menu-item" onClick={onClose}>
            <Clipboard size={14} />
            Paste
          </div>
          <div className="context-menu-item" onClick={onClose}>
            <Files size={14} />
            Select All
          </div>
        </>
      )}
    </div>
  );
}
