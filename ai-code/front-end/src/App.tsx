import React, { useState, useEffect } from 'react';
import './App.css';
import SlackConfig from './components/SlackConfig';
import GCalConfig from './components/GCalConfig';
import ChatGPTConfig from './components/ChatGPTConfig';
import BotControls from './components/BotControls';
import { ConfigData } from './types';

const App: React.FC = () => {
  const [config, setConfig] = useState<ConfigData>({
    slack: {
      token: '',
      signingSecret: '',
      channelId: '',
      ownUserId: ''
    },
    gcal: {
      clientId: '',
      clientSecret: '',
      redirectUri: 'http://localhost:3000/auth/callback',
      refreshToken: ''
    },
    chatgpt: {
      apiKey: '',
      modelName: 'gpt-3.5-turbo'
    }
  });
  
  const [botStatus, setBotStatus] = useState<'stopped' | 'running'>('stopped');
  const [isConfigValid, setIsConfigValid] = useState<boolean>(false);
  
  // Load saved config from localStorage on startup
  useEffect(() => {
    const savedConfig = localStorage.getItem('shiftBotConfig');
    if (savedConfig) {
      try {
        const parsedConfig = JSON.parse(savedConfig);
        setConfig(parsedConfig);
        validateConfig(parsedConfig);
      } catch (error) {
        console.error('Error parsing saved config:', error);
      }
    }
  }, []);
  
  // Validate the configuration
  const validateConfig = (configData: ConfigData): void => {
    const slackValid = !!configData.slack.token && 
                       !!configData.slack.signingSecret && 
                       !!configData.slack.channelId &&
                       !!configData.slack.ownUserId;
                       
    const gcalValid = !!configData.gcal.clientId && 
                      !!configData.gcal.clientSecret && 
                      !!configData.gcal.redirectUri;
                      
    const chatgptValid = !!configData.chatgpt.apiKey;
    
    setIsConfigValid(slackValid && gcalValid && chatgptValid);
  };
  
  // Update config values
  const updateConfig = (section: keyof ConfigData, key: string, value: string): void => {
    const updatedConfig = {
      ...config,
      [section]: {
        ...config[section],
        [key]: value
      }
    };
    
    setConfig(updatedConfig);
    validateConfig(updatedConfig);
    
    // Save to localStorage
    localStorage.setItem('shiftBotConfig', JSON.stringify(updatedConfig));
  };
  
  // Start the bot
  const startBot = (): void => {
    // In a real implementation, this would use an API call to start the bot
    console.log('Starting bot with config:', config);
    setBotStatus('running');
  };
  
  // Stop the bot
  const stopBot = (): void => {
    // In a real implementation, this would use an API call to stop the bot
    console.log('Stopping bot');
    setBotStatus('stopped');
  };
  
  return (
    <div className="app-container">
      <header>
        <h1>Shift SlackBot Configuration</h1>
      </header>
      
      <main>
        <SlackConfig 
          config={config.slack} 
          updateConfig={(key, value) => updateConfig('slack', key, value)}
        />
        
        <GCalConfig 
          config={config.gcal} 
          updateConfig={(key, value) => updateConfig('gcal', key, value)}
        />
        
        <ChatGPTConfig 
          config={config.chatgpt} 
          updateConfig={(key, value) => updateConfig('chatgpt', key, value)}
        />
        
        <BotControls 
          status={botStatus} 
          isConfigValid={isConfigValid}
          onStart={startBot}
          onStop={stopBot}
        />
      </main>
      
      <footer>
        <p>&copy; 2025 Shift SlackBot</p>
      </footer>
    </div>
  );
};

export default App;