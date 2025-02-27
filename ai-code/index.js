const { SlackClient } = require('./slack-api/dist');
const { GoogleCalendarClient } = require('./gcal-integration/dist');
const { ChatGPTClient } = require('./chatgpt-api/dist');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

async function main() {
  try {
    // Create the ChatGPT client
    const gptClient = new ChatGPTClient({
      apiKey: process.env.OPENAI_API_KEY,
      modelName: process.env.OPENAI_MODEL_NAME || 'gpt-3.5-turbo'
    });
    
    // Create the Google Calendar client
    const gcalClient = new GoogleCalendarClient({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_REDIRECT_URI,
      refreshToken: process.env.GOOGLE_REFRESH_TOKEN
    });
    
    // Create the Slack client
    const slackClient = new SlackClient(
      {
        token: process.env.SLACK_BOT_TOKEN,
        signingSecret: process.env.SLACK_SIGNING_SECRET,
        channelId: process.env.SLACK_CHANNEL_ID,
        ownUserId: process.env.SLACK_OWN_USER_ID
      },
      gcalClient,
      gptClient
    );
    
    // Start the Slack bot
    await slackClient.start(process.env.PORT || 3000);
    console.log('Shift SlackBot is running!');
    
    // Handle graceful shutdown
    const shutdown = async () => {
      console.log('Shutting down...');
      await slackClient.stop();
      process.exit(0);
    };
    
    process.on('SIGINT', shutdown);
    process.on('SIGTERM', shutdown);
  } catch (error) {
    console.error('Error starting bot:', error);
    process.exit(1);
  }
}

// Run the bot
main();