import React, { useState } from 'react';
import { Plus, Trash2, ChevronDown, ChevronRight, GripVertical } from 'lucide-react';
import useFlowStore from '../../store/flowStore';
import useUIStore from '../../store/uiStore';
import { NODE_DEFINITIONS } from '../../nodes/index';

// ─── SLASH COMMAND OPTION TYPES ──────────────────
const OPTION_TYPES = [
  { value: 1, label: 'Sub Command' },
  { value: 2, label: 'Sub Command Group' },
  { value: 3, label: 'String' },
  { value: 4, label: 'Integer' },
  { value: 5, label: 'Boolean' },
  { value: 6, label: 'User' },
  { value: 7, label: 'Channel' },
  { value: 8, label: 'Role' },
  { value: 9, label: 'Mentionable' },
  { value: 10, label: 'Number' },
  { value: 11, label: 'Attachment' },
];

// ─── BUTTONS BUILDER ────────────────────────────
function ButtonsBuilder({ value, onChange }) {
  const buttons = Array.isArray(value) ? value : [{ customId: 'btn_1', label: 'Click Me', style: 'Primary' }];

  const updateButton = (idx, field, val) => {
    const updated = [...buttons];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange(updated);
  };

  const addButton = () => {
    if (buttons.length >= 25) return;
    onChange([...buttons, { customId: `btn_${buttons.length + 1}`, label: 'New Button', style: 'Primary' }]);
  };

  const removeButton = (idx) => {
    if (buttons.length <= 1) return;
    onChange(buttons.filter((_, i) => i !== idx));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {buttons.map((btn, idx) => (
        <div key={idx} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: 10, border: '1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--discord-header-secondary)' }}>Button {idx + 1}</span>
            {buttons.length > 1 && (
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => removeButton(idx)} style={{ color: 'var(--discord-red)' }}>
                <Trash2 size={12} />
              </button>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <input type="text" className="input-field nodrag" value={btn.customId || ''} onChange={(e) => updateButton(idx, 'customId', e.target.value)} placeholder="Custom ID" style={{ fontSize: 12 }} />
            <input type="text" className="input-field nodrag" value={btn.label || ''} onChange={(e) => updateButton(idx, 'label', e.target.value)} placeholder="Label" style={{ fontSize: 12 }} />
            <select className="select-field nodrag" value={btn.style || 'Primary'} onChange={(e) => updateButton(idx, 'style', e.target.value)} style={{ fontSize: 12 }}>
              <option value="Primary">Primary (Blurple)</option>
              <option value="Secondary">Secondary (Grey)</option>
              <option value="Success">Success (Green)</option>
              <option value="Danger">Danger (Red)</option>
              <option value="Link">Link (URL)</option>
            </select>
            {btn.style === 'Link' ? (
              <input type="text" className="input-field nodrag" value={btn.url || ''} onChange={(e) => updateButton(idx, 'url', e.target.value)} placeholder="URL https://..." style={{ fontSize: 12 }} />
            ) : (
              <input type="text" className="input-field nodrag" value={btn.emoji || ''} onChange={(e) => updateButton(idx, 'emoji', e.target.value)} placeholder="Emoji (Optional)" style={{ fontSize: 12 }} />
            )}
          </div>
        </div>
      ))}
      {buttons.length < 25 && (
        <button className="btn btn-secondary btn-sm" onClick={addButton} style={{ alignSelf: 'flex-start' }}>
          <Plus size={12} /> Add Button ({buttons.length}/25)
        </button>
      )}
    </div>
  );
}

