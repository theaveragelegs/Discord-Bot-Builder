import React, { memo, useState } from 'react';
import { Handle, Position } from '@xyflow/react';
import { HelpCircle, Copy, CheckCircle2 } from 'lucide-react';
import useUIStore from '../../store/uiStore';

// ─── PORT TYPE COLORS ────────────────────────────
export const PORT_COLORS = {
  action:      '#57f287',  // green — flow control
  text:        '#9b59b6',  // purple — strings
  user:        '#3498db',  // blue
  member:      '#f1c40f',  // yellow
  channel:     '#e67e22',  // orange
  server:      '#e74c3c',  // red
  message:     '#1abc9c',  // teal
  number:      '#ecf0f1',  // white
  boolean:     '#e91e63',  // pink
  interaction: '#5865f2',  // blurple
  role:        '#2ecc71',  // emerald
  any:         '#99aab5',  // grey — accepts anything
  embed:       '#ff6b6b',  // coral — embed objects
  component:   '#a29bfe',  // lavender — message components
};

const CATEGORY_COLORS = {
  event:    '#5865f2',
  action:   '#57f287',
  logic:    '#fee75c',
  variable: '#ed4245',
  discord:  '#eb459e',
  utility:  '#99aab5',
};

function getPortColor(dataType) {
  return PORT_COLORS[dataType] || PORT_COLORS.any;
}

// Header height + body padding top
const HEADER_HEIGHT = 34;
const PORT_START_Y = HEADER_HEIGHT + 14;
const PORT_SPACING = 22;

const BaseNode = memo(({ id, data, selected, type }) => {
  const setSelectedNode = useUIStore((s) => s.setSelectedNode);
  const category = data.category || 'utility';
  const color = CATEGORY_COLORS[category] || '#99aab5';
  const isValid = data.validation !== false;
  const Icon = data.icon;
  const [copied, setCopied] = useState(false);

  const handleCopyId = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const inputs = data.inputs || [];
  const outputs = data.outputs || [];
  const maxPorts = Math.max(inputs.length, outputs.length, 1);
  const bodyHeight = maxPorts * PORT_SPACING + 24;

  return (
    <div
      className={`bot-node ${selected ? 'selected' : ''} ${!isValid ? 'bot-node-validation-error' : ''}`}
      onClick={() => setSelectedNode(id)}
      style={selected ? { borderColor: color, boxShadow: `0 0 0 3px ${color}33, 0 8px 32px rgba(0,0,0,0.4)` } : {}}
    >
      {/* HANDLES — positioned absolutely relative to the node */}
      {inputs.map((input, i) => (
        <Handle
          key={`in-${input.id}`}
          type="target"
          position={Position.Left}
          id={input.id}
          style={{
            top: PORT_START_Y + i * PORT_SPACING,
            background: getPortColor(input.dataType),
            border: `2px solid ${getPortColor(input.dataType)}44`,
          }}
        />
      ))}
      {outputs.map((output, i) => (
        <Handle
          key={`out-${output.id}`}
          type="source"
          position={Position.Right}
          id={output.id}
          style={{
            top: PORT_START_Y + i * PORT_SPACING,
            background: getPortColor(output.dataType),
            border: `2px solid ${getPortColor(output.dataType)}44`,
          }}
        />
      ))}

      {/* Header */}
      <div className="bot-node-header" style={{ background: color }}>
        <div className="icon">
          {Icon && <Icon size={14} />}
        </div>
        <span style={{ flex: 1 }}>{data.label || type}</span>
        {data.tooltip && (
          <div className="icon" title={data.tooltip} style={{ opacity: 0.7, cursor: 'help' }}>
            <HelpCircle size={12} />
          </div>
        )}
      </div>

      {/* Body */}
      <div className="bot-node-body" style={{ minHeight: bodyHeight }}>
        {/* Left port labels */}
        <div className="port-labels port-labels-left">
          {inputs.map((input, i) => (
            <div
              key={`lbl-in-${input.id}`}
              className="port-label-row"
              style={{ top: i * PORT_SPACING }}
            >
              <span className="port-dot" style={{ background: getPortColor(input.dataType) }} />
              <span className="port-label-text" style={{ color: getPortColor(input.dataType) }}>
                {input.label}
              </span>
            </div>
          ))}
        </div>

        {/* Center */}
        <div className="node-center-content">
          {data.description && (
            <div className="description">{data.description}</div>
          )}
          {data.preview && (
            <div style={{ marginTop: 4, fontSize: 10, color: 'var(--discord-text-muted)', fontFamily: 'monospace' }}>
              {data.preview}
            </div>
          )}
          <div
            className="node-id-badge"
            onClick={handleCopyId}
            title="Click to copy Block ID"
          >
            {copied ? <CheckCircle2 size={9} /> : <Copy size={9} />}
            {copied ? 'Copied!' : id}
          </div>
        </div>

        {/* Right port labels */}
        <div className="port-labels port-labels-right">
          {outputs.map((output, i) => (
            <div
              key={`lbl-out-${output.id}`}
              className="port-label-row"
              style={{ top: i * PORT_SPACING }}
            >
              <span className="port-label-text" style={{ color: getPortColor(output.dataType) }}>
                {output.label}
              </span>
              <span className="port-dot" style={{ background: getPortColor(output.dataType) }} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
});

BaseNode.displayName = 'BaseNode';
export default BaseNode;
export { CATEGORY_COLORS };
