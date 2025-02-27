import { App, ExpressReceiver } from '@slack/bolt';
import dotenv from 'dotenv';
import { ShiftRequest, processShiftMessage } from './messageProcessor';
import { GoogleCalendarClient } from '../../gcal-integration/src';
import { ChatGPTClient } from '../../chatgpt-api/src';

dotenv.config();

interface SlackClientConfig {
  token: string;
  signingSecret: string;
  channelId: string;
  ownUserId: string;
}

export class SlackClient {
  private app: App;
  private config: SlackClientConfig;
  private gcalClient: GoogleCalendarClient;
  private gptClient: ChatGPTClient;
  
  constructor(config: SlackClientConfig, gcalClient: GoogleCalendarClient, gptClient: ChatGPTClient) {
    this.config = config;
    this.gcalClient = gcalClient;
    this.gptClient = gptClient;
    
    const receiver = new ExpressReceiver({
      signingSecret: config.signingSecret,
      processBeforeResponse: true
    });
    
    this.app = new App({
      token: config.token,
      receiver
    });
    
    this.setupMessageListeners();
  }
  
  private setupMessageListeners(): void {
    // Listen for messages in the specified channel
    this.app.message(async ({ message, say }) => {
      // Skip messages from the bot itself
      if (message.user === this.config.ownUserId) {
        return;
      }
      
      // Check if the message is in the specified channel
      if (message.channel !== this.config.channelId) {
        return;
      }
      
      try {
        // Process the message to identify shift requests
        const messageText = message.text || '';
        
        // Use GPT to analyze the message
        const shiftRequest = await this.gptClient.analyzeShiftRequest(messageText);
        
        if (shiftRequest) {
          console.log('Shift request detected:', shiftRequest);
          
          // Check calendar availability
          const isAvailable = await this.gcalClient.checkAvailability(
            shiftRequest.date,
            shiftRequest.startTime,
            shiftRequest.endTime
          );
          
          if (isAvailable) {
            console.log('User is available, responding to request...');
            
            // Reply to the shift request
            await say({
              text: 'sure',
              thread_ts: message.ts
            });
            
            // Add the shift to Google Calendar
            await this.gcalClient.addShiftEvent(
              shiftRequest.className,
              shiftRequest.date,
              shiftRequest.startTime,
              shiftRequest.endTime,
              shiftRequest.location
            );
            
            console.log('Successfully responded and added to calendar');
          } else {
            console.log('User is not available, not responding');
          }
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    });
  }
  
  public async start(port: number = 3000): Promise<void> {
    await this.app.start(port);
    console.log(`Slack bot is running on port ${port}`);
  }
  
  public async stop(): Promise<void> {
    await this.app.stop();
    console.log('Slack bot has been stopped');
  }
}

export default SlackClient;