// ─── MODAL INPUTS BUILDER ────────────────────────
function ModalInputsBuilder({ value, onChange }) {
  const inputs = Array.isArray(value) ? value : [{ customId: 'input_1', label: 'Enter text', type: 'TextInput', style: 'Short', placeholder: '', required: true }];

  const updateInput = (idx, field, val) => {
    const updated = [...inputs];
    updated[idx] = { ...updated[idx], [field]: val };
    onChange(updated);
  };

  const addInput = () => {
    if (inputs.length >= 5) return;
    onChange([...inputs, {
      customId: `input_${inputs.length + 1}`,
      label: '',
      type: 'TextInput',
      style: 'Short',
      placeholder: '',
      required: false,
    }]);
  };

  const removeInput = (idx) => {
    if (inputs.length <= 1) return;
    onChange(inputs.filter((_, i) => i !== idx));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {inputs.map((input, idx) => (
        <div key={idx} style={{
          background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: 10,
          border: '1px solid rgba(255,255,255,0.06)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--discord-header-secondary)' }}>
              Component {idx + 1}
            </span>
            {inputs.length > 1 && (
              <button
                className="btn btn-ghost btn-icon btn-sm"
                onClick={() => removeInput(idx)}
                style={{ color: 'var(--discord-red)' }}
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            <select
              className="select-field nodrag"
              value={input.type || 'TextInput'}
              onChange={(e) => updateInput(idx, 'type', e.target.value)}
              style={{ fontSize: 12 }}
            >
              <option value="TextInput">Text Input</option>
              <option value="StringSelect">String Select Menu</option>
              <option value="UserSelect">User Select Menu</option>
              <option value="RoleSelect">Role Select Menu</option>
              <option value="MentionableSelect">Mentionable Select Menu</option>
              <option value="ChannelSelect">Channel Select Menu</option>
            </select>
            <input
              type="text"
              className="input-field nodrag"
              value={input.customId || ''}
              onChange={(e) => updateInput(idx, 'customId', e.target.value)}
              placeholder="Custom ID (e.g. input_1)"
              style={{ fontSize: 12 }}
            />
            {(!input.type || input.type === 'TextInput') && (
              <input
                type="text"
                className="input-field nodrag"
                value={input.label || ''}
                onChange={(e) => updateInput(idx, 'label', e.target.value)}
                placeholder="Label (e.g. Enter your name)"
                style={{ fontSize: 12 }}
              />
            )}
            
            <div style={{ display: 'flex', gap: 6 }}>
              {(!input.type || input.type === 'TextInput') && (
                <select
                  className="select-field nodrag"
                  value={input.style || 'Short'}
                  onChange={(e) => updateInput(idx, 'style', e.target.value)}
                  style={{ fontSize: 12, flex: 1 }}
                >
                  <option value="Short">Short (single line)</option>
                  <option value="Paragraph">Paragraph (multi-line)</option>
                </select>
              )}
              {input.type && input.type !== 'TextInput' && (
                <input
                  type="text"
                  className="input-field nodrag"
                  value={input.placeholder || ''}
                  onChange={(e) => updateInput(idx, 'placeholder', e.target.value)}
                  placeholder="Placeholder text (optional)"
                  style={{ fontSize: 12, flex: 1 }}
                />
              )}
              {(!input.type || input.type === 'TextInput') && (
                <label style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--discord-text-muted)', whiteSpace: 'nowrap' }}>
                  <input
                    type="checkbox"
                    checked={input.required !== false}
                    onChange={(e) => updateInput(idx, 'required', e.target.checked)}
                    style={{ accentColor: 'var(--discord-blurple)' }}
                  />
                  Req
                </label>
              )}
            </div>

            {(!input.type || input.type === 'TextInput') && (
              <input
                type="text"
                className="input-field nodrag"
                value={input.placeholder || ''}
                onChange={(e) => updateInput(idx, 'placeholder', e.target.value)}
                placeholder="Placeholder text (optional)"
                style={{ fontSize: 12 }}
              />
            )}

            {input.type === 'StringSelect' && (
              <input
                type="text"
                className="input-field nodrag"
                value={input.optionsText || ''}
                onChange={(e) => updateInput(idx, 'optionsText', e.target.value)}
                placeholder="Options (comma separated: Apple, Banana)"
                style={{ fontSize: 12 }}
              />
            )}
          </div>
        </div>
      ))}
      {inputs.length < 5 && (
        <button
          className="btn btn-secondary btn-sm"
          onClick={addInput}
          style={{ alignSelf: 'flex-start' }}
        >
          <Plus size={12} /> Add Component ({inputs.length}/5)
        </button>
      )}
    </div>
  );
}

// ─── SLASH OPTION BUILDER ───────────────────────
function SlashOptionBuilder({ option, onChange, onRemove, depth = 0 }) {
  const [expanded, setExpanded] = useState(true);
  const isSubType = option.type === 1 || option.type === 2;

  const updateField = (field, val) => {
    onChange({ ...option, [field]: val });
  };

  const addSubOption = () => {
    const subOptions = option.options || [];
    onChange({
      ...option,
      options: [...subOptions, { name: '', description: '', type: 3, required: false }],
    });
  };

  const updateSubOption = (idx, updated) => {
    const newOpts = [...(option.options || [])];
    newOpts[idx] = updated;
    onChange({ ...option, options: newOpts });
  };

  const removeSubOption = (idx) => {
    onChange({ ...option, options: (option.options || []).filter((_, i) => i !== idx) });
  };

  return (
    <div style={{
      background: depth === 0 ? 'rgba(0,0,0,0.15)' : 'rgba(0,0,0,0.1)',
      borderRadius: 6, padding: 8,
      border: '1px solid rgba(255,255,255,0.04)',
      marginLeft: depth > 0 ? 12 : 0,
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginBottom: 6 }}>
        <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setExpanded(!expanded)} style={{ padding: 2 }}>
          {expanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
        </button>
        <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--discord-text-muted)', flex: 1 }}>
          {OPTION_TYPES.find(t => t.value === option.type)?.label || 'Option'}
          {option.name ? `: ${option.name}` : ''}
        </span>
        <button className="btn btn-ghost btn-icon btn-sm" onClick={onRemove} style={{ color: 'var(--discord-red)', padding: 2 }}>
          <Trash2 size={11} />
        </button>
      </div>
      {expanded && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
          <input
            type="text"
            className="input-field nodrag"
            value={option.name || ''}
            onChange={(e) => updateField('name', e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, ''))}
            placeholder="option-name (lowercase, no spaces)"
            style={{ fontSize: 11 }}
          />
          <input
            type="text"
            className="input-field nodrag"
            value={option.description || ''}
            onChange={(e) => updateField('description', e.target.value)}
            placeholder="Description"
            style={{ fontSize: 11 }}
          />
          <div style={{ display: 'flex', gap: 5 }}>
            <select
              className="select-field nodrag"
              value={option.type || 3}
              onChange={(e) => updateField('type', parseInt(e.target.value))}
              style={{ fontSize: 11, flex: 1 }}
            >
              {(depth === 0 ? OPTION_TYPES : OPTION_TYPES.filter(t => t.value > 2)).map((t) => (
                <option key={t.value} value={t.value}>{t.label}</option>
              ))}
            </select>
            {option.type > 2 && (
              <label style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 10, color: 'var(--discord-text-muted)', whiteSpace: 'nowrap' }}>
                <input
                  type="checkbox"
                  checked={option.required || false}
                  onChange={(e) => updateField('required', e.target.checked)}
                  style={{ accentColor: 'var(--discord-blurple)' }}
                />
                Req
              </label>
            )}
          </div>
          {/* Sub-options for sub commands */}
          {isSubType && (
            <div style={{ marginTop: 4 }}>
              <div style={{ fontSize: 10, color: 'var(--discord-text-muted)', marginBottom: 4 }}>Sub-options:</div>
              {(option.options || []).map((subOpt, sIdx) => (
                <SlashOptionBuilder
                  key={sIdx}
                  option={subOpt}
                  onChange={(updated) => updateSubOption(sIdx, updated)}
                  onRemove={() => removeSubOption(sIdx)}
                  depth={depth + 1}
                />
              ))}
              <button
                className="btn btn-ghost btn-sm"
                onClick={addSubOption}
                style={{ fontSize: 10, marginTop: 4 }}
              >
                <Plus size={10} /> Add Sub-Option
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── SLASH COMMAND BUILDER ──────────────────────
function SlashCommandBuilder({ value, onChange }) {
  const commands = Array.isArray(value) ? value : [{ name: '', description: '', options: [] }];

  const updateCommand = (idx, updated) => {
    const newCmds = [...commands];
    newCmds[idx] = updated;
    onChange(newCmds);
  };

  const addCommand = () => {
    onChange([...commands, { name: '', description: '', options: [] }]);
  };

  const removeCommand = (idx) => {
    if (commands.length <= 1) return;
    onChange(commands.filter((_, i) => i !== idx));
  };

  const addOptionToCommand = (cmdIdx) => {
    const newCmds = [...commands];
    newCmds[cmdIdx] = {
      ...newCmds[cmdIdx],
      options: [...(newCmds[cmdIdx].options || []), { name: '', description: '', type: 3, required: false }],
    };
    onChange(newCmds);
  };

  const updateOption = (cmdIdx, optIdx, updated) => {
    const newCmds = [...commands];
    const newOpts = [...(newCmds[cmdIdx].options || [])];
    newOpts[optIdx] = updated;
    newCmds[cmdIdx] = { ...newCmds[cmdIdx], options: newOpts };
    onChange(newCmds);
  };

  const removeOption = (cmdIdx, optIdx) => {
    const newCmds = [...commands];
    newCmds[cmdIdx] = {
      ...newCmds[cmdIdx],
      options: (newCmds[cmdIdx].options || []).filter((_, i) => i !== optIdx),
    };
    onChange(newCmds);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {commands.map((cmd, cmdIdx) => (
        <div key={cmdIdx} style={{
          background: 'rgba(0,0,0,0.2)', borderRadius: 8, padding: 10,
          border: '1px solid rgba(88,101,242,0.2)',
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: 'var(--discord-blurple)' }}>
              /{cmd.name || 'command'} {cmdIdx + 1}
            </span>
            {commands.length > 1 && (
              <button
                className="btn btn-ghost btn-icon btn-sm"
                onClick={() => removeCommand(cmdIdx)}
                style={{ color: 'var(--discord-red)', padding: 2 }}
              >
                <Trash2 size={12} />
              </button>
            )}
          </div>

          {/* Command Name */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 5, marginBottom: 8 }}>
            <input
              type="text"
              className="input-field nodrag"
              value={cmd.name || ''}
              onChange={(e) => updateCommand(cmdIdx, { ...cmd, name: e.target.value.toLowerCase().replace(/[^a-z0-9_-]/g, '') })}
              placeholder="command-name (lowercase)"
              style={{ fontSize: 12 }}
            />
            <input
              type="text"
              className="input-field nodrag"
              value={cmd.description || ''}
              onChange={(e) => updateCommand(cmdIdx, { ...cmd, description: e.target.value })}
              placeholder="Command description"
              style={{ fontSize: 12 }}
            />
          </div>

          {/* Options */}
          <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--discord-text-muted)', marginBottom: 4, textTransform: 'uppercase' }}>
            Options / Subcommands
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {(cmd.options || []).map((opt, optIdx) => (
              <SlashOptionBuilder
                key={optIdx}
                option={opt}
                onChange={(updated) => updateOption(cmdIdx, optIdx, updated)}
                onRemove={() => removeOption(cmdIdx, optIdx)}
              />
            ))}
          </div>
          <button
            className="btn btn-ghost btn-sm"
            onClick={() => addOptionToCommand(cmdIdx)}
            style={{ fontSize: 11, marginTop: 6 }}
          >
            <Plus size={11} /> Add Option
          </button>
        </div>
      ))}

      <button
        className="btn btn-secondary btn-sm"
        onClick={addCommand}
        style={{ alignSelf: 'flex-start' }}
      >
        <Plus size={12} /> Add Command
      </button>

      {/* JSON Preview */}
      <details style={{ marginTop: 4 }}>
        <summary style={{ fontSize: 10, color: 'var(--discord-text-muted)', cursor: 'pointer' }}>
          View JSON
        </summary>
        <pre style={{
          fontSize: 10, background: 'rgba(0,0,0,0.3)', borderRadius: 6, padding: 8,
          color: 'var(--discord-text-muted)', whiteSpace: 'pre-wrap', wordBreak: 'break-all',
          maxHeight: 200, overflow: 'auto', marginTop: 4,
        }}>
          {JSON.stringify(commands, null, 2)}
        </pre>
      </details>
    </div>
  );
}

