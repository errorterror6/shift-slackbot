export interface SlackConfigData {
  token: string;
  signingSecret: string;
  channelId: string;
  ownUserId: string;
}

export interface GCalConfigData {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  refreshToken?: string;
}

export interface ChatGPTConfigData {
  apiKey: string;
  modelName?: string;
}

export interface ConfigData {
  slack: SlackConfigData;
  gcal: GCalConfigData;
  chatgpt: ChatGPTConfigData;
}