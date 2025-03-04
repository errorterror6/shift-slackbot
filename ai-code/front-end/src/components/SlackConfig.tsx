import React from 'react';
import { SlackConfigData } from '../types';

interface SlackConfigProps {
  config: SlackConfigData;
  updateConfig: (key: string, value: string) => void;
}

const SlackConfig: React.FC<SlackConfigProps> = ({ config, updateConfig }) => {
  return (
    <div className="config-section">
      <h2>Slack Configuration</h2>
      
      <div className="form-group">
        <label htmlFor="slack-token">Bot Token</label>
        <input
          type="text"
          id="slack-token"
          value={config.token}
          onChange={(e) => updateConfig('token', e.target.value)}
          placeholder="xoxb-..."
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="slack-signing-secret">Signing Secret</label>
        <input
          type="password"
          id="slack-signing-secret"
          value={config.signingSecret}
          onChange={(e) => updateConfig('signingSecret', e.target.value)}
          placeholder="Enter Slack signing secret"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="slack-channel-id">Channel ID</label>
        <input
          type="text"
          id="slack-channel-id"
          value={config.channelId}
          onChange={(e) => updateConfig('channelId', e.target.value)}
          placeholder="C0123456789"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="slack-user-id">Your User ID</label>
        <input
          type="text"
          id="slack-user-id"
          value={config.ownUserId}
          onChange={(e) => updateConfig('ownUserId', e.target.value)}
          placeholder="U0123456789"
        />
      </div>
    </div>
  );
};

export default SlackConfig;