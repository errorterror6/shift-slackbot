import React from 'react';

interface BotControlsProps {
  status: 'running' | 'stopped';
  isConfigValid: boolean;
  onStart: () => void;
  onStop: () => void;
}

const BotControls: React.FC<BotControlsProps> = ({ 
  status, 
  isConfigValid, 
  onStart, 
  onStop 
}) => {
  return (
    <div className="controls-section">
      <div>
        <div style={{ marginBottom: '10px' }}>
          Status: 
          <span 
            className={`status-indicator status-${status}`}
          ></span>
          {status === 'running' ? 'Running' : 'Stopped'}
        </div>
        
        <button
          onClick={onStart}
          disabled={!isConfigValid || status === 'running'}
        >
          Start Bot
        </button>
        
        <button
          className="stop"
          onClick={onStop}
          disabled={status === 'stopped'}
        >
          Stop Bot
        </button>
      </div>
    </div>
  );
};

export default BotControls;