// ─── MAIN SETTINGS COMPONENT ────────────────────
export default function NodeSettings({ nodeId }) {
  const node = useFlowStore((s) => s.nodes.find((n) => n.id === nodeId));
  const updateNodeData = useFlowStore((s) => s.updateNodeData);
  const showNotification = useUIStore((s) => s.showNotification);

  if (!node) return null;

  const settings = NODE_DEFINITIONS[node.type]?.settings || [];

  const handleChange = (key, value) => {
    updateNodeData(nodeId, { [key]: value });
  };

  return (
    <div className="animate-fade-in">
      {settings.map((setting) => (
        <div key={setting.key} style={{ marginBottom: 14 }}>
          <label className="input-label">{setting.label}</label>

          {setting.type === 'text' && (
            <input
              type="text"
              className="input-field nodrag"
              value={node.data?.[setting.key] || setting.default || ''}
              onChange={(e) => handleChange(setting.key, e.target.value)}
              placeholder={setting.placeholder || ''}
            />
          )}

          {setting.type === 'textarea' && (
            <textarea
              className="textarea-field nodrag"
              value={node.data?.[setting.key] || setting.default || ''}
              onChange={(e) => handleChange(setting.key, e.target.value)}
              placeholder={setting.placeholder || ''}
              rows={setting.rows || 3}
            />
          )}

          {setting.type === 'select' && (
            <select
              className="select-field nodrag"
              value={node.data?.[setting.key] || setting.default || ''}
              onChange={(e) => handleChange(setting.key, e.target.value)}
            >
              {setting.options?.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          )}

          {setting.type === 'number' && (
            <input
              type="number"
              className="input-field nodrag"
              value={node.data?.[setting.key] || setting.default || 0}
              onChange={(e) => handleChange(setting.key, Number(e.target.value))}
              min={setting.min}
              max={setting.max}
              step={setting.step || 1}
            />
          )}

          {setting.type === 'toggle' && (
            <div
              className={`toggle nodrag ${node.data?.[setting.key] ? 'active' : ''}`}
              onClick={() => handleChange(setting.key, !node.data?.[setting.key])}
            >
              <div className="toggle-handle" />
            </div>
          )}

          {setting.type === 'color' && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
              <input
                type="color"
                className="nodrag"
                value={node.data?.[setting.key] || setting.default || '#5865f2'}
                onChange={(e) => handleChange(setting.key, e.target.value)}
                style={{ width: 36, height: 30, border: 'none', background: 'none', cursor: 'pointer' }}
              />
              <input
                type="text"
                className="input-field nodrag"
                value={node.data?.[setting.key] || setting.default || '#5865f2'}
                onChange={(e) => handleChange(setting.key, e.target.value)}
                style={{ flex: 1 }}
              />
            </div>
          )}

          {/* Modal Inputs Builder */}
          {setting.type === 'modal_inputs' && (
            <ModalInputsBuilder
              value={node.data?.[setting.key] || setting.default || []}
              onChange={(val) => handleChange(setting.key, val)}
            />
          )}

          {/* Buttons Builder */}
          {setting.type === 'button_builder' && (
            <ButtonsBuilder
              value={node.data?.[setting.key] || setting.default || []}
              onChange={(val) => handleChange(setting.key, val)}
            />
          )}

          {/* Slash Command Builder */}
          {setting.type === 'slash_builder' && (
            <SlashCommandBuilder
              value={node.data?.[setting.key] || setting.default || []}
              onChange={(val) => handleChange(setting.key, val)}
            />
          )}

          {setting.help && (
            <div style={{ fontSize: 11, color: 'var(--discord-text-muted)', marginTop: 4 }}>
              {setting.help}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
