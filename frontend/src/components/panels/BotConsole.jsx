import React from 'react';
import { X, Play, Square, Trash2 } from 'lucide-react';
import useUIStore from '../../store/uiStore';

export default function BotConsole() {
  const setShowConsole = useUIStore((s) => s.setShowConsole);
  const botRunning = useUIStore((s) => s.botRunning);
  const setBotRunning = useUIStore((s) => s.setBotRunning);
  const botLogs = useUIStore((s) => s.botLogs);
  const clearBotLogs = useUIStore((s) => s.clearBotLogs);
  const addBotLog = useUIStore((s) => s.addBotLog);
  const showNotification = useUIStore((s) => s.showNotification);

  const handleStart = () => {
    setBotRunning(true);
    addBotLog({ type: 'info', message: '🤖 Bot starting... (Export and run your bot separately for now)' });
    showNotification('Bot runner is in preview mode. Export your bot and run it locally.', 'info');
  };

  const handleStop = () => {
    setBotRunning(false);
    addBotLog({ type: 'info', message: '🛑 Bot stopped.' });
  };

  return (
    <div className="modal-overlay" onClick={() => setShowConsole(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()} style={{ width: 600, maxHeight: '70vh' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 className="modal-title" style={{ margin: 0 }}>Bot Console</h2>
            <div className={`status-dot ${botRunning ? 'online' : 'offline'}`} />
            <span style={{ fontSize: 12, color: 'var(--discord-text-muted)' }}>
              {botRunning ? 'Running' : 'Stopped'}
            </span>
          </div>
          <button className="btn btn-ghost btn-icon" onClick={() => setShowConsole(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Controls */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
          {!botRunning ? (
            <button className="btn btn-primary btn-sm" onClick={handleStart}>
              <Play size={14} /> Start Bot
            </button>
          ) : (
            <button className="btn btn-danger btn-sm" onClick={handleStop}>
              <Square size={14} /> Stop Bot
            </button>
          )}
          <button className="btn btn-secondary btn-sm" onClick={clearBotLogs}>
            <Trash2 size={14} /> Clear
          </button>
        </div>

        {/* Log output */}
        <div
          style={{
            background: 'var(--discord-bg-floating)',
            borderRadius: 8,
            padding: 12,
            fontFamily: "'Consolas', 'Monaco', 'Courier New', monospace",
            fontSize: 12,
            lineHeight: 1.6,
            maxHeight: 300,
            overflowY: 'auto',
            minHeight: 200,
          }}
        >
          {botLogs.length === 0 ? (
            <span style={{ color: 'var(--discord-text-muted)' }}>
              Bot console output will appear here...
            </span>
          ) : (
            botLogs.map((log, i) => (
              <div
                key={i}
                style={{
                  color: log.type === 'stderr' || log.type === 'error' ? '#ed4245'
                    : log.type === 'info' ? '#5865f2'
                    : '#dcddde',
                }}
              >
                <span style={{ color: 'var(--discord-text-muted)', marginRight: 8 }}>
                  [{new Date(log.timestamp).toLocaleTimeString()}]
                </span>
                {log.message}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
