import React, { useState } from 'react';
import { X, Key, Save, Eye, EyeOff } from 'lucide-react';
import useUIStore from '../../store/uiStore';
import useProjectStore from '../../store/projectStore';

const ALL_INTENTS = [
  'Guilds', 'GuildMembers', 'GuildModeration', 'GuildEmojisAndStickers',
  'GuildIntegrations', 'GuildWebhooks', 'GuildInvites', 'GuildVoiceStates',
  'GuildPresences', 'GuildMessages', 'GuildMessageReactions',
  'GuildMessageTyping', 'DirectMessages', 'DirectMessageReactions',
  'DirectMessageTyping', 'MessageContent', 'GuildScheduledEvents',
  'AutoModerationConfiguration', 'AutoModerationExecution',
];

export default function SettingsPanel() {
  const setShowSettings = useUIStore((s) => s.setShowSettings);
  const showNotification = useUIStore((s) => s.showNotification);
  const settings = useProjectStore((s) => s.settings);
  const updateSettings = useProjectStore((s) => s.updateSettings);

  const [localSettings, setLocalSettings] = useState({ ...settings });
  const [token, setToken] = useState('');
  const [showToken, setShowToken] = useState(false);

  const handleSave = () => {
    const toSave = { ...localSettings };
    if (token) toSave.bot_token = token;
    updateSettings(toSave);
    setToken('');
    showNotification('Settings saved!', 'success');
  };

  const toggleIntent = (intent) => {
    const intents = localSettings.intents || [];
    const newIntents = intents.includes(intent)
      ? intents.filter((i) => i !== intent)
      : [...intents, intent];
    setLocalSettings({ ...localSettings, intents: newIntents });
  };

  const maskedToken = settings.bot_token
    ? settings.bot_token.substring(0, 6) + '...' + settings.bot_token.substring(settings.bot_token.length - 4)
    : '';

  return (
    <div className="modal-overlay" onClick={() => setShowSettings(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ width: 540 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
          <h2 className="modal-title" style={{ margin: 0 }}>Bot Settings</h2>
          <button className="btn btn-ghost btn-icon" onClick={() => setShowSettings(false)}>
            <X size={18} />
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Token */}
          <div>
            <label className="input-label">Bot Token</label>
            <div style={{ display: 'flex', gap: 8 }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  type={showToken ? 'text' : 'password'}
                  className="input-field"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  placeholder={settings.bot_token ? `Current: ${maskedToken}` : 'Enter your bot token'}
                />
              </div>
              <button className="btn btn-ghost btn-icon" onClick={() => setShowToken(!showToken)}>
                {showToken ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div style={{ fontSize: 11, color: 'var(--discord-text-muted)', marginTop: 4 }}>
              🔒 Token is stored in your browser's localStorage. Never shared externally.
            </div>
          </div>

          {/* Prefix */}
          <div>
            <label className="input-label">Command Prefix</label>
            <input
              type="text"
              className="input-field"
              value={localSettings.bot_prefix || '!'}
              onChange={(e) => setLocalSettings({ ...localSettings, bot_prefix: e.target.value })}
              style={{ width: 80 }}
            />
          </div>

          {/* Activity */}
          <div style={{ display: 'flex', gap: 12 }}>
            <div style={{ width: 140 }}>
              <label className="input-label">Activity Type</label>
              <select
                className="select-field"
                value={localSettings.activity_type || 'Playing'}
                onChange={(e) => setLocalSettings({ ...localSettings, activity_type: e.target.value })}
              >
                <option value="Playing">Playing</option>
                <option value="Streaming">Streaming</option>
                <option value="Listening">Listening</option>
                <option value="Watching">Watching</option>
                <option value="Competing">Competing</option>
              </select>
            </div>
            <div style={{ flex: 1 }}>
              <label className="input-label">Activity Text</label>
              <input
                type="text"
                className="input-field"
                value={localSettings.activity_text || ''}
                onChange={(e) => setLocalSettings({ ...localSettings, activity_text: e.target.value })}
                placeholder="with Discord Bot Builder"
              />
            </div>
          </div>

          {/* Intents */}
          <div>
            <label className="input-label">Gateway Intents</label>
            <div style={{
              display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 4,
              maxHeight: 200, overflowY: 'auto', padding: 4,
            }}>
              {ALL_INTENTS.map((intent) => (
                <label
                  key={intent}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 8,
                    padding: '4px 8px', borderRadius: 4, cursor: 'pointer',
                    fontSize: 12, color: 'var(--discord-text-normal)',
                  }}
                >
                  <input
                    type="checkbox"
                    checked={localSettings.intents?.includes(intent) || false}
                    onChange={() => toggleIntent(intent)}
                    style={{ accentColor: 'var(--discord-blurple)' }}
                  />
                  {intent}
                </label>
              ))}
            </div>
          </div>

          {/* Save */}
          <button className="btn btn-primary" onClick={handleSave} style={{ alignSelf: 'flex-end' }}>
            <Save size={14} /> Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
