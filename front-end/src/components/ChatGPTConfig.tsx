import React from 'react';
import { ChatGPTConfigData } from '../types';

interface ChatGPTConfigProps {
  config: ChatGPTConfigData;
  updateConfig: (key: string, value: string) => void;
}

const ChatGPTConfig: React.FC<ChatGPTConfigProps> = ({ config, updateConfig }) => {
  return (
    <div className="config-section">
      <h2>ChatGPT Configuration</h2>
      
      <div className="form-group">
        <label htmlFor="chatgpt-api-key">API Key</label>
        <input
          type="password"
          id="chatgpt-api-key"
          value={config.apiKey}
          onChange={(e) => updateConfig('apiKey', e.target.value)}
          placeholder="Enter OpenAI API Key"
        />
      </div>
      
      <div className="form-group">
        <label htmlFor="chatgpt-model">Model Name</label>
        <input
          type="text"
          id="chatgpt-model"
          value={config.modelName || 'gpt-3.5-turbo'}
          onChange={(e) => updateConfig('modelName', e.target.value)}
          placeholder="gpt-3.5-turbo"
        />
      </div>
      
      <div className="form-group">
        <p>
          <strong>Note:</strong> The C++ implementation is used internally for message processing.
        </p>
      </div>
    </div>
  );
};

export default ChatGPTConfig;