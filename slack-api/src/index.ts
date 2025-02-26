// Basic Slack Bot implementation using Bolt framework
import { App } from '@slack/bolt';

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET
});

// Listens to incoming messages that contain "hello"
app.message(/hello/, async ({ message, say }) => {
  await say(`Hello, <@${message.user}>!`);
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);
  console.log('⚡️ Slack bot is running');
})();
