import React from 'react';
import { GCalConfigData } from '../types';

interface GCalConfigProps {
  config: GCalConfigData;
  updateConfig: (key: string, value: string) => void;
}

const GCalConfig: React.FC<GCalConfigProps> = ({ config, updateConfig }) => {
  return (
    <div className="config-section">
      <h2>Google Calendar Configuration</h2>
      
      <div className="form-group">
        <label htmlFor="gcal-client-id">Client ID</label>
        <input
          type="text"
          id="gcal-client-id"
          value={config.clientId}
          onChange={(e) => updateConfig('clientId', e.target.value)}
          placeholder="Google Cloud Client ID"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="gcal-client-secret">Client Secret</label>
        <input
          type="password"
          id="gcal-client-secret"
          value={config.clientSecret}
          onChange={(e) => updateConfig('clientSecret', e.target.value)}
          placeholder="Google Cloud Client Secret"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="gcal-redirect-uri">Redirect URI</label>
        <input
          type="text"
          id="gcal-redirect-uri"
          value={config.redirectUri}
          onChange={(e) => updateConfig('redirectUri', e.target.value)}
          placeholder="http://localhost:3000/auth/callback"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="gcal-refresh-token">Refresh Token</label>
        <input
          type="password"
          id="gcal-refresh-token"
          value={config.refreshToken || ''}
          onChange={(e) => updateConfig('refreshToken', e.target.value)}
          placeholder="Google OAuth Refresh Token"
        />
      </div>
      
      <div>
        <button
          onClick={() => {
            alert('In a real implementation, this would open the Google OAuth consent screen');
            // In a real app, we would redirect to Google's OAuth URL
          }}
        >
          Authorize with Google
        </button>
      </div>
    </div>
  );
};

export default GCalConfig;